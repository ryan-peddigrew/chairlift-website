"""Renders the small icon images used in the email signatures.
Needs Playwright with Chromium. Run: python3 tools/signature_assets.py"""
import os, subprocess, json, textwrap
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "images", "signature")
FACES = ""
os.makedirs(OUT, exist_ok=True)

ICONS = {
    "phone": '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    "web": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18"/>',
}
THEMES = {  # name colour, role colour, icon colour
    "white": ("#141B2A", "#55595F", "#6B7078"),
    "ink":   ("#FFFFFF", "#B9C0CC", "#B9C0CC"),
}

jobs = []
for t, (name, role, icon) in THEMES.items():
    for k, path in ICONS.items():
        jobs.append(dict(file=f"icon-{k}-{t}.png", html=f'<svg id="x" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="{icon}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" style="display:block">{path}</svg>'))

js = textwrap.dedent("""
const { chromium } = require('playwright');
const fs = require('fs'); const cfg = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')); const jobs = cfg.jobs; const faces = cfg.faces; const out = cfg.out;
(async () => {
  const b = await chromium.launch();
  for (const j of jobs) {
    const p = await b.newPage({ deviceScaleFactor: 3 });
    await p.setContent('<html><head><style>' + faces + ' body{margin:0;background:transparent}</style></head><body>' + j.html + '</body></html>');
    await p.evaluate(() => document.fonts.ready);
    await (await p.$('#x')).screenshot({ path: out + '/' + j.file, omitBackground: true });
    await p.close();
  }
  await b.close();
})();
""")
jsfile = os.path.join(ROOT, "tools", "_render.js")
open(jsfile, "w").write(js)
env = dict(os.environ)
env["NODE_PATH"] = subprocess.run(["npm", "root", "-g"], capture_output=True, text=True).stdout.strip()
cfgfile = os.path.join(ROOT, "tools", "_render.json")
open(cfgfile, "w").write(json.dumps(dict(jobs=jobs, faces=FACES, out=OUT)))
try:
    subprocess.run(["node", jsfile, cfgfile], check=True, env=env)
finally:
    os.remove(jsfile); os.remove(cfgfile)
print("rendered", len(jobs), "images to", OUT)
