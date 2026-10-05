SITE = "https://usechairlift.com"
EMAIL = "ryan@usechairlift.com"
# Leave blank to hide. Paste the full link to switch it on.
BOOKING_URL = ""
LINKEDIN_URL = ""

LOGO = '<svg width="{s}" height="{s}" viewBox="-1 -1 66 66" aria-hidden="true"><path d="M2 0H62A2 2 0 0 1 64 2V62A2 2 0 0 1 62 64H2A2 2 0 0 1 0 62V2A2 2 0 0 1 2 0Z" fill="#141B2A"{stroke}/><rect x="10" y="42.5" width="20" height="7" rx="1.2" fill="#fff"/><rect x="22" y="29" width="20" height="7" rx="1.2" fill="#fff"/><rect x="34" y="15.5" width="20" height="7" rx="1.2" fill="#3DFFC1"/></svg>'

FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath d='M2 0H62A2 2 0 0 1 64 2V62A2 2 0 0 1 62 64H2A2 2 0 0 1 0 62V2A2 2 0 0 1 2 0Z' fill='%23141B2A'/%3E%3Crect x='10' y='42.5' width='20' height='7' rx='1.2' fill='%23fff'/%3E%3Crect x='22' y='29' width='20' height='7' rx='1.2' fill='%23fff'/%3E%3Crect x='34' y='15.5' width='20' height='7' rx='1.2' fill='%233DFFC1'/%3E%3C/svg%3E"

STAIRS_BG = ''

ARROW = '<svg class="climb-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 18.5 L16.4 7.6"/><path d="M8.5 6.3 H17.7 V15.5"/></svg>'

NAV = [
    ("how", "/how-it-works/", "How it works"),
    ("services", "/what-we-do/", "What we do"),
    ("industries", "/who-we-help/", "Who we help"),
    ("examples", "/examples/", "In practice"),
    ("about", "/who-we-are/", "Who we are"),
]


def head(title, desc, path, noindex=False):
    full = f"{title}" if title.startswith("Chairlift") else f"{title} · Chairlift"
    robots = '\n<meta name="robots" content="noindex">' if noindex else ""
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{full}</title>
<meta name="description" content="{desc}">{robots}
<link rel="canonical" href="{SITE}{path}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Chairlift">
<meta property="og:url" content="{SITE}{path}">
<meta property="og:title" content="{full}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{SITE}/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Chairlift: Make the climb easier. Automations for growing companies.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{full}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{SITE}/og-image.png">
<meta name="theme-color" content="#141B2A">
<link rel="icon" href="{FAVICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,400;0,500;0,600;0,700;0,800;1,300&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
'''


def header(active=None):
    def cur(key):
        return ' aria-current="page"' if key == active else ""
    desk = "\n".join(f'      <a class="nav-link" href="{href}"{cur(k)}>{label}</a>' for k, href, label in NAV)
    mob = "\n".join(f'    <a href="{href}"{cur(k)}>{label}</a>' for k, href, label in NAV)
    return f'''
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="/" aria-label="Chairlift home">{LOGO.format(s=36, stroke="")}<span>Chairlift</span></a>
    <nav class="nav" aria-label="Main">
{desk}
      <a class="btn btn-ink nav-cta" href="/get-in-touch/">Start a conversation</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="menu-open" d="M4 7h16M4 12h16M4 17h16"/><path class="menu-close" d="M6 6l12 12M18 6L6 18"/></svg></button>
    </nav>
  </div>
  <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile" hidden>
{mob}
    <a href="/get-in-touch/"{cur("contact")}>Get in touch</a>
    <a class="btn btn-ink" href="/get-in-touch/">Start a conversation</a>
  </nav>
</header>
'''


FOOTER_LINKS = [
    ("/how-it-works/", "How it works"),
    ("/what-we-do/", "What we do"),
    ("/examples/", "In practice"),
    ("/who-we-are/", "Who we are"),
    ("/get-in-touch/", "Get in touch"),
    ("/privacy/", "Privacy"),
]


def footer():
    links = FOOTER_LINKS + ([(LINKEDIN_URL, "LinkedIn")] if LINKEDIN_URL else [])
    items = "\n".join(f'        <li><a href="{h}">{t}</a></li>' for h, t in links)
    return f'''
<footer class="site-footer">
  <div class="wrap footer-top">
    <div class="footer-brand">
      <a class="brand" href="/" aria-label="Chairlift home">{LOGO.format(s=34, stroke=' stroke="rgba(255,255,255,0.3)" stroke-width="2"')}<span>Chairlift</span></a>
      <p>We help growing, people-run companies automate the repetitive work that slows their teams down.</p>
    </div>
    <nav aria-label="Footer">
      <ul class="footer-links">
{items}
      </ul>
    </nav>
  </div>
  <div class="footer-bottom">
    <div class="wrap">© <span data-year>2026</span> Chairlift</div>
  </div>
</footer>

<script src="/script.js" defer></script>
</body>
</html>
'''


CTA_ART = '<svg class="cta-art" viewBox="0 0 200 140" aria-hidden="true"><rect x="10" y="98" width="80" height="20" rx="3"/><rect x="52" y="62" width="80" height="20" rx="3"/><rect x="94" y="26" width="80" height="20" rx="3"/></svg>'


def contact_form():
    return f'''      <form class="contact-form" name="contact" method="POST" action="https://formsubmit.co/{EMAIL}" data-ajax="https://formsubmit.co/ajax/{EMAIL}">
        <input type="hidden" name="_subject" value="New message from usechairlift.com">
        <input type="hidden" name="_template" value="table">
        <input type="hidden" name="_next" value="{SITE}/thanks/">
        <p class="hp" aria-hidden="true"><label>Leave this empty <input name="_honey" tabindex="-1" autocomplete="off"></label></p>
        <div class="field-row">
          <label class="field"><span>Name</span><input type="text" name="name" autocomplete="name" required></label>
          <label class="field"><span>Work email</span><input type="email" name="email" autocomplete="email" required></label>
        </div>
        <div class="field-row">
          <label class="field"><span>Company <em>(optional)</em></span><input type="text" name="company" autocomplete="organization"></label>
          <label class="field"><span>Where would you start?</span>
            <select name="starting-point">
              <option>Not sure yet</option>
              <option>Answering new inquiries</option>
              <option>Following up on quotes</option>
              <option>Getting more reviews</option>
              <option>Scheduling and admin</option>
              <option>Something else</option>
            </select>
          </label>
        </div>
        <label class="field"><span>What's taking up your team's time?</span><textarea name="message" rows="4" required placeholder="A few sentences is plenty: what your business does, and the task everyone wishes would just happen on its own."></textarea></label>
        <button class="btn btn-white" type="submit">Start a conversation</button>
        <p class="form-fine">We only use this to reply to you. See our <a href="/privacy/">privacy policy</a>.</p>
        <p class="form-status" role="status" aria-live="polite"></p>
      </form>
'''


def cta_section(title, flush=False, intro=True):
    cls = "cta cta--flush" if flush else "cta"
    intro_p = f"        <p>{CTA_TEXT}</p>\n" if intro else ""
    booking = f'        <p class="cta-direct">Rather talk it through? <a href="{BOOKING_URL}" rel="noopener">Book a call</a></p>\n' if BOOKING_URL else ""
    return f'''
  <section class="{cls}" id="contact" aria-labelledby="contact-title">
    <div class="cta-box">
      <div>
        <h2 id="contact-title">{title}</h2>
{intro_p}        <ul class="cta-list">
          <li><b>1</b><span>You send a few lines about your business.</span></li>
          <li><b>2</b><span>We reply by email to set up a short call.</span></li>
          <li><b>3</b><span>You get specific ideas for what to automate first.</span></li>
        </ul>
{booking}        <p class="cta-direct">Prefer email? <a href="mailto:{EMAIL}">{EMAIL}</a></p>
      </div>
{contact_form()}    </div>
  </section>
'''


CTA_TEXT = "Tell us a little about how your business runs. We'll come back with a few specific ideas, whether or not we end up working together."


def cta_band(title):
    return f'''
  <section class="cta cta-band" aria-labelledby="cta-title">
    <div class="cta-box">
      <div>
        <h2 id="cta-title">{title}</h2>
        <p>{CTA_TEXT}</p>
        <a class="btn btn-white" href="/get-in-touch/">Start a conversation</a>
      </div>
    </div>
  </section>
'''


def page_hero(eyebrow, title, lede, extra=""):
    return f'''
  <section class="page-hero">
    {STAIRS_BG}
    <div class="wrap">
      <span class="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p class="lede">{lede}</p>{extra}
    </div>
  </section>
'''


def page(title, desc, path, active, body, noindex=False):
    import re
    # Brand accent: section titles end in a full stop that can take the mint accent
    body = re.sub(r'(<h2[^>]*>[^<]*?)\.</h2>', r'\1<span class="dot">.</span></h2>', body)
    return head(title, desc, path, noindex) + header(active) + '\n<main id="main">\n' + body + '\n</main>\n' + footer()
