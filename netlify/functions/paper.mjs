// Live data for the Daily Peddigrew sample: Toronto weather, Toronto headlines,
// and recent and upcoming games for Toronto-area teams. Cached at the CDN.

const TZ = "America/Toronto";
const TEAMS = [
  { sport: "hockey", league: "nhl", abbr: ["TOR", "OTT"] },
  { sport: "basketball", league: "nba", abbr: ["TOR"] },
  { sport: "baseball", league: "mlb", abbr: ["TOR"] },
];
const SHORT = { "Maple Leafs": "Leafs" };
const WMO = { 0: "Clear", 1: "Mostly clear", 2: "Partly cloudy", 3: "Cloudy", 45: "Fog", 48: "Fog", 51: "Light drizzle", 53: "Drizzle", 55: "Drizzle", 56: "Freezing drizzle", 57: "Freezing drizzle", 61: "Light rain", 63: "Rain", 65: "Heavy rain", 66: "Freezing rain", 67: "Freezing rain", 71: "Light snow", 73: "Snow", 75: "Heavy snow", 77: "Snow grains", 80: "Showers", 81: "Showers", 82: "Heavy showers", 85: "Snow showers", 86: "Snow showers", 95: "Thunderstorms", 96: "Thunderstorms", 99: "Thunderstorms" };

function ymd(d) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d).replace(/-/g, "");
}

async function getJSON(url) {
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (usechairlift.com)" } });
  if (!r.ok) throw new Error(url + " " + r.status);
  return r.json();
}

async function weather() {
  const d = await getJSON("https://api.open-meteo.com/v1/forecast?latitude=43.65&longitude=-79.38&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FToronto&forecast_days=1");
  return {
    temp: Math.round(d.current.temperature_2m),
    desc: WMO[d.current.weather_code] || "",
    hi: Math.round(d.daily.temperature_2m_max[0]),
    lo: Math.round(d.daily.temperature_2m_min[0]),
  };
}

async function news() {
  const r = await fetch("https://www.cbc.ca/webfeed/rss/rss-canada-toronto", { headers: { "User-Agent": "Mozilla/5.0 (usechairlift.com)" } });
  if (!r.ok) throw new Error("news " + r.status);
  const xml = await r.text();
  const items = [];
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const t = (m[1].match(/<title>([\s\S]*?)<\/title>/) || [])[1];
    if (!t) continue;
    const title = t.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').trim();
    if (title) items.push({ title, source: "CBC News" });
    if (items.length === 5) break;
  }
  return items;
}

function name(team) {
  return SHORT[team.shortDisplayName] || team.shortDisplayName || team.name;
}

function lastName(a) {
  const n = (a && (a.lastName || a.fullName || a.displayName)) || "";
  return n.split(" ").slice(-1)[0];
}


// Top performers for a finished game, from ESPN's game summary.
async function performers(t, eventId, teamId) {
  let d;
  try { d = await getJSON(`https://site.api.espn.com/apis/site/v2/sports/${t.sport}/${t.league}/summary?event=${eventId}`); } catch (e) { return ""; }
  if (t.league === "nhl") {
    const team = ((d.boxscore && d.boxscore.players) || []).find((x) => String(x.team && x.team.id) === String(teamId));
    const tally = {};
    for (const g of (team && team.statistics) || []) {
      const keys = (g.keys || g.names || []).map((k) => String(k).toLowerCase());
      const labels = (g.labels || []).map((k) => String(k).toUpperCase());
      const gi = keys.indexOf("goals") >= 0 ? keys.indexOf("goals") : labels.indexOf("G");
      const ai = keys.indexOf("assists") >= 0 ? keys.indexOf("assists") : labels.indexOf("A");
      if (gi < 0 || ai < 0) continue;
      for (const a of g.athletes || []) {
        const n = lastName(a.athlete);
        const goals = Number(a.stats && a.stats[gi]) || 0, assists = Number(a.stats && a.stats[ai]) || 0;
        if (n && goals + assists) tally[n] = { n, goals, assists };
      }
    }
    const top = Object.values(tally).sort((a, b) => (b.goals + b.assists) - (a.goals + a.assists) || b.goals - a.goals).slice(0, 2);
    if (top.length) {
      return "(" + top.map((p) => p.n + " " + [p.goals ? p.goals + " G" : "", p.assists ? p.assists + " A" : ""].filter(Boolean).join(", ")).join(" · ") + ")";
    }
  }
  const lead = (d.leaders || []).find((x) => String(x.team && x.team.id) === String(teamId));
  const bits = [];
  for (const cat of (lead && lead.leaders) || []) {
    const top = cat.leaders && cat.leaders[0];
    if (!top || !top.athlete) continue;
    const label = { goals: "G", assists: "A", points: "pts", homeRuns: "HR", RBIs: "RBI", rebounds: "reb" }[cat.name] || cat.shortDisplayName || "";
    bits.push(`${lastName(top.athlete)} ${top.displayValue} ${label}`.trim());
    if (bits.length === 2) break;
  }
  return bits.length ? `(${bits.join(" · ")})` : "";
}

async function sports() {
  const now = new Date();
  const days = [-1, 0, 1, 2, 3].map((o) => ymd(new Date(now.getTime() + o * 864e5)));
  const today = days[1];
  const finals = [], live = [], next = [];

  await Promise.all(TEAMS.flatMap((t) => days.map(async (day) => {
    let d;
    try { d = await getJSON(`https://site.api.espn.com/apis/site/v2/sports/${t.sport}/${t.league}/scoreboard?dates=${day}`); } catch (e) { return; }
    for (const ev of d.events || []) {
      const c = ev.competitions && ev.competitions[0];
      if (!c) continue;
      const mine = c.competitors.find((x) => t.abbr.includes(x.team.abbreviation));
      if (!mine) continue;
      const other = c.competitors.find((x) => x !== mine);
      const st = ev.status.type;
      const when = new Date(ev.date);
      const base = { logo: mine.team.logo || "", when: when.getTime(), team: t.league + mine.team.abbreviation };
      if (st.completed && day <= today) {
        const [w, l] = Number(mine.score) >= Number(other.score) ? [mine, other] : [other, mine];
        let note = "";
        if (t.league === "nba" && mine.leaders) {
          const pts = mine.leaders.find((x) => x.name === "points");
          const ast = mine.leaders.find((x) => x.name === "assists");
          const bits = [];
          if (pts && pts.leaders[0]) bits.push(`${lastName(pts.leaders[0].athlete)} ${pts.leaders[0].displayValue} pts`);
          if (ast && ast.leaders[0]) bits.push(`${lastName(ast.leaders[0].athlete)} ${ast.leaders[0].displayValue} ast`);
          if (bits.length) note = `(${bits.join(" · ")})`;
        }
        if (!note) note = await performers(t, ev.id, mine.team.id);
        finals.push({ ...base, line: `${name(w.team)} ${w.score}, ${name(l.team)} ${l.score}`, status: st.shortDetail || "Final", note });
      } else if (st.state === "in") {
        live.push({ ...base, line: `${name(mine.team)} ${mine.score}, ${name(other.team)} ${other.score}`, status: "Live", note: st.shortDetail || "" });
      } else if (st.state === "pre" && when.getTime() > now.getTime() - 3 * 36e5) {
        const time = when.toLocaleTimeString("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" });
        const hour = Number(when.toLocaleString("en-US", { timeZone: TZ, hour: "numeric", hour12: false }));
        const label = ymd(when) === today ? (hour >= 17 ? "Tonight" : "Today") : when.toLocaleDateString("en-US", { timeZone: TZ, weekday: "short" });
        next.push({ ...base, line: `${name(mine.team)} vs ${name(other.team)}`, status: "Up next", note: `${label} · ${time}` });
      }
    }
  })));

  finals.sort((a, b) => b.when - a.when);
  next.sort((a, b) => a.when - b.when);
  const seen = new Set();
  const nextOnce = next.filter((g) => !seen.has(g.team) && seen.add(g.team));
  return [...finals.slice(0, 3), ...live, ...nextOnce].slice(0, 4).map(({ when, team, ...g }) => g);
}

export default async () => {
  const [w, n, s] = await Promise.allSettled([weather(), news(), sports()]);
  const body = {
    weather: w.status === "fulfilled" ? w.value : null,
    news: n.status === "fulfilled" ? n.value : [],
    sports: s.status === "fulfilled" ? s.value : [],
  };
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300",
      "Netlify-CDN-Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
    },
  });
};
