"""Kinetic pieces for the mountain home page: the department switchboard, the haul schematic
with its three-position lever, and the friction tags on the closing form. Styles in kin.css,
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
    n, name, h, d, t = DEPTS[0]
    return f'''<link rel="stylesheet" href="/kin.css"><script src="/kin.js" defer></script>
      <div class="kn-board">
        <div class="kn-board__sw" role="radiogroup" aria-label="Pick a department">{sw}</div>
        <div class="kn-read" aria-live="polite">
          <p class="kn-read__bar mono"><span data-dept-code>Department {n}</span><span><i class="kn-live" aria-hidden="true"></i>Our own team builds it</span></p>
          <div class="kn-read__out" data-dept-out><h3>{h}</h3><p>{d}</p></div>
          <p class="kn-read__foot mono" data-dept-tools>Built around: {_e(t)}</p>
        </div>
        {tpl}
      </div>'''


def shift_section():
    stages = "".join(
        f'''<li class="kn-stage"><p class="mono">0{i + 1} · {_e(t)}</p><p class="kn-stage__was">{was}</p><p class="kn-stage__now">{now}</p><p class="kn-stage__st mono">By hand</p></li>'''
        for i, (t, was, now) in enumerate(STAGES))
    return f'''
  <section class="pc-sec pc-sec--cream kn-shift" aria-labelledby="shift-title">
    <div class="pc-wrap">
      <header class="sx-head"><h2 id="shift-title" class="sx-title">The shift<i aria-hidden="true">.</i></h2><div class="sx-cap"><span class="pg-arrow" aria-hidden="true"><i class="ar ar--r"></i></span><p class="sx-line">Stop being the glue holding every process together.</p></div></header>
      <figure class="kn-engine" aria-label="A diagram: everyday bottlenecks on the left run through a bullwheel and leave on the right as finished work riding the cable.">
        <p class="kn-engine__head mono"><span>Fig. 01 · The haul line</span><span>Friction cleared <b data-cleared>000%</b></span></p>
        <div class="kn-engine__stage"><canvas class="kn-canvas" aria-hidden="true"></canvas>
          <span class="kn-engine__lbl kn-engine__lbl--l mono">Everyday friction</span><span class="kn-engine__lbl kn-engine__lbl--r mono">Finished work</span></div>
        <div class="kn-lever" role="radiogroup" aria-label="Lift mode" data-mode="1">
          <span class="kn-lever__knob" aria-hidden="true"></span>
          <button type="button" role="radio" aria-checked="false" data-mode="0"><span class="mono">Manual grind</span></button>
          <button type="button" role="radio" aria-checked="true" data-mode="1"><span class="mono">Engage Chairlift</span></button>
          <button type="button" role="radio" aria-checked="false" data-mode="2"><span class="mono">Overdrive</span></button>
        </div>
      </figure>
      <ol class="kn-stages" data-stages>{stages}</ol>
    </div>
  </section>
'''


def friction_tags():
    """Optional tags inside the closing 'send us one task' form; they arrive with the email."""
    chips = "".join(
        f'<label class="kn-tag"><input type="checkbox" name="friction" value="{_e(t)}"><span>{_e(t)}</span></label>' for t in TAGS)
    return f'''<fieldset class="kn-tags"><legend>Where is the heaviest friction in your business right now? <em>(optional)</em></legend>{chips}</fieldset>
        '''
