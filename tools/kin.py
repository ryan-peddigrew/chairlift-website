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


# Trail map runs (Ryan, 4 Nov 2026): rated like a ski hill. Green = where we usually start, double black = the hardest builds.
RUN_EXTRA = [
    ("07", "Tool integrations", "Your tools, talking to each other.",
     "We connect the systems you already pay for so details move between them without anyone re-typing: your CRM, inbox, calendars, accounting and forms.",
     "Your CRM · accounting · calendars · forms · inbox"),
    ("08", "White-label tools", "Tools with your name on them.",
     "Client portals, quoting tools and internal dashboards built under your own brand, for your team or your customers.",
     "Your brand · your domain · the tools you already use"),
]
RUN_SHORT = ["Sales & pipeline", "Quoting & proposals", "Handoffs & onboarding", "Scheduling & dispatch", "Billing & back office",
             "Custom workflows", "Tool integrations", "White-label tools"]
RUN_LEVEL = ["Easiest", "Easiest", "More involved", "More involved", "More involved", "Advanced", "Expert", "Expert"]
LEGEND = (
    ('<circle cx="12" cy="8" r="6" fill="#1F8A55"/>', "Easiest: where we usually start"),
    ('<rect x="6" y="2" width="12" height="12" fill="#1E5FB4"/>', "More involved"),
    ('<path d="M12 1l7 7-7 7-7-7z" fill="#141B2A"/>', "Advanced: custom builds"),
    ('<path d="M6.5 1l6 7-6 7-6-7zM17.5 1l6 7-6 7-6-7z" fill="#141B2A"/>', "Expert: integrations and white-label"),
    ('<path d="M1 8h22" stroke="#141B2A" stroke-width="6"/><path d="M1 8h22" stroke="#3DFFC1" stroke-width="3"/>', "Lifts A to D"),
)


def _run_card(i, n, name, h, d, t):
    return (f'<p class="tm-card__k mono"><span data-mark></span>Run {n} &middot; {RUN_LEVEL[i]}</p><h3>{_e(name)}</h3>'
            f'<p class="tm-card__lead">{h}</p><p>{d}</p><p class="tm-card__k mono">Built around: {_e(t)}</p>')


def trailmap():
    """Solutions as a trail map (Ryan, 4 Nov 2026): eight rated runs on Chairlift Mountain. Drawn by trail.js."""
    runs = list(DEPTS) + RUN_EXTRA
    tpl = "".join(f'<template data-run="{i}" data-short="{_e(RUN_SHORT[i])}">{_run_card(i, *r)}</template>' for i, r in enumerate(runs))
    legend = "".join(f'<span><svg viewBox="0 0 24 16" aria-hidden="true">{svg}</svg>{label}</span>' for svg, label in LEGEND)
    return f'''<link rel="stylesheet" href="/kin.css"><script src="/kin.js" defer></script><script src="/trail.js" defer></script>
      <div class="tm-poster">
        <div class="tm-poster__top"><b>Chairlift Mountain</b><span class="mono">Trail map &middot; Winter season</span></div>
        <ul class="tm-board mono" aria-label="Mountain report"><li>Runs open <b>8 of 8</b></li><li>Lifts open <b>4 of 4</b></li><li>Conditions <b>Bluebird</b></li><li>Grooming <b>Nightly</b></li></ul>
        <div class="tm-wrap"><div class="tm-map">
          <picture><source type="image/webp" srcset="/images/trail-map-800.webp 800w, /images/trail-map-1200.webp 1200w" sizes="(max-width: 860px) 820px, 1180px"><img src="/images/trail-map.jpg" width="1200" height="825" loading="lazy" decoding="async" alt="Trail map of Chairlift Mountain: eight runs rated from easiest to expert, one for each kind of work we do, and four lifts from the base lodge to the summit"></picture>
          <svg id="tm-svg" viewBox="0 0 1600 1100" aria-hidden="true"></svg>
        </div></div>
        <div class="tm-legend mono">{legend}</div>
      </div>
      <div class="tm-list" id="tm-list" role="group" aria-label="Pick a run"></div>
      <div class="tm-card" id="tm-card" aria-live="polite">{_run_card(0, *runs[0])}</div>
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
