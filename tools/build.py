import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from common import *

UP_ARROW = '<svg class="climb-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20V5"/><path d="M5.5 11.5L12 5l6.5 6.5"/></svg>'

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
        <div class="step"><span class="step-num"><b>1</b>Stop one</span><h3>Onboard</h3><p>We learn how your team actually works today: where the hours go and what frustrates people most.</p></div>
        <div class="step"><span class="step-num"><b>2</b>Stop two</span><h3>Ride</h3><p>We build one automation inside the tools you already use, and refine it with the people who use it.</p></div>
        <div class="step"><span class="step-num"><b>3</b>Stop three</span><h3>Summit</h3><p>Your team gets time back for the work that matters. Then we look at what's next, together.</p></div>
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
CTA_HOME = 'Curious where your team&#39;s <span class="hl">hours</span> go?'
home = f'''
  <section class="hero">
    {STAIRS_BG}
    <div class="wrap">
      <span class="rule"></span>
      <h1>Make the climb <span class="nowrap">easier{UP_ARROW}</span></h1>
      <p class="lede">Chairlift finds the repetitive work that's eating your team's day, then automates it. Quotes get followed up, inquiries get answered, and your people get their time back.</p>
      <div class="ctas">
        <a class="btn btn-ink" href="#contact">Start a conversation</a>
        <a class="btn btn-line" href="/how-it-works/">See how it works</a>
      </div>
      <p class="hero-note"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11"/><path d="M7 12.5l3.2 3.2L17 9"/></svg>Built inside the tools you already use. Nothing new for your team to learn.</p>
    </div>
  </section>

  <section class="section section--ink pains-band" aria-labelledby="pains-title">
    <div class="wrap">
      <div class="intro">
        <span class="rule"></span>
        <h2 id="pains-title">Sound familiar?</h2>
        <p>None of these feels like a big deal. Add them up and it's hours every week.</p>
      </div>
      <ul class="pains">
        <li>{icon("quote", "")}<div><strong>A quote went out last week. Nobody's followed up.</strong><span>Not for lack of effort. The follow-up simply depends on someone remembering.</span></div></li>
        <li>{icon("moon", "")}<div><strong>The evening inquiry that waited until morning.</strong><span>By then, the customer has already gone with whoever answered first.</span></div></li>
        <li>{icon("copy", "")}<div><strong>The same details typed into three systems.</strong><span>Every re-entry is another chance for an error, and time nobody gets back.</span></div></li>
        <li>{icon("people", "")}<div><strong>Someone's away, and their clients go quiet.</strong><span>The history is in one person's inbox, not somewhere the team can see it.</span></div></li>
      </ul>
      <p class="pains-close">You don't need more people for this. You need the routine stuff to take care of <span class="hl">itself</span>.</p>
    </div>
  </section>

  <section class="section section--soft" aria-labelledby="start-title">
    <div class="wrap">
      <div class="intro intro--row">
        <div>
          <span class="rule"></span>
          <h2 id="start-title">Where we usually <span class="hl">start</span>.</h2>
          <p>Every business is different, so we begin with whatever costs your team the most time. For most, it's one of these.</p>
        </div>
        <a class="link-arrow" href="/what-we-do/">Everything we do</a>
      </div>
      <div class="cards">
        <div class="card">{icon("chat")}<span class="card-label">Inquiries</span><h3>Answered fast</h3><p>New calls, forms and emails get a timely reply and reach the right person, even after hours.</p><div class="card-foot"><a class="link-arrow" href="/what-we-do/#inquiries">How it works</a></div></div>
        <div class="card">{icon("quote")}<span class="card-label">Quotes</span><h3>Followed up</h3><p>Quotes go out sooner and follow up politely on their own, so nothing goes quiet.</p><div class="card-foot"><a class="link-arrow" href="/what-we-do/#quotes">How it works</a></div></div>
        <div class="card">{icon("star")}<span class="card-label">Reviews</span><h3>On repeat</h3><p>Happy customers are asked for a review at the right moment, at every location.</p><div class="card-foot"><a class="link-arrow" href="/what-we-do/#reviews">How it works</a></div></div>
      </div>
    </div>
  </section>

  <section class="section section--ink" aria-labelledby="how-title">
    <div class="wrap">
      <div class="intro intro--row">
        <div>
          <span class="rule"></span>
          <h2 id="how-title">Journey to the <span class="hl">top</span>.</h2>
          <p>A clear, step-by-step process built around the way your team already works.</p>
        </div>
        <a class="link-arrow" href="/how-it-works/">More on how we work</a>
      </div>
{STEPS}    </div>
  </section>

  <section class="section" aria-labelledby="example-title">
    <div class="wrap">
      <div class="intro intro--row">
        <div>
          <span class="rule"></span>
          <h2 id="example-title">What it looks like in <span class="hl">practice</span>.</h2>
          <p>Here's one of the most common places we start, before and after.</p>
        </div>
        <a class="link-arrow" href="/examples/">See more examples</a>
      </div>
{example_block(EXAMPLES[1], "h3")}    </div>
  </section>

  <section class="section section--soft" aria-labelledby="fit-title">
    <div class="wrap">
      <div class="intro">
        <span class="rule"></span>
        <h2 id="fit-title">Built for companies that run on <span class="hl">people</span>.</h2>
        <p>If your business grows through clients, quotes and referrals, we can probably take some work off your team's plate.</p>
      </div>
{FIT}    </div>
  </section>

  <section class="section" aria-labelledby="why-title">
    <div class="wrap founder">
      <div class="founder-photo"><img src="/images/ryan-peddigrew.jpg" alt="Ryan Peddigrew, founder of Chairlift" width="720" height="720" loading="lazy" decoding="async"></div>
      <div>
        <h2 class=”eyebrow” id=”why-title”>Why Chairlift</h2>
        <blockquote>
          <p>”I spent years in sales watching capable teams get held back by the same repetitive work, over and over.”</p>
          <p>They had the tools, the people, and the drive to grow. What they didn't have was the time to connect all the pieces. That gap between what's possible and what teams actually get done is what Chairlift exists to close. Because when you remove the friction from everyday work, companies can focus on what they're actually built to do—and that's when they succeed.</p>
        </blockquote>
        <div class="founder-sign"><strong>Ryan Peddigrew</strong><span>Founder, Chairlift · <a href="/who-we-are/">Read our story</a></span></div>
      </div>
    </div>
  </section>
{cta_section(CTA_HOME)}
'''

# ---------------------------------------------------------------- Services
SERVICES = [
    dict(id="inquiries", icon="chat", label="Inquiries", title="New inquiries, answered fast",
         desc="Calls, web forms and emails get a prompt, helpful reply and reach the right person, even after hours and on weekends.",
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

  <section class="section section--ink" aria-labelledby="same-title">
    <div class="wrap">
      <div class="intro">
        <span class="rule"></span>
        <h2 id="same-title">Every project, the same way.</h2>
        <p>Whatever we start with, the approach doesn't change.</p>
      </div>
      <div class="principles">
        <div class="principle"><b>01</b><div><h3>One process at a time</h3><p>We get one thing working properly before moving on, so your team isn't hit with everything at once.</p></div></div>
        <div class="principle"><b>02</b><div><h3>Inside your existing tools</h3><p>We build on the inbox, calendar, CRM and software you already use, rather than adding another login.</p></div></div>
        <div class="principle"><b>03</b><div><h3>Shaped by your team</h3><p>We refine every automation with the people who use it, so it fits how they actually work.</p></div></div>
        <div class="principle"><b>04</b><div><h3>One point of contact</h3><p>You deal with the same person from the first conversation onward. No hand-offs, no ticket queues.</p></div></div>
      </div>
      <div class="section-foot"><a class="link-arrow" href="/how-it-works/" style="color:#fff">See how a project runs</a></div>
    </div>
  </section>
{cta_section("Not sure where you'd start?")}'''

# ---------------------------------------------------------------- How it works
STAGES = [
    dict(n="1", name="Onboard", sum="We learn how your team actually works today: where the hours go and what frustrates people most.",
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
          <span class="step-num step-num--plain"><b>{s["n"]}</b>Stop {s["n"]}</span>
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
    ("What does it cost?", ["It depends on what we're automating and how your tools are set up, so we don't publish a price list.", "You'll know what we'd recommend, and what it would cost, before any work starts."]),
    ("How long does it take?", ["We'd rather do one thing well than ten things halfway. Once we understand how your business runs, we'll give you a realistic timeline for your first automation."]),
    ("What happens if something stops working?", ["You have one point of contact from the first conversation onward. If something isn't working the way it should, you know exactly who to tell."]),
    ("What about our data?", ["We work inside your existing accounts, with access you grant, and only touch what the automation needs. You stay the owner of your tools and your data."]),
]
faq_html = "".join(f'''        <details>
          <summary>{q}</summary>
          <div>{"".join(f"<p>{a}</p>" for a in ans)}</div>
        </details>
''' for q, ans in FAQ)

how = page_hero("How it works", "Journey to the top.",
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
{cta_section("Ready to take the first step?")}'''

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
{cta_section("Recognize one of these?")}'''

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

  <section class="section section--soft" aria-labelledby="name-title">
    <div class="wrap split">
      <div>
        <span class="rule"></span>
        <h2 id="name-title">Why “Chairlift”?</h2>
      </div>
      <div class="prose">
        <p class="lead-big" style="color:var(--text);margin-top:0">A chairlift doesn't change the mountain. It takes the hardest part of the climb off your legs, so you have energy for what you came to do.</p>
        <p>That's the idea behind everything we build. Same business, same people, same tools. Just less grind.</p>
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
        <div class="principle"><b>04</b><div><h3>One point of contact</h3><p>You'll deal with the same person from the first conversation onward.</p></div></div>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="founder-title">
    <div class="wrap founder">
      <div class="founder-photo"><img src="/images/ryan-peddigrew.jpg" alt="Ryan Peddigrew, founder of Chairlift" width="720" height="720" loading="lazy" decoding="async"></div>
      <div>
        <h2 class="eyebrow" id="founder-title">A note from the founder</h2>
        <blockquote>
          <p>“I started Chairlift because I kept watching good people spend their best hours on work a computer could already do.”</p>
          <p>My background is in sales, and I've worked closely with companies of every size. I'll be your point of contact from the first conversation onward. If you're curious whether any of this would work for your team, send me a few lines about how your business runs and I'll come back with some specific ideas.</p>
        </blockquote>
        <div class="founder-sign"><strong>Ryan Peddigrew</strong><span>Founder, Chairlift · <a href="mailto:{EMAIL}">{EMAIL}</a></span></div>
      </div>
    </div>
  </section>
{cta_section("Let's talk about your team.", flush=True)}'''

# ---------------------------------------------------------------- Contact
contact = page_hero("Get in touch", "Start a conversation.",
    "Tell us a little about how your business runs and what's taking up your team's time. We'll reply with a few specific ideas, and there's no pressure to work together.") + f'''{cta_section("Tell us about your business.", flush=True)}
  <section class="section section--soft section--tight" aria-label="Other ways to get in touch">
    <div class="wrap">
      <div class="cards">
        <div class="card">{icon("chat")}<span class="card-label">Email</span><h3>Write directly</h3><p>Prefer your own inbox? Email <a href="mailto:{EMAIL}">{EMAIL}</a> and it comes straight to Ryan.</p></div>
        <div class="card">{icon("clock")}<span class="card-label">Before you write</span><h3>Common questions</h3><p>Cost, timelines, software and data: the questions people usually ask first.</p><div class="card-foot"><a class="link-arrow" href="/how-it-works/#faq">Read the answers</a></div></div>
        <div class="card">{icon("trend")}<span class="card-label">See it first</span><h3>In practice</h3><p>Before-and-after walk-throughs of the automations we most often start with.</p><div class="card-foot"><a class="link-arrow" href="/examples/">See examples</a></div></div>
      </div>
    </div>
  </section>
'''

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
    ("examples/index.html", "In practice", "Before-and-after examples of the automations Chairlift most often starts with: after-hours inquiries, quote follow-up, reviews and client handovers.", "/examples/", "examples", examples, False),
    ("who-we-are/index.html", "Who we are", "Why Chairlift exists: good teams lose hours to follow-ups and admin that technology can already handle. We help close that gap.", "/who-we-are/", "about", about, False),
    ("get-in-touch/index.html", "Get in touch", "Tell Chairlift a little about how your business runs, and we'll come back with a few specific ideas for what to automate first.", "/get-in-touch/", "contact", contact, False),
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
