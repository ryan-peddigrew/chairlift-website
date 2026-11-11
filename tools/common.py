import os, re
SITE = "https://usechairlift.com"
EMAIL = "ryan@usechairlift.com"
# Leave blank to hide. Paste the full link to switch it on.
BOOKING_URL = "https://cal.com/chairlift/5min"
LINKEDIN_URL = ""

MAIN_CTA = "/5min/" if BOOKING_URL else "/get-in-touch/"
MAIN_CTA_ATTRS = ""

LOGO = '<svg width="{s}" height="{s}" viewBox="-1 -1 66 66" aria-hidden="true"><path d="M2 0H62A2 2 0 0 1 64 2V62A2 2 0 0 1 62 64H2A2 2 0 0 1 0 62V2A2 2 0 0 1 2 0Z" fill="#141B2A"{stroke}/><rect x="10" y="42.5" width="20" height="7" rx="1.2" fill="#fff"/><rect x="22" y="29" width="20" height="7" rx="1.2" fill="#fff"/><rect x="34" y="15.5" width="20" height="7" rx="1.2" fill="#3DFFC1"/></svg>'

FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath d='M2 0H62A2 2 0 0 1 64 2V62A2 2 0 0 1 62 64H2A2 2 0 0 1 0 62V2A2 2 0 0 1 2 0Z' fill='%23141B2A'/%3E%3Crect x='10' y='42.5' width='20' height='7' rx='1.2' fill='%23fff'/%3E%3Crect x='22' y='29' width='20' height='7' rx='1.2' fill='%23fff'/%3E%3Crect x='34' y='15.5' width='20' height='7' rx='1.2' fill='%233DFFC1'/%3E%3C/svg%3E"

STAIRS_BG = ''

ARROW = '<svg class="climb-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5 V4.5"/><path d="M5.5 11 L12 4.5 L18.5 11"/></svg>'

NAV = [
    ("how", "/how-it-works/", "How it works"),
    ("services", "/what-we-do/", "What we do"),
    ("examples", "/examples/", "Case studies"),
    ("industries", "/who-we-help/", "Who we help"),
    ("about", "/who-we-are/", "Who we are"),
]


# home intro option for review (?intro=1): only the spinning logo over a greyed sky until the first scroll, touch or mouse move
INTRO_JS = """
<script>try{if(/[?&]intro=1/.test(location.search)&&scrollY<10){document.documentElement.classList.add('px-intro');history.scrollRestoration='manual'}}catch(e){}</script>"""


# Free visit statistics: Umami Cloud (Hobby plan). Paste the Website ID here to switch it on.
UMAMI_ID = "1c2d08fe-7f1e-4640-8adb-77bf8559328b"
ANALYTICS = f'<script defer src="https://cloud.umami.is/script.js" data-website-id="{UMAMI_ID}"></script>' if UMAMI_ID else ""


# Tells search engines who the business is (name, site, logo, contact). Home page only.
ORG_LD = f'''
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"Organization","name":"Chairlift","url":"{SITE}/","logo":"{SITE}/icon-512.png","email":"{EMAIL}"}}</script>'''


# Fonts (11 Nov 2026): the four site typefaces are served from our own /fonts/ folder instead of Google Fonts.
# Same lettering, but phones no longer wait on two extra servers before the first screen can show.
# The Daily Peddigrew sample keeps its own newspaper fonts from Google, loaded late (see PAPER_IMG in build.py).
_LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
def _face(family, file, weight, extra=""):
    return f"@font-face{{font-family:'{family}';font-style:normal;font-weight:{weight};{extra}font-display:swap;src:url(/fonts/{file}.woff2) format('woff2');unicode-range:{_LATIN}}}"
FONT_CSS = "".join([
    _face("Archivo", "archivo", "400 800", "font-stretch:62% 125%;"),
    _face("Hanken Grotesk", "hanken-grotesk", "300 800"),
    _face("Michroma", "michroma", "400"),
    _face("IBM Plex Mono", "ibm-plex-mono-400", "400"),
    _face("IBM Plex Mono", "ibm-plex-mono-500", "500"),
])
# The home hero's still photo is the first big thing a visitor sees, so the browser is told to fetch it first.
HERO_PRELOAD = '\n<link rel="preload" as="image" href="/images/hero-reel-4-poster-800.webp" type="image/webp" fetchpriority="high">'


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
{ANALYTICS}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Chairlift">
<meta property="og:url" content="{SITE}{path}">
<meta property="og:title" content="{full}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{SITE}/og-card-2.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Chairlift: Less busywork. More business.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{full}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{SITE}/og-card-2.jpg">
<meta name="theme-color" content="#141B2A">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">{ORG_LD if path == "/" else ""}
<link rel="preload" href="/fonts/archivo.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/michroma.woff2" as="font" type="font/woff2" crossorigin>{HERO_PRELOAD if path == "/" else ""}
<style>{FONT_CSS}</style>
<link rel="stylesheet" href="/styles.css">
<link rel="stylesheet" href="/pxp.css">{'<link rel="modulepreload" href="/vendor/pxp3d.bundle.js" fetchpriority="low">' if path == "/" else ""}{'<link rel="stylesheet" href="/air.css"><script src="/air.js" defer></script>' if path == "/" else ""}{INTRO_JS if path == "/" else ""}
<link rel="stylesheet" href="/tune.css">
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
  <span class="hdr-px" hidden></span>
  <div class="wrap">
    <a class="brand" href="/" aria-label="Chairlift home">{LOGO.format(s=36, stroke="")}<span>Chairlift</span></a>
    <span class="hdr-dash" aria-hidden="true"></span><a class="hdr-cta" href="/5min/">Take the lift</a>
    <nav class="nav" aria-label="Main">
{desk}
      <a class="btn btn-ink nav-cta" href="{MAIN_CTA}">Take the lift</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu"><span class="menu-dot" aria-hidden="true">●</span> <span class="menu-label">Menu</span></button>
    </nav>
  </div>
  <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile" hidden>
{mob}
    <a class="btn btn-ink" href="{MAIN_CTA}">Take the lift</a>
  </nav>
</header>
'''


FOOTER_LINKS = [
    ("/how-it-works/", "How it works"),
    ("/what-we-do/", "What we do"),
    ("/examples/", "Case studies"),
    ("/who-we-are/", "Who we are"),
    ("/get-in-touch/", "Get in touch"),
    ("/privacy/", "Privacy"),
    ("/terms/", "Terms"),
]


def footer():
    links = FOOTER_LINKS + ([(LINKEDIN_URL, "LinkedIn")] if LINKEDIN_URL else [])
    items = "\n".join(f'        <li><a href="{h}">{t}</a></li>' for h, t in links)
    return f'''
<footer class="site-footer">
  <div class="wrap footer-top">
    <div class="footer-brand">
      <a class="brand" href="/" aria-label="Chairlift home">{LOGO.format(s=34, stroke=' stroke="rgba(255,255,255,0.3)" stroke-width="2"')}<span>Chairlift</span></a>
      <p>We help established businesses take the routine work off their team's plate, so their people can focus on clients and growth.</p>
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
<script src="/pxp.js" defer></script>
<script src="/pxcloud.js" defer></script>
<!-- 3D logo: one trimmed bundle (tools/bundle3d.sh builds it from pxp3d.js). On a computer the home hero starts it right away. On phones it starts just after the first screen has painted, so the page shows first. Other pages fetch it once the page has finished loading. -->
<script>(function(){{function go(){{var s=document.createElement('script');s.type='module';s.src='/vendor/pxp3d.bundle.js';s.onerror=function(){{document.documentElement.classList.add('no-3d')}};document.body.appendChild(s)}}function idle(t){{(window.requestIdleCallback||function(f){{setTimeout(f,300)}})(go,{{timeout:t}})}}var home=document.querySelector('.pc-logo'),phone=matchMedia('(max-width: 860px), (hover: none)').matches;if(home&&!phone)go();else if(home)requestAnimationFrame(function(){{setTimeout(function(){{idle(500)}},60)}});else addEventListener('load',function(){{idle(3000)}})}})();</script>
</body>
</html>
'''


CTA_ART = '<svg class="cta-art" viewBox="0 0 200 140" aria-hidden="true"><rect x="10" y="98" width="80" height="20" rx="3"/><rect x="52" y="62" width="80" height="20" rx="3"/><rect x="94" y="26" width="80" height="20" rx="3"/></svg>'


def pills(name, options, required=True):
    req = " required" if required else ""
    out = '<div class="pills">'
    for i, o in enumerate(options):
        out += f'<label class="pill"><input type="radio" name="{name}" value="{o}"{req if i == 0 else ""}><span>{o}</span></label>'
    return out + "</div>"


def contact_form():
    """Three short steps. Without JavaScript every step shows at once and the form still posts."""
    return f'''      <form class="contact-form steps-form" name="contact" method="POST" action="/thanks/" data-netlify="true" data-netlify-honeypot="bot-field" data-ajax="/" data-steps>
        <input type="hidden" name="form-name" value="contact">
        <input type="hidden" name="subject" value="New message from usechairlift.com">
        <p class="hp" aria-hidden="true"><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
        <p class="form-progress" data-progress aria-live="polite"><span class="form-progress-bar"><i></i></span><span data-progress-text>Step 1 of 3</span></p>
        <fieldset class="form-step" data-step="1">
          <legend>What's eating your team's time?</legend>
          {pills("starting-point", ["Quotes and follow-ups", "Inquiries and first replies", "Scheduling and admin", "Reports", "Something else"])}
          <p class="field-label">Roughly how many people deal with it?</p>
          {pills("team-size", ["1 to 2", "3 to 5", "6 to 15", "More"])}
          <div class="form-nav"><button class="btn btn-white" type="button" data-next>Next</button></div>
        </fieldset>
        <fieldset class="form-step" data-step="2">
          <legend>Tell us about the task.</legend>
          <label class="field"><span>Describe it in a sentence or two</span><textarea name="message" rows="4" required placeholder="A few sentences is plenty: what your business does, and the task everyone wishes would just happen on its own."></textarea></label>
          <label class="field"><span>Where does it live today? <em>(optional)</em></span><input type="text" name="tools" placeholder="Inbox, spreadsheet, CRM, quoting tool"></label>
          <p class="field-label">When would you like it handled?</p>
          {pills("timing", ["This month", "Next quarter", "Just exploring"])}
          <div class="form-nav"><button class="btn btn-line" type="button" data-back>Back</button><button class="btn btn-white" type="button" data-next>Next</button></div>
        </fieldset>
        <fieldset class="form-step" data-step="3">
          <legend>Where should we send our ideas?</legend>
          <div class="field-row">
            <label class="field"><span>Name</span><input type="text" name="name" autocomplete="name" required></label>
            <label class="field"><span>Work email</span><input type="email" name="email" autocomplete="email" required></label>
          </div>
          <label class="field"><span>Company <em>(optional)</em></span><input type="text" name="company" autocomplete="organization"></label>
          <div class="form-nav"><button class="btn btn-line" type="button" data-back>Back</button><button class="btn btn-white" type="submit">Send me ideas</button></div>
          <p class="form-fine">We reply by email within a day. Rather talk it through? <a href="/5min/">Book a five-minute conversation</a>. We only use this to reply to you. See our <a href="/privacy/">privacy policy</a>.</p>
        </fieldset>
        <p class="form-status" role="status" aria-live="polite"></p>
      </form>
'''


def cta_section(title, flush=False, intro=True):
    cls = "cta cta--flush" if flush else "cta"
    intro_p = f"        <p>{CTA_TEXT}</p>\n" if intro else ""
    booking = f'        <p class="cta-direct">Rather talk it through? <a href="/5min/">Book a five-minute conversation</a></p>\n' if BOOKING_URL else ""
    return f'''
  <section class="{cls}" id="contact" aria-labelledby="contact-title">
    <div class="cta-box">
      <div>
        <h2 id="contact-title">{title}</h2>
{intro_p}        <ul class="cta-list">
          <li><b>1</b><span>You send a few lines about your business.</span></li>
          <li><b>2</b><span>We reply by email to set up a five-minute conversation.</span></li>
          <li><b>3</b><span>You get specific ideas for what to fix first.</span></li>
        </ul>
        <p class="cta-direct">Prefer email? <a href="mailto:{EMAIL}">{EMAIL}</a></p>
      </div>
{contact_form()}    </div>
  </section>
'''


CTA_TEXT = "We'll tell you if there's a practical way to make it faster, whether or not we end up working together."


def cta_band(title):
    return f'''
  <section class="cta cta-band" aria-labelledby="cta-title">
    <div class="cta-box">
      <div>
        <h2 id="cta-title">{title}</h2>
        <p>{CTA_TEXT}</p>
        <a class="btn btn-white" href="{MAIN_CTA}"{MAIN_CTA_ATTRS}>Take the lift</a>
      </div>
    </div>
  </section>
'''


PAGE_TONE = {"What we do": ("002", "dark"), "How it works": ("003", "blue"), "In practice": ("004", "grey"),
             "Who we help": ("005", "dark"), "Who we are": ("006", "blue"), "Get in touch": ("007", "grey"),
             "The Daily Peddigrew": ("008", "blue"), "Time-back calculator": ("009", "dark"),
             "Five minutes. No pitch.": ("010", "grey")}


_TILE_SETS = [("lodge-01", "retro--color", "Double chair", "lodge-05", "", "Tower 5"), ("lodge-12", "retro--color", "Race day", "lodge-04", "", "Lift line"), ("lodge-10", "retro--color", "Base lodge", "lodge-14", "retro--color", "Mountain hotel"), ("lodge-13", "retro--color", "Mountain hotel", "lodge-11", "retro--color", "First tracks")]
def _tiles(seed):
    a, ac, al, b, bc, bl = _TILE_SETS[sum(map(ord, seed)) % len(_TILE_SETS)]
    return f'<div class="pg-tiles" aria-hidden="true"><span class="retro {ac}" style="background-image:url(/images/retro/{a}.jpg)"><em>{al}</em></span><span class="retro {bc}" style="background-image:url(/images/retro/{b}.jpg)"><em>{bl}</em></span></div>'

def page_hero(eyebrow, title, lede, extra=""):
    num, tone = PAGE_TONE.get(eyebrow, ("011", "dark"))
    big = eyebrow if eyebrow in PAGE_TONE else title
    cap = title if eyebrow in PAGE_TONE else lede
    sub = f'\n        <p class="pg-lede">{lede}</p>' if eyebrow in PAGE_TONE else ""
    big = big.rstrip(".")
    return f'''
  <section class="hero hero--page pg pg--{tone}">
    <div class="pg-wrap">
      <h1 class="pg-title">{big}<i>.</i></h1>
      <div class="pg-cap"><span class="pg-arrow" aria-hidden="true"><i class="ar ar--r"></i></span><div><p class="pg-line">{cap}</p>{sub}</div></div>{extra}
      {_tiles(title)}
    </div>
  </section>
'''


def page(title, desc, path, active, body, noindex=False):
    import re
    # Brand accent: section titles end in a full stop that can take the mint accent
    body = re.sub(r'(<h2[^>]*>[^<]*?)\.</h2>', r'\1<span class="dot">.</span></h2>', body)
    html = head(title, desc, path, noindex) + header(active) + '\n<main id="main">\n' + body + '\n</main>\n' + footer()
    return light_images(html)


# Lighter photos (3 Nov 2026): tools/optimize_images.py writes name-800.webp and name-1200.webp next to each photo.
# Every <img> that has those copies gets a srcset (phones take the 800, laptops the 1200; the original stays as fallback),
# and video posters switch to the WebP copy. No markup changes needed in build.py.
_ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
def _webps(src):
    base = os.path.splitext(src)[0]
    out = []
    for w in (800, 1200):
        f = os.path.join(_ROOT, f"{base}-{w}.webp".lstrip("/"))
        if os.path.exists(f):
            from PIL import Image
            with Image.open(f) as im:
                out.append((f"{base}-{w}.webp", im.width))   # the real pixel width, so the browser picks correctly
    return out

def light_images(html):
    def img(m):
        tag = m.group(0)
        if "srcset=" in tag:
            return tag
        src = re.search(r'src="(/images/[^"]+\.(?:jpe?g|png))"', tag)
        ws = _webps(src.group(1)) if src else []
        if not ws:
            return tag
        extra = ' srcset="' + ", ".join(f"{u} {w}w" for u, w in ws) + '"'
        if "sizes=" not in tag:
            extra += ' sizes="(max-width: 860px) 100vw, 1200px"'
        if "decoding=" not in tag:
            extra += ' decoding="async"'
        return tag[:4] + extra + tag[4:]
    html = re.sub(r"<img\b[^>]*>", img, html)
    def poster(m):
        ws = _webps(m.group(1))
        return f'poster="{ws[0][0]}"' if ws else m.group(0)
    html = re.sub(r'poster="(/images/[^"]+\.(?:jpe?g|png))"', poster, html)
    def bg(m):
        ws = _webps(m.group(1))
        return f"url({ws[-1][0]})" if ws else m.group(0)
    return re.sub(r'url\((/images/[^)"\']+\.(?:jpe?g|png))\)', bg, html)


def task_band():
    """Home closer, two doors: book the conversation, or send one task and get an idea back."""
    return f'''
  <section class="cta" id="one-task" aria-labelledby="task-title">
    <div class="cta-box cta-box--doors">
      <div>
        <h2 id="task-title">Ready when you are.</h2>
        <p>Five minutes. We'll tell you if there's a practical fix, whether or not we end up working together.</p>
        <a class="btn btn-white" href="{MAIN_CTA}"{MAIN_CTA_ATTRS}>Take the lift</a>
        <p class="cta-or"><strong>Not ready to talk?</strong> Send us one task your team does over and over, and we'll reply within a day with one practical idea.</p>
        <button class="btn btn-white task-open" type="button" aria-controls="task-form">Send us one task</button>
      </div>
      <form class="contact-form task-form" id="task-form" name="one-task" method="POST" action="/thanks/" data-netlify="true" data-netlify-honeypot="bot-field" data-ajax="/">
        <input type="hidden" name="form-name" value="one-task">
        <input type="hidden" name="subject" value="One task from usechairlift.com">
        <p class="hp" aria-hidden="true"><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
        <label class="field"><span>The task</span><textarea name="task" rows="3" required placeholder="Every Friday someone copies job notes from texts into the invoicing system."></textarea></label>
        {__import__("kin").friction_tags()}<label class="field"><span>Your email</span><input type="email" name="email" autocomplete="email" required></label>
        <button class="btn btn-white kn-send" type="submit">Send it</button>
        <p class="form-fine">We only use this to reply to you. See our <a href="/privacy/">privacy policy</a>.</p>
        <p class="form-status" role="status" aria-live="polite"></p>
      </form>
    </div>
  </section>
'''
