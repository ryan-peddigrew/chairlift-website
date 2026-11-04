"""Kinetic pieces for the mountain home page: the department switchboard, the by-hand vs with-Chairlift
job flow, and the friction tags on the closing form. Styles in kin.css,
behaviour in kin.js (both loaded by the home page only)."""

DEPTS = [
    ("01", "Sales & pipeline momentum", "Every inquiry answered, routed and tracked until the deal is won.",
     "Instant lead capture, follow-up across email, phone and text, a tidy CRM, stalled-deal alerts, and the right rep on every lead without anyone lifting a finger.",
     "Your CRM · email · phone and text · web forms"),
    ("02", "Quoting, proposals & scopes", "Quotes out the same day, not the same week.",
     "Complex estimates, multi-line pricing and custom proposals go from an hours-long bottleneck to a quick sign-off.",
     "Your price lists · quoting tools · spreadsheets · e-signature"),
    ("03", "Client handoffs & onboarding", "The deal closes. The work starts. Nobody re-asks the client.",
     "The moment a deal closes, project folders, kickoff packets, team assignments and internal briefs are built and sent out.",
     "Your CRM · shared drives · project boards · team chat"),
    ("04", "Scheduling, dispatch & field ops", "Nothing double-booked. Nothing forgotten.",
     "Crew coordination, calendar syncing, resource planning and real-time client updates wired together.",
     "Your calendars · dispatch boards · text updates · maps"),
    ("05", "Billing, chasing & back-office", "Invoices out when the work is done.",
     "Milestone invoices, overdue nudges, vendor paperwork and reconciliation handled quietly in the background.",
     "Your accounting tools · bank feeds · vendor portals · inbox"),
    ("06", "Custom internal workflows", "Your one-of-a-kind process, running on rails.",
     "Have a messy process that only your company has? We map it, build around the tools you already use, and make it run on rails.",
     "Whatever your team already uses"),
]

STAGES = [
    ("New inquiry", "Sits in a shared inbox until someone has a minute.", "Answered and sent to the right person right away."),
    ("The quote", "Rebuilt from an old spreadsheet, then waits for a review.", "Built from your pricing and sent the same day."),
    ("Handoff to the team", "Details re-typed into three places. The client gets asked twice.", "Every detail travels with the job."),
    ("Invoice", "Goes out when someone remembers. Late payments chased by hand.", "Goes out when the work is done. Reminders on schedule."),
]

TAGS = ["Sales & lead follow-up", "Quoting & proposals", "Onboarding & handoffs", "Scheduling & dispatch",
        "Invoicing & back-office", "Reporting", "Something custom"]


def _e(t):
    return t.replace("&", "&amp;")


def switchboard():
    """Replaces the static Solutions list: flip a department, read what we take off the plate."""
    sw = "".join(
        f'''<button class="kn-sw" type="button" role="radio" aria-checked="{'true' if i == 0 else 'false'}" data-i="{i}">
          <span class="kn-sw__n">{n}</span><span class="kn-sw__name">{_e(name)}</span><span class="kn-sw__tog" aria-hidden="true"><span></span></span></button>'''
        for i, (n, name, *_r) in enumerate(DEPTS))
    tpl = "".join(
        f'<template data-dept="{i}"><b>{n}</b><h3>{h}</h3><p>{d}</p><i>{_e(t)}</i></template>'
        for i, (n, name, h, d, t) in enumerate(DEPTS))
    strip = "".join(f'<li{" class=\"on\"" if i == 0 else ""} data-i="{i}"><b>{n}</b>{_e(name)}</li>' for i, (n, name, *_r) in enumerate(DEPTS))
    n, name, h, d, t = DEPTS[0]
    return f'''<link rel="stylesheet" href="/kin.css"><script src="/kin.js" defer></script>
      <ol class="kn-strip mono" aria-hidden="true">{strip}</ol>
      <div class="kn-board">
        <div class="kn-board__sw" role="radiogroup" aria-label="Pick a department">{sw}</div>
        <div class="kn-read" aria-live="polite">
          <p class="kn-read__bar mono"><span data-dept-code>Department {n}</span><span><i class="kn-live" aria-hidden="true"></i>Our own team builds it</span></p>
          <div class="kn-read__out" data-dept-out><h3>{h}</h3><p>{d}</p></div>
          <p class="kn-read__foot mono" data-dept-tools>Built around: {_e(t)}</p>
        </div>
        {tpl}
      </div>'''


RUN_SHORT = ["Sales & pipeline", "Quoting & proposals", "Handoffs & onboarding", "Scheduling & dispatch", "Billing & back office", "Custom workflows"]


def trailmap():
    """Solutions as a trail map (Ryan, 4 Nov 2026): six runs on Chairlift Mountain, one per department. Drawn by trail.js."""
    tpl = "".join(
        f'''<template data-run="{i}" data-short="{_e(RUN_SHORT[i])}"><p class="tm-card__k mono">Run {n} &middot; {_e(name)}</p><h3>{h}</h3><p>{d}</p><p class="tm-card__k mono">Built around: {_e(t)}</p></template>'''
        for i, (n, name, h, d, t) in enumerate(DEPTS))
    first = DEPTS[0]
    return f'''<link rel="stylesheet" href="/kin.css"><script src="/kin.js" defer></script><script src="/trail.js" defer></script>
      <div class="tm-poster">
        <div class="tm-poster__top"><b>Chairlift Mountain</b><span class="mono">Trail map &middot; Winter season</span></div>
        <div class="tm-wrap"><div class="tm-map">
          <picture><source type="image/webp" srcset="/images/trail-map-800.webp 800w, /images/trail-map-1200.webp 1200w" sizes="(max-width: 860px) 820px, 1180px"><img src="/images/trail-map.jpg" width="1200" height="825" loading="lazy" decoding="async" alt="Trail map of Chairlift Mountain: six runs, one for each department we work in, and four lifts from the base lodge to the summit"></picture>
          <svg id="tm-svg" viewBox="0 0 1600 1100" aria-hidden="true"></svg>
        </div></div>
        <div class="tm-legend mono">
          <span><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6" fill="#141B2A"/></svg>Where we usually start</span>
          <span><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="2" width="12" height="12" fill="#141B2A"/></svg>Bigger fix</span>
          <span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1l7 7-7 7-7-7z" fill="#141B2A"/></svg>Custom build</span>
          <span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 8h14" stroke="#141B2A" stroke-width="6"/><path d="M1 8h14" stroke="#3DFFC1" stroke-width="3"/></svg>Lifts A to D</span>
        </div>
      </div>
      <div class="tm-list" id="tm-list" role="group" aria-label="Pick a run"></div>
      <div class="tm-card" id="tm-card" aria-live="polite"><p class="tm-card__k mono">Run {first[0]} &middot; {_e(first[1])}</p><h3>{first[2]}</h3><p>{first[3]}</p><p class="tm-card__k mono">Built around: {_e(first[4])}</p></div>
      {tpl}'''


def shift_section():
    steps = "".join(
        f'''<li class="kn-step"><p class="kn-step__n">Step 0{i + 1}</p><h3 class="kn-step__t">{_e(t)}</h3><div class="kn-step__txt"><p class="kn-step__was">{was}</p><p class="kn-step__now">{now}</p></div></li>'''
        for i, (t, was, now) in enumerate(STAGES))
    return f'''
  <section class="pc-sec pc-sec--cream kn-shift" aria-labelledby="shift-title">
    <div class="pc-wrap">
      <header class="sx-head"><h2 id="shift-title" class="sx-title">The shift<i aria-hidden="true">.</i></h2><div class="sx-cap"><span class="pg-arrow" aria-hidden="true"><i class="ar ar--r"></i></span><p class="sx-line">One job, two ways to run it.</p></div></header>
      <div class="kn-flow" data-flow data-way="0">
        <div class="kn-flow__bar">
          <div class="kn-way" role="radiogroup" aria-label="How the job runs"><span class="kn-way__knob" aria-hidden="true"></span>
            <button type="button" role="radio" aria-checked="true" data-way="0">By hand</button>
            <button type="button" role="radio" aria-checked="false" data-way="1">With Chairlift</button></div>
          <p class="kn-flow__read" aria-live="polite"><span data-cap>Every step waits for a person to get to it.</span><small data-count>4 places a job can sit and wait</small></p>
        </div>
        <div class="kn-rail" aria-hidden="true"><canvas class="kn-canvas"></canvas></div>
        <ol class="kn-track">{steps}</ol>
      </div>
    </div>
  </section>
'''


def friction_tags():
    """Optional tags inside the closing 'send us one task' form; they arrive with the email."""
    chips = "".join(
        f'<label class="kn-tag"><input type="checkbox" name="friction" value="{_e(t)}"><span>{_e(t)}</span></label>' for t in TAGS)
    return f'''<fieldset class="kn-tags"><legend>Where is the heaviest friction in your business right now? <em>(optional)</em></legend>{chips}<p class="kn-log mono" aria-live="polite" data-log>&gt; awaiting input<i class="kn-caret" aria-hidden="true"></i></p></fieldset>
        '''
