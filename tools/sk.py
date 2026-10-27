"""Swiss Kinetic Hardware concept: the home page as a standalone, hand-built piece.

Writes its own head, telemetry bar and footer (no styles.css / pxp.css), using sk.css and sk.js.
Chairlift Ink surfaces; Neon used sparingly (haul cable, live switches, status lights).
"""
from common import SITE, FAVICON, BOOKING_URL, EMAIL

LOGO_MARK = ('<svg class="sk-mark" viewBox="-1 -1 66 66" aria-hidden="true">'
             '<path d="M2 0H62A2 2 0 0 1 64 2V62A2 2 0 0 1 62 64H2A2 2 0 0 1 0 62V2A2 2 0 0 1 2 0Z" fill="#141B2A" stroke="rgba(255,255,255,.18)"/>'
             '<rect x="10" y="42.5" width="20" height="7" rx="1.2" fill="#fff"/><rect x="22" y="29" width="20" height="7" rx="1.2" fill="#fff"/>'
             '<rect x="34" y="15.5" width="20" height="7" rx="1.2" fill="#3DFFC1"/></svg>')

BULLWHEEL = ('<svg class="sk-wheel" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" stroke-width="1.5"/>'
             '<circle cx="20" cy="20" r="3" fill="currentColor"/>'
             + "".join(f'<line x1="20" y1="20" x2="{20 + 15 * __import__("math").cos(a * 0.7854):.2f}" y2="{20 + 15 * __import__("math").sin(a * 0.7854):.2f}" stroke="currentColor" stroke-width="1"/>' for a in range(8))
             + '</svg>')

CAPS = [
    ("01", "Sales & pipeline momentum", "pipeline", "Every inquiry answered, routed and tracked until the deal is won.",
     "Instant lead capture, multi-channel follow-up sequences, CRM hygiene, stalled-deal alerts, and rep routing without anyone lifting a finger.",
     "Your CRM · email · phone and text · web forms"),
    ("02", "Quoting, proposals & scopes", "quoting", "Quotes out the same day, not the same week.",
     "Turn complex estimates, multi-line pricing and custom client proposals from an hours-long bottleneck into a quick sign-off.",
     "Your price lists · quoting tools · spreadsheets · e-signature"),
    ("03", "Client handoffs & onboarding", "handoffs", "The deal closes. The work starts. Nobody re-asks the client.",
     "The moment a deal closes, project folders, kickoff packets, team assignments and internal briefs are built and dispatched immediately.",
     "Your CRM · shared drives · project boards · team chat"),
    ("04", "Scheduling, dispatch & field ops", "scheduling", "Nothing double-booked. Nothing forgotten.",
     "Crew coordination, calendar syncing, resource allocation and real-time client updates wired together so nothing gets double-booked or forgotten.",
     "Your calendars · dispatch boards · text updates · maps"),
    ("05", "Billing, chasing & back-office", "billing", "Invoices out when the work is done. Paid on time.",
     "Milestone invoicing triggers, overdue nudges, vendor paperwork and reconciliation handled quietly in the background.",
     "Your accounting tools · bank feeds · vendor portals · inbox"),
    ("06", "Custom internal workflows", "custom", "Your one-of-a-kind process, running on rails.",
     "Have a messy, one-of-a-kind process unique to your company? We map it, build the custom plumbing around your existing tools, and make it run on rails.",
     "Whatever your team already uses"),
]

SHIFT = [
    ("New inquiry", "Sits in a shared inbox until someone has a minute.", "Logged, answered and sent to the right person right away."),
    ("The quote", "Rebuilt from an old spreadsheet, then waits for a review.", "Built from your pricing, sent the same day, followed up until there’s an answer."),
    ("Handoff to the team", "Details re-typed into three places. The client gets asked twice.", "Every detail travels with the job. Nobody re-asks the client."),
    ("Invoice & follow-through", "Goes out when someone remembers. Late payments chased by hand.", "Goes out when the work is done. Reminders run on schedule."),
]

PHASES = [
    ("01", "Audit & map", "We find the exact drag.", "You don’t need a 60-page consulting deck. We look directly at how work moves through your company today and isolate where time, money, and details are leaking."),
    ("02", "Custom build", "We build the backbone.", "We connect your existing tools, build the missing bridges, and put rock-solid workflows in place so your team doesn’t have to learn a complicated new way of working."),
    ("03", "Quiet execution", "We keep the line moving.", "Once live, your systems run quietly in the background 24/7. As your business grows and new operational bottlenecks appear, we expand the system right alongside you."),
]

TAGS = ["Sales & lead follow-up", "Quoting & proposals", "Client onboarding & handoffs", "Scheduling & dispatch", "Invoicing & back-office", "Reporting & visibility", "Something custom"]


def _x(cls=""):
    return f'<i class="sk-x {cls}" aria-hidden="true"></i>'


def render_home():
    cal = BOOKING_URL or "/get-in-touch/"
    caps = "".join(
        f'''<button class="sk-sw" type="button" role="radio" aria-checked="{'true' if i == 0 else 'false'}" data-i="{i}">
          <span class="sk-sw__idx">{n}</span><span class="sk-sw__name">{name.replace("&", "&amp;")}</span><span class="sk-sw__toggle" aria-hidden="true"><span></span></span>
        </button>''' for i, (n, name, *_r) in enumerate(CAPS))
    capdata = "".join(
        f'<template data-cap="{i}"><b>{n}_{slug.upper()}</b><h3>{h}</h3><p>{d}</p><i>{t}</i></template>'
        for i, (n, name, slug, h, d, t) in enumerate(CAPS))
    first = CAPS[0]
    shift = "".join(
        f'''<li class="sk-shift__row" data-at="{(i + 1) * 22}"><p class="sk-mono">0{i + 1} · {t.replace("&", "&amp;")}</p>
          <p class="sk-shift__was">{was}</p><p class="sk-shift__now">{now}</p><span class="sk-shift__st sk-mono">MANUAL</span></li>''' for i, (t, was, now) in enumerate(SHIFT))
    phases = "".join(
        f'''<li class="sk-phase"><span class="sk-phase__node" aria-hidden="true"></span><p class="sk-mono sk-scr">Phase {n} // {k.replace("&", "&amp;")}</p><h3>{h}</h3><p>{d}</p></li>''' for n, k, h, d in PHASES)
    tags = "".join(
        f'<button type="button" class="sk-tag sk-mag" aria-pressed="false" data-tag="{t.replace("&", "&amp;")}"><span class="sk-tag__box" aria-hidden="true"></span>{t.replace("&", "&amp;")}</button>' for t in TAGS)
    title = "Chairlift | Operational infrastructure for established businesses"
    desc = "We build quiet, reliable systems behind your team so deals don't stall and details don't slip. Sales pipelines, quoting, scheduling, handoffs and back-office work."
    return f'''<!doctype html>
<html lang="en" class="sk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{SITE}/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Chairlift">
<meta property="og:url" content="{SITE}/">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{SITE}/og-card-2.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="{SITE}/og-card-2.jpg">
<meta name="theme-color" content="#0A0B0F">
<link rel="icon" href="{FAVICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/sk.css">
</head>
<body>
<a class="sk-skip" href="#main">Skip to content</a>
<div class="sk-cursor" aria-hidden="true"><span class="sk-cursor__ring"></span><span class="sk-cursor__dot"></span></div>

<header class="sk-bar">
  <a class="sk-brand" href="/" aria-label="Chairlift home">{LOGO_MARK}<span>Chairlift</span></a>
  <div class="sk-tele sk-mono" aria-hidden="true">
    <span class="sk-tele__wheel">{BULLWHEEL}</span>
    <span>ELEVATION <b data-el>0000</b>M</span><i></i>
    <span>VELOCITY <b data-vel>0.0</b>M/S</span><i></i>
    <span>TENSION <b>99.8%</b></span><i></i>
    <span>SYSTEMS <b class="sk-ok">QUIET</b></span>
  </div>
  <nav class="sk-nav" aria-label="Main">
    <a href="/how-it-works/">How it works</a><a href="/what-we-do/">What we do</a><a href="/who-we-are/">Who we are</a>
  </nav>
  <a class="sk-trigger sk-mag" href="{cal}"><span class="sk-mono">[ Book a walkthrough <i aria-hidden="true">→</i> ]</span></a>
</header>

<main id="main">

<section class="sk-hero sk-grid" aria-labelledby="sk-h1">
  {_x('tl')}{_x('tr')}{_x('bl')}{_x('br')}
  <div class="sk-hero__copy">
    <p class="sk-mono sk-eyebrow sk-scr">01 // Operational infrastructure for business</p>
    <h1 id="sk-h1">Your business runs better when the heavy lifting happens behind the scenes.</h1>
    <p class="sk-sub">We build quiet, reliable systems behind your team so deals don’t stall and details don’t slip.</p>
    <p class="sk-proof">From sales pipelines and complex quoting to scheduling, handoffs, and back-office execution, we wire your entire operation to move without friction.</p>
    <div class="sk-ctas">
      <a class="sk-btn sk-mag" href="#intake">Start a conversation <i aria-hidden="true">→</i></a>
      <a class="sk-btn sk-btn--ghost sk-mag" href="#switchboard">Test the switchboard <i aria-hidden="true">↓</i></a>
    </div>
  </div>

  <figure class="sk-engine" aria-label="Chairlift haul schematic: business bottlenecks on the left pass through a bullwheel and leave on the right as orderly carriers on a haul cable.">
    <div class="sk-engine__head sk-mono">
      <span class="sk-scr sk-fig">FIG. 01 · Haul schematic</span><span>FRICTION CLEARED: <b data-thru>000%</b></span>
    </div>
    <div class="sk-engine__stage">
      <canvas class="sk-canvas" aria-hidden="true"></canvas>
      <span class="sk-engine__lbl sk-engine__lbl--l sk-mono">Unrouted friction</span>
      <span class="sk-engine__lbl sk-engine__lbl--c sk-mono">Bullwheel · tension assembly</span>
      <span class="sk-engine__lbl sk-engine__lbl--r sk-mono">Quiet execution</span>
    </div>
    <div class="sk-lever" role="radiogroup" aria-label="Haul mode">
            <div class="sk-lever__track">
        <span class="sk-lever__knob" aria-hidden="true"></span>
        <button type="button" role="radio" aria-checked="false" data-mode="0" class="sk-mag"><span class="sk-mono"><span class="sk-br">[ </span>Manual grind<span class="sk-br"> ]</span></span></button>
        <button type="button" role="radio" aria-checked="true" data-mode="1" class="sk-mag"><span class="sk-mono"><span class="sk-br">[ </span>Engage Chairlift<span class="sk-br"> ]</span></span></button>
        <button type="button" role="radio" aria-checked="false" data-mode="2" class="sk-mag"><span class="sk-mono"><span class="sk-br">[ </span>Overdrive<span class="sk-br"> ]</span></span></button>
      </div>
    </div>
  </figure>
</section>

<section class="sk-sec sk-dark sk-grid" id="switchboard" aria-labelledby="sb-h">
  {_x('tl')}{_x('tr')}
  <header class="sk-head">
    <p class="sk-mono sk-scr">02 // Full-spectrum capability</p>
    <h2 id="sb-h">Way beyond basic follow-ups. Built for whatever slows your company down.</h2>
    <p>Every business has different bottlenecks. Flip any department below to see how we take the manual grind off your team’s plate.</p>
  </header>
  <div class="sk-board">
    <div class="sk-board__switches" role="radiogroup" aria-label="Department">{caps}</div>
    <div class="sk-term" aria-live="polite">
      <div class="sk-term__bar sk-mono"><span data-cap-code>SCHEMATIC // {first[0]}_{first[2].upper()}</span><span><span class="sk-ok">●</span> CIRCUIT LOCKED</span></div>
      <div class="sk-term__out" data-cap-out>
        <h3>{first[3]}</h3><p>{first[4]}</p>
      </div>
      <div class="sk-term__foot sk-mono"><span data-cap-tools>BUILT AROUND: {first[5]}</span><a href="#intake" class="sk-mag">Wire this into my business →</a></div>
    </div>
    {capdata}
  </div>
</section>

<section class="sk-sec sk-bone sk-grid" aria-labelledby="sh-h">
  {_x('tl')}{_x('tr')}
  <header class="sk-head">
    <p class="sk-mono sk-scr">03 // The operational shift</p>
    <h2 id="sh-h">Stop being the glue holding every process together.</h2>
  </header>
  <div class="sk-shift" data-shift>
    <div class="sk-shift__scale sk-mono"><span>0% — Manual grind (14 handoffs)</span><span data-pct>0% — Chairlift engaged</span></div>
    <input class="sk-shift__range" type="range" min="0" max="100" value="0" step="1" aria-label="Drag to engage Chairlift">
    <ol class="sk-shift__rows">{shift}</ol>
  </div>
</section>

<section class="sk-sec sk-dark sk-grid" aria-labelledby="hw-h">
  {_x('tl')}{_x('tr')}
  <header class="sk-head">
    <p class="sk-mono sk-scr">04 // How we work together</p>
    <h2 id="hw-h">Engineered around how your business already runs.</h2>
  </header>
  <ol class="sk-spine" data-spine><span class="sk-spine__fill" aria-hidden="true"></span>{phases}</ol>
</section>

<section class="sk-sec sk-bone sk-grid" aria-labelledby="pf-h">
  {_x('tl')}{_x('tr')}
  <div class="sk-case">
    <p class="sk-mono sk-scr">On the line // Client story</p>
    <h2 id="pf-h">WasteMind</h2>
    <dl class="sk-readout">
      <div><dt class="sk-mono">Response time, before</dt><dd>12–24 hrs</dd></div>
      <div><dt class="sk-mono">Response time, now</dt><dd>~1 hr</dd></div>
      <div><dt class="sk-mono">Covers</dt><dd class="sk-dd-sm">Quote requests, service calls and inquiries, every week</dd></div>
    </dl>
    <a class="sk-link sk-mag" href="/examples/">Read the client story <i aria-hidden="true">→</i></a>
  </div>
</section>

<section class="sk-sec sk-dark sk-grid" id="intake" aria-labelledby="in-h">
  {_x('tl')}{_x('tr')}{_x('bl')}{_x('br')}
  <header class="sk-head">
    <p class="sk-mono sk-scr">05 // Start the conversation</p>
    <h2 id="in-h">Where is the heaviest friction in your business right now?</h2>
  </header>
  <div class="sk-term sk-term--intake" data-intake data-cal="{cal}">
    <div class="sk-term__bar sk-mono"><span>CHAIRLIFT://DISPATCH</span><span><span class="sk-ok">●</span> ONLINE</span></div>
    <div class="sk-intake__step">
      <p class="sk-mono sk-intake__n">Step 1 · Tag your bottlenecks</p>
      <div class="sk-tags">{tags}</div>
      <p class="sk-term__log sk-mono" data-log>&gt; awaiting input<span class="sk-caret"></span></p>
    </div>
    <div class="sk-intake__step">
      <p class="sk-mono sk-intake__n">Step 2 · Send it to a real person on our team</p>
      <div class="sk-intake__go">
        <div>
          <p class="sk-intake__lead">Pick a time for a 5-minute conversation. Your tags come with you.</p>
          <a class="sk-btn sk-mag" data-book href="{cal}">Start a conversation <i aria-hidden="true">→</i></a>
        </div>
        <form class="sk-form" method="POST" action="https://formsubmit.co/{EMAIL}">
          <input type="hidden" name="_subject" value="Dispatch terminal: new request from usechairlift.com">
          <input type="hidden" name="_template" value="table">
          <input type="hidden" name="_next" value="{SITE}/thanks/">
          <input type="hidden" name="bottlenecks" value="" data-tags-field>
          <p class="sk-hp" aria-hidden="true"><label>Leave this empty <input name="_honey" tabindex="-1" autocomplete="off"></label></p>
          <p class="sk-intake__lead">Or send it and we’ll reply by email.</p>
          <label><span class="sk-mono">Name</span><input type="text" name="name" autocomplete="name" required></label>
          <label><span class="sk-mono">Work email</span><input type="email" name="email" autocomplete="email" required></label>
          <button class="sk-btn sk-btn--ghost sk-mag" type="submit">Send it <i aria-hidden="true">→</i></button>
        </form>
      </div>
    </div>
  </div>
</section>

</main>

<footer class="sk-foot sk-grid">
  {_x('tl')}{_x('tr')}
  <div class="sk-foot__row">
    <a class="sk-brand" href="/">{LOGO_MARK}<span>Chairlift</span></a>
    <nav class="sk-foot__nav" aria-label="Footer">
      <a href="/how-it-works/">How it works</a><a href="/what-we-do/">What we do</a><a href="/examples/">In practice</a><a href="/who-we-are/">Who we are</a><a href="/get-in-touch/">Get in touch</a><a href="/privacy/">Privacy</a>
    </nav>
  </div>
  <div class="sk-foot__row sk-mono"><span>© <span data-year>2026</span> Chairlift</span><a href="mailto:{EMAIL}">{EMAIL}</a><span>EL. <b data-el>0000</b>M · HAUL LINE: ACTIVE</span></div>
</footer>

<script src="/sk.js" defer></script>
</body>
</html>
'''
