// Live data for the Daily Peddigrew sample: Toronto weather, local headlines,
// and recent and upcoming games for Toronto-area teams. Cached at the CDN.

const TZ = "America/Toronto";
const TEAMS = [
  { sport: "hockey", league: "nhl", abbr: ["TOR"] },
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
  const d = await getJSON("https://api.open-meteo.com/v1/forecast?latitude=43.65&longitude=-79.38&current=temperature_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&wind_speed_unit=kmh&timezone=America%2FToronto&forecast_days=1");
  return {
    temp: Math.round(d.current.temperature_2m),
    desc: WMO[d.current.weather_code] || "",
    hi: Math.round(d.daily.temperature_2m_max[0]),
    lo: Math.round(d.daily.temperature_2m_min[0]),
    feels: Math.round(d.current.apparent_temperature),
    wind: Math.round(d.current.wind_speed_10m),
    windDir: Math.round(d.current.wind_direction_10m),
    rain: d.daily.precipitation_probability_max ? d.daily.precipitation_probability_max[0] : null,
  };
}

// One headline per local source. Each tries its own feed first, then a Google News
// search limited to that outlet, so a feed URL change doesn't blank the row.
const gnews = (q) => `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-CA&gl=CA&ceid=CA:en`;
const SOURCES = [
  { name: "CBC News", take: 1, urls: ["https://www.cbc.ca/webfeed/rss/rss-canada-toronto", gnews("site:cbc.ca toronto when:1d")] },
  { name: "CTV News", take: 1, urls: ["https://www.ctvnews.ca/arc/outboundfeeds/rss/category/toronto/?outputType=xml", gnews("site:ctvnews.ca toronto when:1d")] },
  { name: "CP24", take: 1, urls: ["https://www.cp24.com/arc/outboundfeeds/rss/category/local/?outputType=xml", "https://www.cp24.com/arc/outboundfeeds/rss/category/news/?outputType=xml", gnews("site:cp24.com toronto when:1d")] },
  { name: "York Region News", take: 1, urls: ["https://www.yorkregion.com/search/?f=rss&t=article&l=20&s=start_time&sd=desc", gnews('"York Region" when:2d')] },
];

function clean(t) {
  return t.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#39;|&#x27;|&apos;|&#8217;|&rsquo;/g, "'").replace(/&quot;|&#8220;|&#8221;/g, '"').replace(/&#8212;|&#8211;/g, "-").replace(/\s+/g, " ").trim();
}

async function titles(url) {
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (usechairlift.com)" } });
  if (!r.ok) throw new Error(String(r.status));
  const xml = await r.text();
  const out = [];
  for (const m of xml.matchAll(/<(item|entry)[\s>]([\s\S]*?)<\/\1>/g)) {
    const t = (m[2].match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1];
    // Google News appends " - Outlet" to every title.
    let title = t && clean(t);
    if (title && url.includes("news.google.com")) title = title.replace(/\s+-\s+[^-]+$/, "");
    if (title) out.push(title);
    if (out.length === 8) break;
  }
  if (!out.length) throw new Error("no items");
  return out;
}

async function news(debug) {
  const results = await Promise.all(SOURCES.map(async (src) => {
    for (const url of src.urls) {
      try {
        const list = await titles(url);
        if (debug) debug[src.name] = url;
        return { src, list };
      } catch (e) {
        if (debug) debug[src.name + " " + url] = String(e.message || e);
      }
    }
    return { src, list: [] };
  }));
  const seen = new Set(), items = [];
  for (const { src, list } of results) {
    let n = 0;
    for (const title of list) {
      const key = title.toLowerCase().slice(0, 40);
      if (seen.has(key)) continue;
      seen.add(key);
      items.push({ title, source: src.name });
      if (++n === src.take) break;
    }
  }
  return items;
}

function name(team) {
  return SHORT[team.shortDisplayName] || team.shortDisplayName || team.name;
}

function side(c, score) {
  return { name: name(c.team), abbr: c.team.abbreviation || "", logo: c.team.logo || "", score: score ? String(c.score) : "" };
}

function lastName(a) {
  const n = (a && (a.lastName || a.fullName || a.displayName)) || "";
  return n.split(" ").slice(-1)[0];
}


// Top performers for a finished game, from ESPN's game summary.
async function performers(t, eventId, teamId) {
  let d;
  try { d = await getJSON(`https://site.api.espn.com/apis/site/v2/sports/${t.sport}/${t.league}/summary?event=${eventId}`); } catch (e) { return []; }
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
      return top.map((p) => p.n + " " + [p.goals ? p.goals + " G" : "", p.assists ? p.assists + " A" : ""].filter(Boolean).join(", "));
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
  return bits;
}

// Mark the opponent with "vs" (our team at home) or "@" (our team away).
function withRel(teams, mine) {
  const rel = mine.homeAway === "home" ? "vs" : "@";
  return teams.map((t) => (t.abbr === mine.team.abbreviation ? t : { ...t, rel }));
}

async function sports() {
  const now = new Date();
  const days = [-1, 0, 1, 2, 3, 4, 5, 6].map((o) => ymd(new Date(now.getTime() + o * 864e5)));
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
      const base = { logo: mine.team.logo || "", league: t.league.toUpperCase(), when: when.getTime(), team: t.league + mine.team.abbreviation };
      if (st.completed && day <= today) {
        const [w, l] = Number(mine.score) >= Number(other.score) ? [mine, other] : [other, mine];
        let perf = [];
        if (t.league === "nba" && mine.leaders) {
          const pts = mine.leaders.find((x) => x.name === "points");
          const ast = mine.leaders.find((x) => x.name === "assists");
          const bits = [];
          if (pts && pts.leaders[0]) bits.push(`${lastName(pts.leaders[0].athlete)} ${pts.leaders[0].displayValue} pts`);
          if (ast && ast.leaders[0]) bits.push(`${lastName(ast.leaders[0].athlete)} ${ast.leaders[0].displayValue} ast`);
          perf = bits;
        }
        if (!perf.length) perf = await performers(t, ev.id, mine.team.id);
        finals.push({ ...base, line: `${name(w.team)} ${w.score}, ${name(l.team)} ${l.score}`, teams: withRel([side(w, 1), side(l, 1)], mine), sep: ",", status: st.shortDetail || "Final", perf });
      } else if (st.state === "in") {
        live.push({ ...base, line: `${name(mine.team)} ${mine.score}, ${name(other.team)} ${other.score}`, teams: withRel([side(mine, 1), side(other, 1)], mine), sep: ",", status: "Live", perf: st.shortDetail ? [st.shortDetail] : [] });
      } else if (st.state === "pre" && when.getTime() > now.getTime() - 3 * 36e5) {
        const time = when.toLocaleTimeString("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" });
        const hour = Number(when.toLocaleString("en-US", { timeZone: TZ, hour: "numeric", hour12: false }));
        const label = ymd(when) === today ? (hour >= 17 ? "Tonight" : "Today") : when.toLocaleDateString("en-US", { timeZone: TZ, weekday: "short" });
        next.push({ ...base, line: `${name(mine.team)} vs ${name(other.team)}`, teams: withRel([side(mine, 0), side(other, 0)], mine), sep: " vs", status: "Up next", perf: [`${label} · ${time}`] });
      }
    }
  })));

  finals.sort((a, b) => b.when - a.when);
  next.sort((a, b) => a.when - b.when);
  // Toronto teams only: up to two scoreboxes (live first, then last night's finals), then the next games, four cards in all.
  const played = [...live, ...finals].slice(0, 2);
  return played.concat(next.slice(0, 4 - played.length)).map(({ when, team, ...g }) => g);
}

export default async (req) => {
  const debug = new URL(req.url).searchParams.has("debug") ? {} : null;
  const [w, n, s] = await Promise.allSettled([weather(), news(debug), sports()]);
  const body = {
    weather: w.status === "fulfilled" ? w.value : null,
    news: n.status === "fulfilled" ? n.value : [],
    sports: s.status === "fulfilled" ? s.value : [],
  };
  if (debug) body.debug = debug;
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300",
      "Netlify-CDN-Cache-Control": debug ? "no-store" : "public, s-maxage=600, stale-while-revalidate=1800",
      "Netlify-Vary": "query",
    },
  });
};
