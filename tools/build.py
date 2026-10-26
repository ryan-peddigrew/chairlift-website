import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from common import *


OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ICON = {
    "chat": '<path d="M4 6h16v10H8l-4 4z"/><path d="M8 10h8M8 13h5"/>',
    "quote": '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 15h5M10 18h3"/>',
    "star": '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
    "cal": '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4M8 14h3M13 14h3M8 17h3"/>',
    "clock": '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    "copy": '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    "moon": '<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/>',
    "people": '<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M3 19c0-3 2.2-5 5-5s5 2 5 5M11 19c0-3 2.2-5 5-5s5 2 5 5"/>',
    "case": '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/>',
    "pulse": '<path d="M4 12h6l2-3 2 6 2-3h4"/><circle cx="12" cy="12" r="9"/>',
    "trend": '<path d="M4 18 L10 12 L13 15 L20 8"/><path d="M15 8 H20 V13"/>',
    "pin": '<path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z"/><circle cx="12" cy="11" r="2.2"/>',
}


def icon(name, cls="card-icon"):
    return f'<svg class="{cls}" viewBox="0 0 24 24" aria-hidden="true">{ICON[name]}</svg>'


def ticks(items):
    return '<ul class="ticks">' + "".join(f"<li>{i}</li>" for i in items) + "</ul>"


def ol(items):
    return "<ol>" + "".join(f"<li>{i}</li>" for i in items) + "</ol>"


STEPS = f'''      <div class="steps">
        <div class="step"><span class="step-num">Stop 1</span><h3>Onboard</h3><p>We learn how your team actually works today: where the hours go and what frustrates people most.</p></div>
        <div class="step"><span class="step-num">Stop 2</span><h3>Ride</h3><p>We fix one task inside the tools you already use, and refine it with the people who use it.</p></div>
        <div class="step"><span class="step-num">Stop 3</span><h3>Summit</h3><p>Your team gets time back for the work that matters. Then we look at what's next, together.</p></div>
      </div>
'''

FIT = f'''      <div class="fit-grid">
        <div class="fit-item">{icon("case", "fit-icon")}<h3>Service-based</h3><p>You win work through quotes, bookings and repeat clients.</p></div>
        <div class="fit-item">{icon("pulse", "fit-icon")}<h3>Sales-driven</h3><p>Follow-ups and relationships are what keep revenue moving.</p></div>
        <div class="fit-item">{icon("trend", "fit-icon")}<h3>Growing fast</h3><p>Your team is outgrowing inboxes, spreadsheets and sticky notes.</p></div>
        <div class="fit-item">{icon("pin", "fit-icon")}<h3>Multi-location</h3><p>Several teams or sites that need to work the same way.</p></div>
      </div>
'''

# ---------------------------------------------------------------- Examples data
EXAMPLES = [
    dict(id="after-hours", tag="Example · Home services", title="The after-hours inquiry",
         lead="A quote request comes in through the website at 8:40 pm. The office is closed. By the time anyone reads it the next morning, the customer has already booked someone who answered first.",
         before=["The form lands in a shared inbox.", "Nobody sees it until the next morning.", "The first reply goes out a day later, if someone remembers.", "The customer has already moved on."],
         after=["The customer gets a friendly reply within minutes, explaining what happens next.", "The inquiry is tagged by service and area and assigned to the right person.", "Anything urgent is flagged to whoever is on call.", "First thing in the morning, the team sees a short list of what came in overnight."],
         built="Your website form, your email, and the calendar or job software you already use."),
    dict(id="quotes", tag="Example · Trades and contractors", title="The quote that went quiet",
         lead="A salesperson sends a detailed quote and fully intends to follow up. Then the week happens. Two weeks later, nobody is sure whether the client ever replied.",
         before=["The quote is emailed as a PDF.", "Following up depends on someone remembering.", "Busy weeks mean check-ins slip, or never happen.", "Work is lost without anyone deciding to lose it."],
         after=["Sending the quote starts a short, polite follow-up sequence.", "Each check-in is written in the salesperson's own voice.", "The sequence stops the moment the client replies.", "The salesperson gets a nudge when a conversation needs a person."],
         built="The quoting tool or template you already send from, plus your email and CRM or spreadsheet."),
    dict(id="reviews", tag="Example · Multi-location clinic or salon", title="Reviews at every location",
         lead="Every location is told to ask happy customers for a review. A couple of them do. Most forget on busy days, and nobody can see which locations are asking.",
         before=["Asking for reviews depends on the person at the front desk.", "Some locations ask, most forget.", "Customers get the wrong link, or no link at all.", "Managers can't see what's being sent where."],
         after=["After each visit, a short thank-you goes out with the right review link for that location.", "One gentle reminder follows if it's still useful.", "Managers see requests by location in one place.", "Front-desk staff no longer have to remember to ask."],
         built="Your booking or point-of-sale system, your review profiles, and text or email."),
    dict(id="handover", tag="Example · Account team", title="When someone's out of the office",
         lead="Each account manager keeps client history in their own inbox. When someone is on holiday or moves on, their clients go quiet and the next person starts from scratch.",
         before=["Client history lives in individual inboxes.", "When someone's away, clients wait.", "A handover means forwarding dozens of emails.", "Follow-ups slip through the gap."],
         after=["Client conversations are logged in one shared place, without anyone retyping them.", "Follow-ups are scheduled from the record, not from memory.", "Covering for a colleague means opening the account and reading the history.", "Leadership can see every relationship at a glance."],
         built="Your shared inbox or email accounts, and the CRM or client list your team already keeps."),
]


def example_block(e, heading="h2"):
    return f'''      <article class="example" id="{e["id"]}">
        <div class="example-head">
          <span class="example-tag">{e["tag"]}</span>
          <{heading}>{e["title"]}</{heading}>
          <p>{e["lead"]}</p>
        </div>
        <div class="ba">
          <div class="ba-before"><h4>Before</h4>{ol(e["before"])}</div>
          <div class="ba-after"><h4>After</h4>{ol(e["after"])}</div>
          <div class="ba-wide"><strong>Typically built with:</strong> {e["built"]}</div>
        </div>
      </article>
'''


# ---------------------------------------------------------------- Home
CTA_HOME = "Show us one thing your team does over and over."

PAPER_ICON = {
    "focus": '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    "reply": '<path d="M9 7L4 12l5 5"/><path d="M4 12h10a6 6 0 0 1 6 6v1"/>',
    "trophy": '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8M10 17h4"/>',
    "cal": '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    "news": '<rect x="4" y="4" width="13" height="16" rx="1.5"/><path d="M17 8h3v10a2 2 0 0 1-2 2H6M7 8h7M7 12h7M7 16h4"/>',
    "laugh": '<path d="M12 3.5c5 0 9 3.2 9 7.3s-4 7.3-9 7.3c-1 0-2-.1-2.9-.4L5 20l1-3.6C4.2 15 3 13 3 10.8 3 6.7 7 3.5 12 3.5z"/><path d="M8.3 8.6h.01M11.5 8.6h.01"/><path d="M7.3 11.4c1 2.2 4.6 2.2 5.6 0"/><path d="M16.6 6.8v3.4M16.6 14h.01"/>',
    "sun": '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
}


def dp_h(icon_name, title, tag):
    return f'<div class="dp-h"><svg viewBox="0 0 24 24">{PAPER_ICON[icon_name]}</svg><b>{title}</b><i>{tag}</i></div>'


DP_FOCUS = [
    ("Finish the client proposal", "By noon", ["Draft is ready for your final read-through and edits before sending.", "Pricing page and project timeline still need final sign-off."]),
    ("Call back two warm leads", "Today", ["Both asked for a quick call sometime this week, ideally Thursday.", "Lead with the new Q4 package and the earliest start dates."]),
    ("Clear the inbox before 10", "Morning", ["Quick replies first, then archive the rest of it fast.", "Seven threads still need a simple yes or no today."]),
    ("Get outside for 30 minutes", "Health", ["A long walk with Benny around the block counts, rain or shine."]),
    ("Prep tomorrow's first call", "5 min", ["Client call at 8:30. Review notes and two questions to ask."]),
]
DP_FU = [
    ("Send the signed quote", "Fri", ["Re: Office reno quote for the client, signed copy still to send"]),
    ("Book Benny's vet visit", "Nov 1", ["Re: Annual check-up and shots, plus the nail trim"]),
    ("Renew the car insurance", "Oct 31", ["Re: Compare two quotes before renewal and pick the cheaper one"]),
    ("Invoice approval", "Waiting", ["Re: With finance since Monday, nudge them again today"]),
    ("Venue confirmation", "Nov 14", ["Re: Team event, waiting on the venue to confirm the date", "Ask about the room setup and the final headcount."]),
    ("Reply to Northline Supply", "Mon", ["Re: Confirm the Friday delivery window and who signs for it", "Check the dock hours before replying."]),
]
DP_GAMES = [("NHL", "TOR", "5", "NYR", "4", "Last night", "@"),
            ("NBA", "TOR", "", "WSH", "", "Tonight · 7:00 PM", "vs"),
            ("NHL", "TOR", "", "EDM", "", "Sat · 7:00 PM", "vs"),
            ("NBA", "TOR", "", "BOS", "", "Mon · 7:00 PM", "@")]


def dp_sports():
    def tm(abbr, score, lose, rel=""):
        r = f'<span class="dp-rel">{rel}</span> ' if rel else ""
        return f'<div class="dp-tm{" dp-lo" if lose else ""}"><span class="dp-noimg"></span><small>{r}{abbr}</small><b>{score}</b></div>'

    def lost(x, y):
        return bool(x) and int(x) < int(y)

    return "".join(
        f'<div class="dp-game"><div class="dp-gs"><i>{lg}</i><em>{mid}</em></div>{tm(a, sa, lost(sa, sb))}{tm(b, sb, lost(sb, sa), rel)}</div>'
        for lg, a, sa, b, sb, mid, rel in DP_GAMES)
DP_CAL = [("7:30", "Walk Benny outside", "20 min"), ("9:00", "Team check-in call", "15 min"), ("11:00", "Pipeline review meeting", "45 min"), ("12:30", "Client lunch with Sam", "1 hr"), ("3:00", "Proposal deep focus block", "90 min"), ("4:30", "Call with Brightwater CPA", "30 min"), ("6:00", "Gym after work", "1 hr")]
DP_INBOX = [("Wedding Planner", "Tasting menu options for Saturday", "Three options for Saturday. Pick one by Thursday."), ("Sam", "Proposal draft v2 is ready", "Changes are in. Needs your sign-off before it goes out."), ("Northline Supply Co.", "Confirmed Friday delivery", "Arrives between 9 and 11. Please have someone on site."), ("Brightwater CPA", "Q4 numbers to review", "Three items flagged. Call is at 4:30."), ("Maple Ridge Dental", "Reminder: Nov 4 at 2:00", "Cleaning and check-up. Arrive ten minutes early."), ("Team", "Lunch Friday?", "Two spots in mind. Vote by noon."), ("Harbour Bank", "Your statement is ready", "October statement is available to view online.")]
DP_NEWS = [("CP24 hosts the final Toronto mayoral debate tonight", "CBC News"), ("Kawhi Leonard makes his Raptors regular-season debut", "CTV News"), ("Ontario to table fall fiscal update next week", "CP24")]

PAPER_IMG = f'''<figure class="paper-shot">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Inter:wght@600;700;800&display=swap">
        <link rel="stylesheet" href="/paper.css">
        <script src="/paper.js" defer></script>
        <div class="dp-frame" role="img" aria-label="A sample one-page morning paper with today's focus, calendar, inbox, follow-ups, headlines, sports scores and the weather.">
          <div class="dp" aria-hidden="true">
            <div class="dp-mast">The Daily Peddigrew</div>
            <div class="dp-date"><span data-dp-time data-on>7:00 AM</span><span data-dp-date>Friday, October 23, 2026</span><span class="dp-dwx"><svg class="dp-wi" viewBox="0 0 24 24" data-dp-wicon>{PAPER_ICON["sun"]}</svg><b><span data-dp-temp>8</span>°C</b><em><svg class="dp-pin" viewBox="0 0 24 24"><path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.3"/></svg>Toronto</em></span></div>
            <div class="dp-cols">
              <div>
                <section class="dp-sec dp-focus">{dp_h("focus", "Today’s Focus", "")}{"".join(f'<div class="dp-row"><div class="dp-t">{t}</div><span class="dp-tag">{g}</span><ul>{"".join(f"<li>{x}</li>" for x in b)}</ul></div>' for t, g, b in DP_FOCUS)}</section>
                <section class="dp-sec dp-fu">{dp_h("reply", "Follow-ups", "")}{"".join(f'<div class="dp-row"><div class="dp-t">{t}</div><span class="dp-tag">{g}</span>{"".join(f'<div class="dp-re">{x}</div>' for x in r)}</div>' for t, g, r in DP_FU)}</section>
              </div>
              <div class="dp-rule"></div>
              <div>
                <section class="dp-sec dp-cal">{dp_h("cal", "Calendar", "")}{"".join(f'<div class="dp-row"><b>{a}</b><span>{b}</span><em>({c})</em></div>' for a, b, c in DP_CAL)}</section>
                <section class="dp-sec dp-inbox">{dp_h("mail", "Inbox", "")}{"".join(f'<div class="dp-row"><span><b class="dp-from">{f}</b>{a}</span><small class="dp-sub">{b}</small></div>' for f, a, b in DP_INBOX)}</section>
                <section class="dp-sec dp-news">{dp_h("news", "Headlines", "")}<div data-dp-news>{"".join(f'<div class="dp-row"><span class="dp-nt">{n}</span></div>' for n, src in DP_NEWS)}</div></section>
              </div>
            </div>
            <div class="dp-band">
              <div>
                <section class="dp-sec dp-sports">{dp_h("trophy", "Sports", "")}<div data-dp-sports>{dp_sports()}</div></section>
              </div>
              <div class="dp-rule"></div>
              <div>
                <section class="dp-sec dp-laugh">{dp_h("laugh", "The Funnies", "")}<div class="dp-cap">“Doc, Doc, there&#39;s something wrong with him!”</div><img class="dp-comic" src="/images/paper-comic-strip-neutral.png" width="640" height="212" alt=""><div class="dp-foot"><span>The Daily Peddigrew</span></div></section>
              </div>
            </div>
          </div>
        </div>
        <figcaption>Sample page. Scores, news and weather are live.</figcaption>
      </figure>'''

home = f'''
  <section class="hero">
    {STAIRS_BG}
    <div class="wrap">
      <div class="hero-card hero-card--home">
        <div class="hero-copy">
        <span class="rule"></span>
        <h1><span class="nowrap">Less busywork.</span> <span class="nowrap">More business.{ARROW}</span></h1>
        <p class="lede">We get back the hours your team loses to follow-ups and admin. Our own team of real people. No outsourcing, no bots.</p>
        <div class="ctas">
          <a class="btn btn-white" href="{MAIN_CTA}"{MAIN_CTA_ATTRS}>Start a conversation</a>
          <a class="btn btn-line" href="/how-it-works/">See how it works</a>
        </div>
        <p class="hero-promise">Five minutes. We'll tell you if there's a practical fix.</p>
        </div>
        <div class="flip" aria-label="Before and after">
          <div class="flip-before"><span class="flip-tag">Before</span><p>A quote went out last week. Nobody followed up.</p></div>
          <div class="flip-after"><span class="flip-tag flip-tag--after">After</span><p>The follow-up went out Tuesday, in your words. The client replied.</p></div>
        </div>
      </div>
    </div>
  </section>

  <section class="proof" aria-label="Who you're dealing with">
    <div class="wrap proof-grid">
      <div class="proof-item proof-item--face"><img src="/images/ryan-peddigrew.jpg" alt="Ryan Peddigrew, founder of Chairlift" width="160" height="160" loading="eager" decoding="async"><p><strong>Real people you can call.</strong> Built by our own team, after a career in sales. <a href="/who-we-are/">Read our story</a></p></div>
      <div class="proof-item"><p><strong>Works inside what you already use.</strong> Your inbox, calendar, spreadsheets and quoting software. Nothing new to learn.</p></div>
      <div class="proof-item"><p><strong>One tested fix at a time.</strong> We fix one task, make sure it works, then look at the next.</p></div>
    </div>
  </section>

  <section class="section section--ink" aria-labelledby="plate-title">
    <div class="wrap">
      <div class="intro">
        <span class="rule"></span>
        <h2 id="plate-title">What we take off your team's plate.</h2>
        <p>Small on their own. Add them up and it's hours every week.</p>
      </div>
      <div class="cards cards--mixed cards--swipe">
        <div class="card"><div class="card-top">{icon("quote")}<span class="card-label">Sales</span></div><h3>Follow-ups</h3><p class="problem">A quote went out last week. Nobody's followed up.</p><p>Every follow-up goes out on time, written the way each account manager actually talks to their own clients.</p></div>
        <div class="card"><div class="card-top">{icon("chat")}<span class="card-label">Inquiries</span></div><h3>Fast first replies</h3><p class="problem">A new lead has been waiting since this morning.</p><p>Every inquiry gets a prompt, helpful reply and reaches the right person.</p></div>
        <div class="card"><div class="card-top">{icon("cal")}<span class="card-label">Operations</span></div><h3>Scheduling and data entry</h3><p class="problem">The same details typed into three systems.</p><p>Confirmations and updates happen in the background, with no more copying between systems.</p></div>
        <div class="card"><div class="card-top">{icon("moon")}<span class="card-label">Inquiries</span></div><h3>After-hours replies</h3><p class="problem">It's 8:40 pm and the office is closed.</p><p>Customers get a friendly reply within minutes, and the team starts the day with a short list of what came in.</p></div>
        <div class="card"><div class="card-top">{icon("people")}<span class="card-label">Sales</span></div><h3>Past customers and old leads</h3><p class="problem">People who once said yes have gone quiet.</p><p>A gentle check-in goes out at the right moment, so warm relationships don't go cold.</p></div>
        <div class="card"><div class="card-top">{icon("trend")}<span class="card-label">Leadership</span></div><h3>Reports without the legwork</h3><p class="problem">The weekly report is built by hand, again.</p><p>The numbers leadership needs arrive on their own, without anyone building a spreadsheet.</p></div>
      </div>
      <p class="pains-close">You don't need to hire for this. You need the routine work handled.</p>
      <p class="section-link"><a class="link-arrow" href="/what-we-do/">See everything we do</a></p>
      <p class="section-link"><a class="link-arrow" href="/time-back/">Add up your team's hours</a></p>
    </div>
  </section>

  <section class="section section--soft" aria-labelledby="how-title">
    <div class="wrap">
      <div class="intro">
        <span class="rule"></span>
        <h2 id="how-title">Three stops to the top.</h2>
        <p>No big IT project and no jargon. Just a steady climb, one lift at a time.</p>
      </div>
{STEPS}      <p class="section-link"><a class="link-arrow" href="/how-it-works/">See the full process</a></p>
    </div>
  </section>

  <section class="section section--soft paper-teaser" aria-labelledby="paper-title">
    <div class="wrap paper-split">
      <div>
        <span class="rule"></span>
        <span class="eyebrow">Just for fun</span>
        <h2 id="paper-title">The Daily Peddigrew.</h2>
        <p class="paper-lede">Something we made for ourselves: a one-page morning read with your focus, calendar and follow-ups. Not a service, just a taste of how we think.</p>
        <p class="section-link"><a class="link-arrow" href="/paper/">See the morning paper</a></p>
        <p class="section-link"><a class="link-arrow" href="/try/">Build yours in 10 seconds</a></p>
      </div>
      {PAPER_IMG}
    </div>
  </section>

{task_band()}
'''

# ---------------------------------------------------------------- Services
SERVICES = [
    dict(id="inquiries", icon="chat", label="Inquiries", title="New inquiries, answered fast",
         desc="The evening inquiry that waited until morning has usually gone elsewhere. Calls, web forms and emails get a prompt reply and reach the right person, any hour.",
         setup=["An instant reply that sounds like your business, not a robot", "Routing by service, location or whoever is on shift", "A text back when a call is missed, where your phone system allows it", "A short morning summary of what came in and what's still waiting"],
         notice=["Fewer leads slipping through overnight", "Nobody guessing whose turn it is to reply", "Customers know what happens next"]),
    dict(id="quotes", icon="quote", label="Quotes", title="Quotes, followed up",
         desc="Quotes go out sooner and follow up politely on their own, so nothing goes quiet and nobody has to keep a list in their head.",
         setup=["Sending a quote starts a short follow-up sequence", "Check-ins written in each salesperson's own voice", "Follow-ups stop the moment the client replies", "A nudge to the right person when a reply needs a human"],
         notice=["No quote is left to go cold", "Salespeople spend their time talking, not chasing", "A clear view of every open quote"]),
    dict(id="reviews", icon="star", label="Reviews", title="Reviews, on repeat",
         desc="Customers are asked for a review at the right moment, with the right link, at every location, without anyone having to remember.",
         setup=["A short thank-you after each job or visit", "The correct review link for each location", "One gentle reminder if it's still useful", "Requests and responses tracked in one place"],
         notice=["A steady flow of reviews instead of bursts", "Every location asking, not just the keen ones", "Front-line staff with one less thing to remember"]),
    dict(id="admin", icon="cal", label="Operations", title="Scheduling and admin",
         desc="Confirmations, reminders and updates happen in the background, and client details are entered once instead of copied between systems.",
         setup=["Booking confirmations and reminders that send themselves", "Details entered once and passed to every system that needs them", "Client notes and history kept in one shared place", "Simple summaries for leadership, without anyone building a report"],
         notice=["Fewer no-shows and fewer typos", "Smooth handovers when someone is away or moves on", "Leadership sees the full picture"]),
]

svc_blocks = ""
for i, s in enumerate(SERVICES):
    svc_blocks += f'''      <article class="stage" id="{s["id"]}">
        <div>
          <div class="card-top">{icon(s["icon"])}<span class="eyebrow">{s["label"]}</span></div>
          <h2>{s["title"]}</h2>
          <p class="stage-sum">{s["desc"]}</p>
        </div>
        <div class="stage-detail">
          <div><h3>What we set up</h3>{ticks(s["setup"])}</div>
          <div><h3>What your team notices</h3>{ticks(s["notice"])}</div>
        </div>
      </article>
'''

services = page_hero("What we do", "Built around how you work.",
    "We find the task slowing your team down and fix it with the simplest thing that works, inside the tools you already have. One problem, one tested fix, by our own team.") + f'''
  <section class="section section--tight" aria-label="What we do">
    <div class="wrap">
      <div class="stages--swipe">
{svc_blocks}      </div>
    </div>
  </section>

  <section class="section section--ink" aria-labelledby="ladder-title">
    <div class="wrap">
      <div class="intro">
        <span class="rule"></span>
        <h2 id="ladder-title">Start with the smallest fix.</h2>
        <p>The question isn't whether you need AI. It's where your team does the same thing over and over. We begin with the simplest answer and only go further if it's worth it.</p>
      </div>
      <div class="principles">
        <div class="principle"><b>01</b><div><h3>Quick fixes</h3><p>Reminders, forms, FAQ answers, scheduling and review requests.</p></div></div>
        <div class="principle"><b>02</b><div><h3>Connected steps</h3><p>Lead routing, quote follow-up, CRM updates, renewal reminders and internal alerts.</p></div></div>
        <div class="principle"><b>03</b><div><h3>Drafting and research help</h3><p>Email drafting, research, pulling data from documents and meeting summaries.</p></div></div>
        <div class="principle"><b>04</b><div><h3>Connected systems</h3><p>Your CRM, email, accounting and scheduling working together, with a person approving the key steps.</p></div></div>
        <div class="principle"><b>05</b><div><h3>Company knowledge assistant</h3><p>A private assistant built on your approved company information. The most advanced option, not the default.</p></div></div>
      </div>
    </div>
  </section>

  <section class="section section--soft section--tight" aria-label="How a project runs">
    <div class="wrap">
      <p class="lead-big" style="color:var(--text);margin-top:0;max-width:none">Curious how a project runs from start to finish? <a class="link-arrow" href="/how-it-works/">See the three stops</a></p>
      <p class="section-link"><a class="link-arrow" href="/examples/">See it in practice</a></p>
    </div>
  </section>
{cta_band("Not sure where you'd start?")}'''

# ---------------------------------------------------------------- How it works
STAGES = [
    dict(n="1", name='Onboard', sum="We learn how your team actually works today: where the hours go and what frustrates people most.",
         happens=["A conversation with you about how the business runs", "Short chats with the people closest to the work, where it helps", "Mapping the process as it really happens, not as it's written down"],
         get=["A shortlist of what's worth fixing first, in order", "A clear recommendation for where to start"],
         ask=["What does your team do every week that eats the most time?", "What happens after a quote goes out?", "What do people keep asking each other for?", "What happens to leads that come in after hours?", "If you could get rid of one repetitive task tomorrow, what would it be?"]),
    dict(n="2", name="Ride", sum="We fix one task inside the tools you already use, and refine it with the people who use it.",
         happens=["Building on your existing tools, with access you grant", "Testing with real examples before anything goes live", "Adjusting wording, timing and hand-offs with your team"],
         get=["One working fix your team actually uses", "A plain-English explanation of what it does and why"]),
    dict(n="3", name="Summit", sum="Your team gets time back for the work that matters. Then we look at what's next, together.",
         happens=["Checking it's running the way it should", "Gathering feedback from the people using it", "Deciding together whether there's a next process worth tackling"],
         get=["A team with fewer repetitive tasks on their plate", "A clear next step, or a natural place to stop"]),
]
stage_html = ""
for s in STAGES:
    ask_html = ('<div class="stage-ask"><h3>What we\'ll ask you</h3>' + ticks(s["ask"]) + '</div>') if s.get("ask") else ""
    stage_html += f'''      <article class="stage">
        <div>
          <span class="step-num step-num--plain">Stop {s["n"]}</span>
          <h2>{s["name"]}</h2>
          <p class="stage-sum">{s["sum"]}</p>
        </div>
        <div class="stage-detail">
          <div><h3>What happens</h3>{ticks(s["happens"])}</div>
          <div><h3>What you come away with</h3>{ticks(s["get"])}</div>
          {ask_html}
        </div>
      </article>
'''

FAQ = [
    ("Is this a chatbot, or outsourced?", ["No. You work with our own team of real people, never outsourced. If a chatbot is the right fix for one of your tasks, we can build one, but you'll always be dealing with a person."]),
    ("What happens in the five minutes? Is it a sales pitch?", ["We ask what slows your team down and tell you honestly whether there's a practical fix. If there isn't, we'll say so."]),
    ("Is this going to be expensive?", ["We won't quote until we understand the job, and you'll see the price before any work starts."]),
    ("I don't have time for another project.", ["It starts with five minutes, and after that we do the building. Your team just shows us how the work gets done today."]),
    ("We tried software before and nobody used it.", ["That's why we don't sell software. We fix one task inside the tools you already use, and refine it with the people who use it."]),
    ("Can I trust you with my accounts?", ["We're our own team of real people, never outsourced. We only touch what the fix needs, and you stay the owner of your tools and data."]),
    ("We're probably too small for this.", ["If your team does the same task every week, you're not too small. We start with one task and only go further if it's worth it."]),
    ("I don't want robots talking to my customers.", ["Neither do we. You always deal with real people, and nothing goes to your customers until you've signed off on it."]),
    ("Do we need to buy new software?", ["In most cases, no. We build inside the tools you already use: your inbox, calendar, spreadsheets, and the booking or quoting software you already pay for.", "If something genuinely needs adding, we'll explain why before anything changes."]),
    ("Do we need someone technical on our team?", ["No. You need someone who knows how the work gets done today. We handle the technical side and explain everything in plain English."]),
    ("Is this about replacing staff?", ["No. It's about taking the repetitive parts of the job off people's plates, so they can spend more time with clients and on the work they're good at."]),
    ("How long does it take?", ["We'd rather do one thing well than ten things halfway. Once we understand how your business runs, we'll give you a realistic timeline for your first fix."]),
    ("What happens if something stops working?", ["If something isn't working the way it should, you know exactly who to tell."]),
]
faq_html = "".join(f'''        <details>
          <summary>{q}</summary>
          <div>{"".join(f"<p>{a}</p>" for a in ans)}</div>
        </details>
''' for q, ans in FAQ)

how = page_hero("How it works", "Three stops to the top.",
    "Three steps, built around how your team already works. Your people are part of it the whole way.") + f'''
  <section class="section section--tight" aria-label="The three stops">
    <div class="wrap">
{stage_html}    </div>
  </section>

  <section class="section section--soft" id="faq" aria-labelledby="faq-title">
    <div class="wrap split">
      <div>
        <span class="rule"></span>
        <h2 id="faq-title">Common questions.</h2>
        <p class="faq-aside">Can't see yours here? <a href="/get-in-touch/">Ask us directly</a>.</p>
      </div>
      <div class="faq">
{faq_html}      </div>
    </div>
  </section>
{cta_band("Ready to take the first step?")}'''

# ---------------------------------------------------------------- Examples
jump_html = '  <nav class="jump" aria-label="Jump to an example">\n    <div class="wrap">\n      <span>Jump to</span>\n' + "".join(f'      <a href="#{e["id"]}">{e["title"]}</a>\n' for e in EXAMPLES) + '    </div>\n  </nav>\n'
example_bands = ""
for i, e in enumerate(EXAMPLES):
    soft = " section--soft" if i % 2 else ""
    example_bands += f'''  <section class="section section--tight band{soft}" aria-label="{e["title"]}">
    <div class="wrap">
{example_block(e)}    </div>
  </section>
'''

examples = page_hero("In practice", "What this looks like in practice.",
    "Four tasks we often fix first, step by step. Illustrative examples, not client case studies, so you can picture each one in your business.") + f'''
  <section class="section section--tight" aria-label="In practice">
    <div class="wrap">
{"".join(example_block(e) for e in EXAMPLES)}    </div>
  </section>
{cta_band("Recognize one of these?")}'''

# ---------------------------------------------------------------- About
about = page_hero("Who we are", "Why we started Chairlift.",
    "Great teams shouldn't lose their best hours to follow-ups and admin work.") + f'''
  <section class="section section--soft section--tight" aria-labelledby="gap-title">
    <div class="wrap split">
      <div>
        <span class="rule"></span>
        <h2 id="gap-title">The gap we kept seeing.</h2>
      </div>
      <div class="prose">
        <p>After a career in sales, we've seen up close how established businesses really run. The talent was there. The tools were there.</p>
        <p>What was missing was someone to connect the two, so the routine work runs in the background and people can focus on clients, quality and growth.</p>
        <p>Chairlift exists to close that gap. We learn how a business actually runs, then put the right fix in place, one at a time, so your team gets the benefit now, not after a big software project.</p>
      </div>
    </div>
  </section>

  <section class="section section--ink" aria-labelledby="expect-title">
    <div class="wrap">
      <div class="intro">
        <span class="rule"></span>
        <h2 id="expect-title">What you can expect from us.</h2>
      </div>
      <div class="cards">
        <div class="card"><span class="card-label">01</span><h3>Clear communication</h3><p>Straightforward explanations at every step, so you always know what's being built and why.</p></div>
        <div class="card"><span class="card-label">02</span><h3>One thing at a time</h3><p>We get one process working properly before suggesting the next. Steady beats overwhelming.</p></div>
        <div class="card"><span class="card-label">03</span><h3>Built around your people</h3><p>Every fix should make your team's day easier, so we build it with the people who'll use it.</p></div>
      </div>
    </div>
  </section>

  <section class="section section--soft section--tight" aria-labelledby="founder-title">
    <div class="wrap founder">
      <div class="founder-photo"><img src="/images/ryan-peddigrew.jpg" alt="Ryan Peddigrew, founder of Chairlift" width="600" height="600" loading="lazy" decoding="async"></div>
      <div>
        <h2 class="eyebrow" id="founder-title">A note from the founder</h2>
        <blockquote>
          <p>“The best teams I've worked alongside didn't need more people. They needed their time back.”</p>
          <p>After a career in sales, I've seen the same story in business after business: the follow-ups that slip, the handovers that stall, the hours lost between systems.</p>
          <p>Chairlift fixes that, one process at a time, with our own team and no outsourcing. Send a few lines about how your business runs, and you'll get specific ideas back.</p>
        </blockquote>
        <div class="founder-sign"><strong>Ryan Peddigrew</strong><span>Founder, Chairlift · <a href="mailto:{EMAIL}">{EMAIL}</a></span></div>
      </div>
    </div>
  </section>
{cta_band("Let's talk about your team.")}'''

# ---------------------------------------------------------------- Contact
contact = page_hero("Get in touch", "Start a conversation.",
    "Three quick steps. We reply within a day with specific ideas, and there's no pressure to work together.") + f'''{cta_section("Tell us about your business.", flush=True, intro=False)}
  <section class="section section--soft section--tight" aria-label="Other ways to get in touch">
    <div class="wrap">
      <div class="cards cards--two">
        <div class="card"><div class="card-top">{icon("chat")}<span class="card-label">Email</span></div><h3>Write directly</h3><p>Prefer your own inbox? Email <a href="mailto:{EMAIL}">{EMAIL}</a> and it comes straight to Ryan.</p></div>
        <div class="card"><div class="card-top">{icon("clock")}<span class="card-label">Before you write</span></div><h3>Common questions</h3><p>Pricing, timelines, software and data: the questions people usually ask first.</p><div class="card-foot"><a class="link-arrow" href="/how-it-works/#faq">Read the answers</a></div></div>
      </div>
    </div>
  </section>
'''

# ---------------------------------------------------------------- Who we help
INDUSTRIES = [
    dict(slug="trades-and-contractors", icon="case", name="Trades and contractors",
         blurb="Quotes followed up, calls answered and customers kept in the loop while you're on site.",
         title="For trades and contractors.",
         lede="You're on site all day. Meanwhile, quotes need following up, new calls need answering and vendors need chasing. We take care of the office side so it keeps moving while you work.",
         pains=[("quote", "A quote went out. Nobody's followed up.", "The job was yours to win, but the week got busy."),
                ("chat", "The call you missed on site.", "By the time you call back, they've booked someone else."),
                ("copy", "Chasing vendors for drawings and dates.", "Every “did you get my email?” is time away from the job."),
                ("cal", "“When are you coming?”", "Simple status updates turn into a day of phone tag.")],
         close="You're great at the work. Let the follow-ups take care of <span class=\"hl\">themselves</span>.",
         cards=[("chat", "Inquiries", "Answered on site", "Missed calls get a text back and web requests get a reply with next steps, even while your hands are full."),
                ("quote", "Quotes", "Followed up", "Every quote starts a polite check-in sequence that stops the moment the customer replies."),
                ("cal", "Updates", "Sent for you", "Booking confirmations, reminders and “on our way” messages go out on their own.")],
         example=EXAMPLES[1]),
    dict(slug="manufacturers", icon="trend", name="Manufacturers and fabricators",
         blurb="Quote requests sorted on arrival, orders entered once and customers updated without the phone calls.",
         title="For manufacturers and fabricators.",
         lede="When products are built to spec, every order starts with back-and-forth: requirements, drawings, revisions, quotes, then “where's my order?” We take care of the repetitive steps so your team can focus on building.",
         pains=[("chat", "Quote requests waiting in a shared inbox.", "Specs arrive incomplete, and the first reply takes days."),
                ("copy", "The same order details typed into three systems.", "Every re-entry is another chance for a mistake on the shop floor."),
                ("clock", "“Where's my order?” emails all day.", "Someone stops what they're doing to look up a status."),
                ("quote", "Quotes that go quiet.", "Nobody's sure whether the customer ever replied.")],
         close="Your team should be building, not <span class=\"hl\">chasing</span>.",
         cards=[("chat", "Requests", "Sorted on arrival", "Incoming requests get a quick reply asking for any missing specs, then reach the right person."),
                ("quote", "Quotes", "Followed up", "Quotes follow up on schedule, so promising work doesn't drift away."),
                ("clock", "Orders", "Updates, minus the calls", "Customers hear from you at key milestones, without anyone checking the system and writing an email.")],
         example=dict(id="spec-request", tag="Example · Custom manufacturer", title="The incomplete quote request",
             lead="A customer emails asking for a price on a custom part. The drawing is attached, but the material and quantity are missing. The email sits until someone has time to reply and ask.",
             before=["The request lands in a shared inbox.", "Someone eventually replies asking for the missing details.", "The customer answers a few days later.", "The quote goes out a week after the first email."],
             after=["The customer gets a reply within minutes asking for exactly what's missing.", "Once the details are in, the request goes to the right estimator.", "The quote is followed up on schedule until the customer replies.", "Everyone can see where each request stands."],
             built="Your shared inbox, your quoting spreadsheet or order system, and email.")),
    dict(slug="professional-services", icon="people", name="Professional services",
         blurb="For accounting, legal and investigation firms: fast first replies, intake before the call and regular client updates.",
         title="For professional services firms.",
         lede="Clients often reach out at a stressful moment, and they're usually contacting more than one firm. We take care of the first reply, the intake and the updates, so every client feels looked after from the first message.",
         pains=[("moon", "The inquiry that came in at midnight.", "By morning, they've already spoken to another firm."),
                ("copy", "Intake by email ping-pong.", "Collecting the basics takes three messages before the real conversation starts."),
                ("chat", "“Any news on my file?”", "Clients chase for updates because nobody has had time to send them."),
                ("cal", "A week of emails to book one consultation.", "Finding a time shouldn't be the hardest part.")],
         close="Clients remember how quickly you <span class=\"hl\">answered</span>.",
         cards=[("moon", "Inquiries", "Answered any hour", "New inquiries get a calm, professional reply within minutes, with a link to book a consultation."),
                ("quote", "Intake", "Done before the call", "Key details are gathered with a simple form, so the first conversation gets straight to the point."),
                ("clock", "Updates", "On schedule", "Clients get regular progress updates, so they're never left wondering where things stand.")],
         example=dict(id="late-inquiry", tag="Example · Professional services firm", title="The late-night inquiry",
             lead="Someone fills out the contact form at 11:30 pm. They're stressed, and they've messaged two other firms too. Whoever responds first, and responds well, usually gets the call.",
             before=["The message waits in the inbox overnight.", "The first reply goes out mid-morning.", "Booking a consultation takes a few more emails.", "By then, they've already spoken to someone else."],
             after=["They get a calm, professional reply within minutes.", "A short intake form collects the key details.", "A link lets them book a consultation right away.", "Your team starts the day with the full picture."],
             built="Your website form, your email, and your calendar or practice software.")),
    dict(slug="sales-teams", icon="pulse", name="Sales teams",
         blurb="Leads answered in minutes, proposals followed up and a CRM that keeps itself current.",
         title="For sales teams.",
         lede="Most deals don't get lost. They go quiet. We take care of the follow-ups, the CRM updates and the handovers, so your reps spend their time selling.",
         pains=[("quote", "The proposal nobody followed up on.", "Not for lack of effort. The week just got away."),
                ("moon", "Inbound leads that wait a day for a reply.", "Speed matters, and the first to respond often wins."),
                ("copy", "A CRM that's always a week behind.", "The pipeline is only as current as the last spare minute."),
                ("people", "A rep is away, and their accounts go quiet.", "The history lives in one inbox, not where the team can see it.")],
         close="Keep every deal <span class=\"hl\">moving</span>, without anyone having to remember.",
         cards=[("chat", "Leads", "Answered in minutes", "New inbound leads get a prompt, helpful reply and reach the right rep."),
                ("quote", "Follow-up", "On schedule", "Proposals and check-ins follow up on their own, in each rep's own voice."),
                ("trend", "CRM", "Updates itself", "Emails and next steps are logged for you, so the pipeline is always current.")],
         example=EXAMPLES[3]),
]

ind_items = "".join(f'''        <a class="fit-item fit-link" href="/who-we-help/{i["slug"]}/">{icon(i["icon"], "fit-icon")}<h3>{i["name"]}</h3><p>{i["blurb"]}</p><span class="link-arrow">Read more</span></a>
''' for i in INDUSTRIES)

industries = page_hero("Who we help", "Different industries. The same lost hours.",
    "Every industry has its own version of the follow-up nobody had time for. Pick yours to see what we'd fix first.") + f'''
  <section class="section section--soft section--tight" aria-label="Industries">
    <div class="wrap">
      <div class="fit-grid">
{ind_items}      </div>
      <p class="section-note">These are examples, not limits: construction and trades, electrical and technical contractors, property and facilities, logistics, waste and environmental services, equipment rental and professional services.</p>
      <p class="section-note">Don't see your industry? The same problems show up almost everywhere. <a href="/get-in-touch/">Tell us how your business runs</a>.</p>
    </div>
  </section>
{cta_band(CTA_HOME)}'''




REEL = os.path.exists(os.path.join(OUT, "images", "morning-paper-reel.mp4"))
HERO_MEDIA = '''<figure class="reel">
        <video controls playsinline preload="metadata" poster="/images/morning-paper-reel-poster.jpg" width="1080" height="1920">
          <source src="/images/morning-paper-reel.mp4" type="video/mp4">
        </video>
      </figure>''' if REEL else ""

morning_paper = page_hero("Just for fun", "One page for your mornings.",
    "A one-page morning briefing with your focus, calendar and follow-ups. On paper, by email or on your desktop.",
    extra=f'''
        <div class="ctas"><a class="btn btn-white" href="{MAIN_CTA}"{MAIN_CTA_ATTRS}>Start a conversation</a></div>''') + f'''
  <section class="section section--tight" aria-labelledby="page-title">
    <div class="wrap paper-split paper-split--flip">
      {PAPER_IMG}
      <div>
        <span class="rule"></span>
        <h2 id="page-title">What's on the page.</h2>
        {ticks(["Today's focus: your must-dos, with the details that matter.", "Your calendar for the day, at a glance.", "The emails that actually need you.", "Follow-ups that are still open, with their deadlines.", "The weather, headlines and last night's scores."])}
        <p class="paper-lede">No printer? It comes by email or right on your desktop. However you get it, it's one page, with no scrolling.</p>
      </div>
    </div>
  </section>

  <section class="section section--ink" aria-labelledby="start-title">
    <div class="wrap">
      <div class="intro">
        <span class="rule"></span>
        <h2 id="start-title">How it starts.</h2>
        <p>Small, quick and built around you.</p>
      </div>
      <div class="steps">
        <div class="step"><span class="step-num">Step 1</span><h3>Talk</h3><p>A five-minute conversation about how your mornings run and what you need to see first.</p></div>
        <div class="step"><span class="step-num">Step 2</span><h3>Build</h3><p>We put together your first page from that conversation, using the calendar and lists you already keep.</p></div>
        <div class="step"><span class="step-num">Step 3</span><h3>Refine</h3><p>You try it, tell us what's missing, and we adjust it until it's genuinely useful.</p></div>
      </div>
    </div>
  </section>

  <section class="section section--tight" aria-labelledby="story-title">
    <div class="wrap split">
      <div>
        <span class="rule"></span>
        <h2 id="story-title">Where it came from.</h2>
      </div>
      <div class="prose">
        <p><strong>The problem.</strong> Mornings started with anxiety, then 30 to 40 minutes checking source after source, and still feeling there was more to catch up on.</p>
        <p><strong>The fix.</strong> One page that pulls the day's priorities, calendar and follow-ups together, sorted by what's most time-sensitive.</p>
        <p><strong>The result.</strong> A two-minute read. Nothing important slips, and the day starts with a clear head.</p>
      </div>
    </div>
  </section>

  <section class="section section--soft" aria-labelledby="team-title">
    <div class="wrap split">
      <div>
        <span class="rule"></span>
        <h2 id="team-title">For you, or your whole team.</h2>
      </div>
      <div class="prose">
        <p>Start with your own morning. If it helps, we can build a page for each person on your team, so everyone starts the day knowing their priorities.</p>
        <p>It's also a simple way to see how we work: find the routine that eats your time, and make it simpler. If there's more worth fixing, we can talk about that next.</p>
      </div>
    </div>
  </section>

  <section class="cta cta-band" aria-labelledby="cta-title">
    <div class="cta-box">
      <div>
        <h2 id="cta-title">Talk it through in five minutes.</h2>
        <p>Tell us how your mornings run, and we'll show you what your page could look like.</p>
        <a class="btn btn-white" href="{MAIN_CTA}"{MAIN_CTA_ATTRS}>Start a conversation</a>
      </div>
    </div>
  </section>
'''

def industry_page(i):
    pains = "".join(f'        <li>{icon(ic, "")}<div><strong>{t}</strong><span>{d}</span></div></li>\n' for ic, t, d in i["pains"])
    cards = "".join(f'        <div class="card"><div class="card-top">{icon(ic)}<span class="card-label">{lab}</span></div><h3>{t}</h3><p>{d}</p></div>\n' for ic, lab, t, d in i["cards"])
    return page_hero("Who we help", i["title"], i["lede"]) + f'''
  <section class="section section--ink pains-band" aria-labelledby="pains-title">
    <div class="wrap">
      <div class="intro">
        <span class="rule"></span>
        <h2 id="pains-title">Sound familiar?</h2>
      </div>
      <ul class="pains">
{pains}      </ul>
      <p class="pains-close">{i["close"]}</p>
    </div>
  </section>

  <section class="section section--soft" aria-labelledby="start-title">
    <div class="wrap">
      <div class="intro">
        <span class="rule"></span>
        <h2 id="start-title">Where we'd <span class="hl">start</span>.</h2>
        <p>We begin with whatever takes up the most of your team's time. For most, it's one of these.</p>
      </div>
      <div class="cards">
{cards}      </div>
    </div>
  </section>

  <section class="section section--soft" aria-labelledby="example-title">
    <div class="wrap">
      <div class="intro">
        <span class="rule"></span>
        <h2 id="example-title">What it looks like in <span class="hl">practice</span>.</h2>
        <p>An illustrative example, not a client case study, so you can picture how it would work for you.</p>
      </div>
{example_block(i["example"], "h3")}    </div>
  </section>
{cta_band("Sound like your team?")}'''

# ---------------------------------------------------------------- Privacy
privacy = page_hero("Privacy", "Privacy policy.", "Plain English, short, and only about what we actually do. Last updated October 6, 2026.") + f'''
  <section class="section section--soft section--tight">
    <div class="wrap prose">
      <h2>What we collect</h2>
      <p>Only what you choose to share with us: what you type into our contact form, the emails you send us, and the booking details you enter when you schedule a conversation through Cal.com.</p>
      <h2>How we use it</h2>
      <p>Only to respond to you and to schedule conversations. We don't sell your information, and we don't share it for marketing.</p>
      <h2>Client information</h2>
      <p>When we work with a client's business information, we use only what the client approves, and only for that project.</p>
      <h2>Your choices</h2>
      <p>To ask about your information or to have it deleted, email <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>
      <h2>Changes</h2>
      <p>If this page changes, we'll update the "Last updated" date at the top.</p>
    </div>
  </section>
'''

# ---------------------------------------------------------------- Thanks / 404
thanks = page_hero("Message sent", "Thanks, your message is in.",
    "We'll read it properly and reply by email soon. In the meantime, here are a few things worth a look.",
    '\n      <div class="ctas"><a class="btn btn-ink" href="/examples/">See examples</a><a class="btn btn-line" href="/">Back to home</a></div>')

notfound = page_hero("Page not found", "This trail doesn't go anywhere.",
    "The page you're looking for has moved or never existed. Here's the way back down.",
    '\n      <div class="ctas"><a class="btn btn-ink" href="/">Go to the home page</a><a class="btn btn-line" href="/get-in-touch/">Contact us</a></div>')

# ---------------------------------------------------------------- Build your own paper
try_paper = page_hero("Just for fun", "Build your own morning paper.",
    "Type in your name, your city and the three things on your plate today. Your page builds itself in seconds.") + f'''
  <section class="section section--ink" aria-labelledby="try-title">
    <div class="wrap paper-split try-split">
      <div>
        <span class="rule"></span>
        <h2 id="try-title">Your page, in 10 seconds.</h2>
        <form class="try-form" data-try-form>
          <div class="field-row">
            <label class="field"><span>Your name</span><input type="text" name="name" autocomplete="name" placeholder="Sam Rivera" required></label>
            <label class="field"><span>Your city</span><input type="text" name="city" autocomplete="address-level2" placeholder="Toronto"></label>
          </div>
          <label class="field"><span>Top thing today</span><input type="text" name="one" placeholder="Send the Henderson quote" required></label>
          <label class="field"><span>Second</span><input type="text" name="two" placeholder="Call back two warm leads"></label>
          <label class="field"><span>Third</span><input type="text" name="three" placeholder="Walk the dog at lunch"></label>
          <button class="btn btn-white" type="submit">Build my paper</button>
          <p class="form-fine">Nothing you type is saved or sent to us. Only your city is used, to look up the weather.</p>
        </form>
        <div class="try-after" data-try-after hidden>
          <h3>Want the real one every morning?</h3>
          <p>We build it from your actual calendar, inbox and follow-ups, on paper, by email or on your desktop.</p>
          <a class="btn btn-white" href="{MAIN_CTA}"{MAIN_CTA_ATTRS}>Start a conversation</a>
        </div>
      </div>
      {PAPER_IMG}
    </div>
  </section>
  <script src="/try.js" defer></script>
'''

# ---------------------------------------------------------------- Time-back calculator
CALC_TASKS = ["Following up on quotes", "Replying to new inquiries", "Copying details between systems", "Booking, confirming and rescheduling", "Building the weekly report", "Chasing invoices and approvals"]
calc_rows = "".join(f'''          <div class="calc-row">
            <span class="calc-task">{t}</span>
            <label><span>Times a week</span><input type="number" inputmode="numeric" min="0" step="1" placeholder="0" data-n></label>
            <label><span>Minutes each</span><input type="number" inputmode="numeric" min="0" step="1" placeholder="0" data-m></label>
          </div>
''' for t in CALC_TASKS)
calculator = page_hero("Time-back calculator", "How much time is your team losing?",
    "Fill in the routine tasks your team handles each week. Use your own numbers: rough guesses are fine. Nothing you type is saved or sent anywhere.") + f'''
  <section class="section section--tight" aria-labelledby="calc-title">
    <div class="wrap calc">
      <form class="calc-form" data-calc>
        <h2 id="calc-title" class="sr-only">Your weekly tasks</h2>
{calc_rows}        <label class="calc-people"><span>How many people on your team do this kind of work?</span><input type="number" inputmode="numeric" min="1" step="1" value="1" data-people></label>
      </form>
      <div class="calc-out" aria-live="polite">
        <span class="rule"></span>
        <p class="calc-label">Every week, that's</p>
        <p class="calc-big"><b data-hours>0</b> hours</p>
        <p class="calc-sub">About <b data-year>0</b> hours a year, or <b data-days>0</b> full workdays.</p>
        <p class="calc-note">Based on 48 working weeks and 8-hour days.</p>
        <a class="btn btn-white" href="{MAIN_CTA}"{MAIN_CTA_ATTRS}>Start a conversation</a>
        <p class="calc-after">We'll pick the biggest one and show you how we'd take it off your plate.</p>
      </div>
    </div>
  </section>
  <script src="/calc.js" defer></script>
'''

# ---------------------------------------------------------------- 5-minute booking (bio link)
FIVE_FAQ = "".join(f"""        <details>
          <summary>{q}</summary>
          <div><p>{a_[0]}</p></div>
        </details>
""" for q, a_ in [FAQ[2], FAQ[3], FAQ[5]])

five_min = page_hero("Start a conversation", "Book your five minutes.",
    "Pick a time that suits you. We'll talk through how your business runs and where to start.") + f'''
  <section class="proof" aria-label="What to expect">
    <div class="wrap proof-grid">
      <div class="proof-item"><p><strong>Who you'll talk to.</strong> Someone from our own team. A real person, never a bot.</p></div>
      <div class="proof-item"><p><strong>What happens.</strong> You tell us what slows your team down. We tell you honestly if there's a practical fix.</p></div>
      <div class="proof-item"><p><strong>What it isn't.</strong> A sales pitch. If we're not the right fit, we'll say so.</p></div>
    </div>
  </section>
  <section class="section section--tight">
    <div class="wrap">
      <p class="section-note section-note--top">Calendar not loading? <a href="{BOOKING_URL}">Open it in a new page</a>.</p>
      <div id="cal-inline" style="min-height:640px"></div>
    </div>
  </section>
  <section class="section section--soft" aria-labelledby="faq-title">
    <div class="wrap split">
      <div>
        <span class="rule"></span>
        <h2 id="faq-title">Before you book.</h2>
      </div>
      <div class="faq">
{FIVE_FAQ}      </div>
    </div>
  </section>
  <script src="/cal-embed.js"></script>
'''

PAGES = [
    ("index.html", "Chairlift | Less busywork for GTA service businesses", "Our own team of real people takes follow-ups, quotes and admin off your team's plate, inside the tools you already use. Book a five-minute conversation.", "/", None, home, False),
    ("what-we-do/index.html", "What we do", "Inquiries answered fast, quotes followed up, reviews on repeat, and scheduling that runs itself, built inside the tools your team already uses.", "/what-we-do/", "services", services, False),
    ("how-it-works/index.html", "How it works", "Onboard, Ride, Summit: how Chairlift learns how your team works, fixes one task at a time, and refines it with the people who use it.", "/how-it-works/", "how", how, False),
    ("who-we-help/index.html", "Who we help", "How Chairlift helps trades and contractors, manufacturers, professional services firms and sales teams take the follow-ups and admin that slow them down off their plate.", "/who-we-help/", "industries", industries, False),
    ("examples/index.html", "In practice", "Before-and-after examples of the fixes Chairlift most often starts with: after-hours inquiries, quote follow-up, reviews and client handovers.", "/examples/", "examples", examples, False),
    ("paper/index.html", "One page for your mornings", "A one-page morning briefing with your focus, calendar and follow-ups, on paper, by email or on your desktop. Just for fun, with a five-minute conversation if you want more.", "/paper/", None, morning_paper, False),
    ("try/index.html", "Build your own morning paper", "Type in your name, city and top three for the day, and see your own one-page morning paper in seconds.", "/try/", None, try_paper, False),
    ("time-back/index.html", "Time-back calculator", "Add up the hours your team spends on routine tasks each week, using your own numbers.", "/time-back/", None, calculator, False),
    ("5min/index.html", "Book a five-minute conversation", "Pick a time for a five-minute conversation with Chairlift. A real person from our own team, and no sales pitch.", "/5min/", None, five_min, True),
    ("who-we-are/index.html", "Who we are", "Why Chairlift exists: great teams shouldn't lose their best hours to follow-ups and admin. We connect the talent and the tools so they don't.", "/who-we-are/", "about", about, False),
    ("get-in-touch/index.html", "Get in touch", "Tell Chairlift a little about how your business runs, and we'll come back with a few specific ideas for what to fix first.", "/get-in-touch/", "contact", contact, False),
] + [
    (f"who-we-help/{i['slug']}/index.html", i["name"], i["lede"].replace('\u201c','').replace('\u201d','').replace('"',''), f"/who-we-help/{i['slug']}/", "industries", industry_page(i), False) for i in INDUSTRIES
] + [
    ("privacy/index.html", "Privacy policy", "How Chairlift handles the information you send through this website.", "/privacy/", None, privacy, False),
    ("thanks/index.html", "Thanks", "Your message has been sent to Chairlift.", "/thanks/", None, thanks, True),
    ("404.html", "Page not found", "This page could not be found.", "/404.html", None, notfound, True),
]

for fn, title, desc, path, active, body, noindex in PAGES:
    out = os.path.join(OUT, fn)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w") as f:
        f.write(page(title, desc, path, active, body, noindex))
    print("wrote", fn)

urls = [p[3] for p in PAGES if not p[6]]
with open(os.path.join(OUT, "sitemap.xml"), "w") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for u in urls:
        f.write(f"  <url><loc>{SITE}{u}</loc><lastmod>2026-10-04</lastmod></url>\n")
    f.write("</urlset>\n")
with open(os.path.join(OUT, "robots.txt"), "w") as f:
    f.write(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n")
print("wrote sitemap.xml robots.txt")
