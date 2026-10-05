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
        <div class="step"><span class="step-num">Stop 1</span><h3><span class="lt">On</span>board</h3><p>We learn how your team actually works today: where the hours go and what frustrates people most.</p></div>
        <div class="step"><span class="step-num">Stop 2</span><h3>Ride</h3><p>We build one automation inside the tools you already use, and refine it with the people who use it.</p></div>
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
    dict(id="handover", tag="Example · B2B account team", title="When someone's out of the office",
         lead="Each account manager keeps client history in their own inbox. When someone is on holiday or moves on, their clients go quiet and the next person starts from scratch.",
         before=["Client history lives in individual inboxes.", "When someone's away, clients wait.", "A handover means forwarding dozens of emails.", "Follow-ups slip through the gap."],
         after=["Client conversations are logged automatically in one shared place.", "Follow-ups are scheduled from the record, not from memory.", "Covering for a colleague means opening the account and reading the history.", "Leadership can see every relationship at a glance."],
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
CTA_HOME = "Curious where your team's hours go?"
home = f'''
  <section class="hero">
    {STAIRS_BG}
    <div class="wrap">
      <span class="rule"></span>
      <h1>Make the climb <span class="nowrap">easier{ARROW}</span></h1>
      <p class="lede">Chairlift finds the repetitive work slowing your team down and automates it, one process at a time. Quotes get followed up, inquiries get answered, and your people get their time back.</p>
      <div class="ctas">
        <a class="btn btn-ink" href="/get-in-touch/">Start a conversation</a>
        <a class="btn btn-line" href="/how-it-works/">See how it works</a>
      </div>
      <p class="hero-note"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11"/><path d="M7 12.5l3.2 3.2L17 9"/></svg>Built inside the tools you already use. Nothing new for your team to learn.</p>
    </div>
  </section>

  <section class="section section--ink" aria-labelledby="plate-title">
    <div class="wrap">
      <div class="intro">
        <span class="rule"></span>
        <h2 id="plate-title">What we take off your team's plate.</h2>
        <p>None of these feels like a big deal. Add them up and it's hours every week.</p>
      </div>
      <div class="cards cards--mixed">
        <div class="card">{icon("chat")}<span class="card-label">Sales</span><h3>Client follow-ups</h3><p class="problem">A quote went out last week. Nobody's followed up.</p><p>Every follow-up goes out on time, written the way each account manager actually talks to their own clients.</p></div>
        <div class="card">{icon("cal")}<span class="card-label">Operations</span><h3>Scheduling and data entry</h3><p class="problem">The same details typed into three systems.</p><p>Confirmations and updates happen in the background, with no more copying between systems.</p></div>
        <div class="card">{icon("people")}<span class="card-label">Leadership</span><h3>The full picture</h3><p class="problem">Someone's away, and their clients go quiet.</p><p>Every client relationship in one place. If someone is away or moves on, the next person picks up right where they left off.</p></div>
      </div>
      <p class="pains-close">You don't need more people for this. You need the routine stuff to take care of itself.</p>
      <p class="section-link"><a class="link-arrow" href="/what-we-do/">See everything we do</a></p>
    </div>
  </section>

  <section class="section section--soft" aria-labelledby="fit-title">
    <div class="wrap">
      <div class="intro">
        <span class="rule"></span>
        <h2 id="fit-title">Built for companies that run on people.</h2>
        <p>If your business grows through clients, quotes and referrals, this is who we built Chairlift for.</p>
      </div>
{FIT}    </div>
  </section>

  <section class="section section--ink" aria-labelledby="how-title">
    <div class="wrap">
      <div class="intro">
        <span class="rule"></span>
        <h2 id="how-title">Three stops to the top.</h2>
        <p>No big IT project and no jargon. Just a steady climb, one lift at a time.</p>
      </div>
{STEPS}      <p class="section-link"><a class="link-arrow" href="/how-it-works/">See the full process</a></p>
    </div>
  </section>

  <section class="section section--soft" aria-labelledby="why-title">
    <div class="wrap split">
      <div>
        <span class="rule"></span>
        <h2 id="why-title">Why we started Chairlift.</h2>
      </div>
      <div class="prose">
        <p class="lead-big" style="color:var(--text);margin-top:0;max-width:none">The tools to save a growing team hours every week already exist. Most companies just haven't had the time to put them to work.</p>
        <p>After years in sales, working closely with companies of every size, we kept seeing the same thing: good teams losing time to follow-ups, scheduling and admin that technology could already handle. Chairlift exists to close that gap.</p>
        <a class="link-arrow" href="/who-we-are/">Read our story</a>
      </div>
    </div>
  </section>
{cta_band(CTA_HOME)}
'''

# ---------------------------------------------------------------- Services
SERVICES = [
    dict(id="inquiries", icon="chat", label="Inquiries", title="New inquiries, answered fast",
         desc="The evening inquiry that waited until morning? By then, the customer has already gone with whoever answered first. Calls, web forms and emails get a prompt, helpful reply and reach the right person, even after hours and on weekends.",
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
          {icon(s["icon"])}
          <span class="eyebrow">{s["label"]}</span>
          <h2>{s["title"]}</h2>
          <p class="stage-sum">{s["desc"]}</p>
        </div>
        <div class="stage-detail">
          <div><h3>What we set up</h3>{ticks(s["setup"])}</div>
          <div><h3>What your team notices</h3>{ticks(s["notice"])}</div>
        </div>
      </article>
'''

services = page_hero("What we do", "Automations that fit how you already work.",
    "We don't sell you software. We find the work that slows your team down and automate it using the tools you already have.") + f'''
  <section class="section section--tight" aria-label="What we do">
    <div class="wrap">
{svc_blocks}    </div>
  </section>

  <section class="section section--soft section--tight" aria-label="How a project runs">
    <div class="wrap">
      <p class="lead-big" style="color:var(--text);margin-top:0;max-width:none">Curious how a project runs from start to finish? <a class="link-arrow" href="/how-it-works/">See the three stops</a></p>
    </div>
  </section>
{cta_band("Not sure where you'd start?")}'''

# ---------------------------------------------------------------- How it works
STAGES = [
    dict(n="1", name='<span class="lt">On</span>board', sum="We learn how your team actually works today: where the hours go and what frustrates people most.",
         happens=["A conversation with you about how the business runs", "Short chats with the people closest to the work, where it helps", "Mapping the process as it really happens, not as it's written down"],
         get=["A shortlist of what's worth automating, in order", "A clear recommendation for where to start"]),
    dict(n="2", name="Ride", sum="We build one automation inside the tools you already use, and refine it with the people who use it.",
         happens=["Building on your existing tools, with access you grant", "Testing with real examples before anything goes live", "Adjusting wording, timing and hand-offs with your team"],
         get=["One working automation your team actually uses", "A plain-English explanation of what it does and why"]),
    dict(n="3", name="Summit", sum="Your team gets time back for the work that matters. Then we look at what's next, together.",
         happens=["Checking it's running the way it should", "Gathering feedback from the people using it", "Deciding together whether there's a next process worth tackling"],
         get=["A team with fewer repetitive tasks on their plate", "A clear next step, or a natural place to stop"]),
]
stage_html = ""
for s in STAGES:
    stage_html += f'''      <article class="stage">
        <div>
          <span class="step-num step-num--plain">Stop {s["n"]}</span>
          <h2>{s["name"]}</h2>
          <p class="stage-sum">{s["sum"]}</p>
        </div>
        <div class="stage-detail">
          <div><h3>What happens</h3>{ticks(s["happens"])}</div>
          <div><h3>What you come away with</h3>{ticks(s["get"])}</div>
        </div>
      </article>
'''

FAQ = [
    ("Do we need to buy new software?", ["Usually not. We build inside the tools you already use: your inbox, calendar, CRM, spreadsheets, and the booking or quoting software you already pay for.", "If something genuinely needs adding, we'll explain why before anything changes."]),
    ("Do we need someone technical on our team?", ["No. You need someone who knows how the work gets done today. We handle the technical side and explain everything in plain English."]),
    ("Will automated messages sound robotic?", ["They shouldn't. We write them with your team, in the way you actually talk to clients, and adjust them until they sound right."]),
    ("Is this about replacing staff?", ["No. It's about taking the repetitive parts of the job off people's plates, so they can spend more time with clients and on the work they're good at."]),
    ("How does pricing work?", ["It depends on what we're automating and how your tools are set up, so we don't publish a price list. You'll know what we'd recommend, and the price, before any work starts."]),
    ("How long does it take?", ["We'd rather do one thing well than ten things halfway. Once we understand how your business runs, we'll give you a realistic timeline for your first automation."]),
    ("What happens if something stops working?", ["If something isn't working the way it should, you know exactly who to tell."]),
    ("What about our data?", ["We work inside your existing accounts, with access you grant, and only touch what the automation needs. You stay the owner of your tools and your data."]),
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
    "A few of the automations we most often start with, step by step. They're illustrative examples rather than client case studies, so you can picture how each one would work in your business.") + f'''
  <section class="section section--tight" aria-label="In practice">
    <div class="wrap">
{"".join(example_block(e) for e in EXAMPLES)}    </div>
  </section>
{cta_band("Recognize one of these?")}'''

# ---------------------------------------------------------------- About
about = page_hero("Who we are", "Why we started Chairlift.",
    "The tools to save a growing team hours every week already exist. Most companies just haven't had the time to put them to work.") + f'''
  <section class="section section--tight" aria-labelledby="gap-title">
    <div class="wrap split">
      <div>
        <span class="rule"></span>
        <h2 id="gap-title">The gap we kept seeing.</h2>
      </div>
      <div class="prose">
        <p>After years in sales, working closely with companies of every size, we kept seeing the same thing: good teams losing time to follow-ups, scheduling and admin that technology could already handle.</p>
        <p>It was rarely a people problem. The teams were capable and the tools were already there. What was missing was the time to connect the two.</p>
        <p>Chairlift exists to close that gap. We learn how a business actually runs, then put the right automations in place, one at a time, so your team gets the benefit now, not after a big software project.</p>
      </div>
    </div>
  </section>

  <section class="section section--ink" aria-labelledby="expect-title">
    <div class="wrap">
      <div class="intro">
        <span class="rule"></span>
        <h2 id="expect-title">What you can expect from us.</h2>
      </div>
      <div class="principles">
        <div class="principle"><b>01</b><div><h3>Clear communication</h3><p>Straightforward explanations at every step, so you always know what's being built and why.</p></div></div>
        <div class="principle"><b>02</b><div><h3>One thing at a time</h3><p>We get one process working properly before suggesting the next. Steady beats overwhelming.</p></div></div>
        <div class="principle"><b>03</b><div><h3>Built around your people</h3><p>Automations should make your team's day easier, so we build them with the people who'll use them.</p></div></div>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="founder-title">
    <div class="wrap founder">
      <div class="founder-photo"><img src="/images/ryan-peddigrew.jpg" alt="Ryan Peddigrew, founder of Chairlift" width="600" height="600" loading="lazy" decoding="async"></div>
      <div>
        <h2 class="eyebrow" id="founder-title">A note from the founder</h2>
        <blockquote>
          <p>“Good people were spending their best hours on work a computer could already do. That's why I started Chairlift.”</p>
          <p>A background in sales means years of working closely with companies of every size. Send a few lines about how your business runs, and you'll get specific ideas back.</p>
        </blockquote>
        <div class="founder-sign"><strong>Ryan Peddigrew</strong><span>Founder, Chairlift · <a href="mailto:{EMAIL}">{EMAIL}</a></span></div>
      </div>
    </div>
  </section>
{cta_band("Let's talk about your team.")}'''

# ---------------------------------------------------------------- Contact
contact = page_hero("Get in touch", "Start a conversation.",
    "Tell us a little about how your business runs and what's taking up your team's time. We'll reply with a few specific ideas, and there's no pressure to work together.") + f'''{cta_section("Tell us about your business.", flush=True, intro=False)}
  <section class="section section--soft section--tight" aria-label="Other ways to get in touch">
    <div class="wrap">
      <div class="cards cards--two">
        <div class="card">{icon("chat")}<span class="card-label">Email</span><h3>Write directly</h3><p>Prefer your own inbox? Email <a href="mailto:{EMAIL}">{EMAIL}</a> and it comes straight to Ryan.</p></div>
        <div class="card">{icon("clock")}<span class="card-label">Before you write</span><h3>Common questions</h3><p>Pricing, timelines, software and data: the questions people usually ask first.</p><div class="card-foot"><a class="link-arrow" href="/how-it-works/#faq">Read the answers</a></div></div>
      </div>
    </div>
  </section>
'''

# ---------------------------------------------------------------- Who we help
INDUSTRIES = [
    dict(slug="trades-and-contractors", icon="case", name="Trades and contractors",
         blurb="Quotes followed up, calls answered and customers kept in the loop while you're on site.",
         title="For trades and contractors.",
         lede="You're on site all day. Meanwhile, quotes need following up, new calls need answering and vendors need chasing. We automate the office side so it keeps moving while you work.",
         pains=[("quote", "A quote went out. Nobody's followed up.", "The job was yours to win, but the week got busy."),
                ("chat", "The call you missed on site.", "By the time you call back, they've booked someone else."),
                ("copy", "Chasing vendors for drawings and dates.", "Every “did you get my email?” is time away from the job."),
                ("cal", "“When are you coming?”", "Simple status updates turn into a day of phone tag.")],
         close="The work is the easy part. Let the follow-ups take care of <span class=\"hl\">themselves</span>.",
         cards=[("chat", "Inquiries", "Answered on site", "Missed calls get a text back and web requests get a reply with next steps, even while your hands are full."),
                ("quote", "Quotes", "Followed up", "Every quote starts a polite check-in sequence that stops the moment the customer replies."),
                ("cal", "Updates", "Sent for you", "Booking confirmations, reminders and “on our way” messages go out on their own.")],
         example=EXAMPLES[1]),
    dict(slug="manufacturers", icon="trend", name="Manufacturers and fabricators",
         blurb="Quote requests sorted on arrival, orders entered once and customers updated without the phone calls.",
         title="For manufacturers and fabricators.",
         lede="When products are built to spec, every order starts with back-and-forth: requirements, drawings, revisions, quotes, then “where's my order?” We automate the repetitive steps so your team can focus on building.",
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
         blurb="For firms like investigators, legal and accounting: fast first replies, intake before the call and regular client updates.",
         title="For professional services firms.",
         lede="Clients often reach out at a stressful moment, and they're usually contacting more than one firm. We automate the first reply, the intake and the updates, so every client feels looked after from the first message.",
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
         lede="Most deals don't get lost. They go quiet. We automate the follow-ups, the CRM updates and the handovers, so your reps spend their time selling.",
         pains=[("quote", "The proposal nobody followed up on.", "Not for lack of effort. The week just got away."),
                ("moon", "Inbound leads that wait a day for a reply.", "Speed matters, and the first to respond often wins."),
                ("copy", "A CRM that's always a week behind.", "The pipeline is only as current as the last free minute."),
                ("people", "A rep is away, and their accounts go quiet.", "The history lives in one inbox, not where the team can see it.")],
         close="Keep every deal <span class=\"hl\">moving</span>, without anyone having to remember.",
         cards=[("chat", "Leads", "Answered in minutes", "New inbound leads get a prompt, helpful reply and reach the right rep."),
                ("quote", "Follow-up", "On schedule", "Proposals and check-ins follow up on their own, in each rep's own voice."),
                ("trend", "CRM", "Updates itself", "Emails and next steps are logged automatically, so the pipeline is always current.")],
         example=EXAMPLES[3]),
]

ind_items = "".join(f'''        <a class="fit-item fit-link" href="/who-we-help/{i["slug"]}/">{icon(i["icon"], "fit-icon")}<h3>{i["name"]}</h3><p>{i["blurb"]}</p><span class="link-arrow">Read more</span></a>
''' for i in INDUSTRIES)

industries = page_hero("Who we help", "Different industries. The same busywork.",
    "Every industry has its own version of the follow-up nobody had time for. Pick yours to see what we'd automate first.") + f'''
  <section class="section section--tight" aria-label="Industries">
    <div class="wrap">
      <div class="fit-grid">
{ind_items}      </div>
      <p class="section-note">Don't see your industry? The same problems show up almost everywhere. <a href="/get-in-touch/">Tell us how your business runs</a>.</p>
    </div>
  </section>
{cta_band(CTA_HOME)}'''


def industry_page(i):
    pains = "".join(f'        <li>{icon(ic, "")}<div><strong>{t}</strong><span>{d}</span></div></li>\n' for ic, t, d in i["pains"])
    cards = "".join(f'        <div class="card">{icon(ic)}<span class="card-label">{lab}</span><h3>{t}</h3><p>{d}</p></div>\n' for ic, lab, t, d in i["cards"])
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

  <section class="section" aria-labelledby="start-title">
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
privacy = page_hero("Privacy", "Privacy policy.", "Plain English, short, and only about what this website actually does. Last updated October 4, 2026.") + f'''
  <section class="section section--tight">
    <div class="wrap prose">
      <h2>What we collect</h2>
      <p>If you use the contact form, we receive what you type into it: your name, email address, company name if you give it, the topic you choose and your message. If you email us directly, we receive your email in the usual way.</p>
      <p>We don't use advertising trackers, and we don't ask you to create an account.</p>
      <h2>How we use it</h2>
      <p>Only to reply to you and to have the conversation you started. We don't sell your information, rent it, or add you to a mailing list without asking.</p>
      <h2>Who else handles it</h2>
      <p>This website is hosted by Netlify, which, like most web hosts, keeps basic technical logs such as IP addresses to keep the site secure and running. Contact form messages are delivered to our inbox by FormSubmit. Fonts are served by Google Fonts. Email is handled by our email provider.</p>
      <h2>How long we keep it</h2>
      <p>We keep your messages for as long as they're useful for our conversation and any work that comes out of it, and delete them when they no longer are.</p>
      <h2>Your choices</h2>
      <p>You can ask us at any time what information we hold about you, ask us to correct it, or ask us to delete it. Email <a href="mailto:{EMAIL}">{EMAIL}</a> and we'll take care of it.</p>
      <h2>Changes</h2>
      <p>If this policy changes, we'll update this page and the date at the top.</p>
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

PAGES = [
    ("index.html", "Chairlift · Automations for growing companies", "Chairlift helps growing companies put simple automations to work, so follow-ups, quotes and everyday admin run themselves and your team gets hours back.", "/", None, home, False),
    ("what-we-do/index.html", "What we do", "Inquiries answered fast, quotes followed up, reviews on repeat, and scheduling that runs itself, built inside the tools your team already uses.", "/what-we-do/", "services", services, False),
    ("how-it-works/index.html", "How it works", "Onboard, Ride, Summit: how Chairlift learns how your team works, builds one automation at a time, and refines it with the people who use it.", "/how-it-works/", "how", how, False),
    ("who-we-help/index.html", "Who we help", "How Chairlift helps trades and contractors, manufacturers, professional services firms and sales teams automate the follow-ups and admin that slow them down.", "/who-we-help/", "industries", industries, False),
    ("examples/index.html", "In practice", "Before-and-after examples of the automations Chairlift most often starts with: after-hours inquiries, quote follow-up, reviews and client handovers.", "/examples/", "examples", examples, False),
    ("who-we-are/index.html", "Who we are", "Why Chairlift exists: good teams lose hours to follow-ups and admin that technology can already handle. We help close that gap.", "/who-we-are/", "about", about, False),
    ("get-in-touch/index.html", "Get in touch", "Tell Chairlift a little about how your business runs, and we'll come back with a few specific ideas for what to automate first.", "/get-in-touch/", "contact", contact, False),
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
