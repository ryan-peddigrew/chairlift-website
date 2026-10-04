import os
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "brand")
BASE = "https://usechairlift.com/images"
# Contact text uses a refined system font stack (email apps cannot load custom fonts).
FONT = "'Avenir Next','Avenir','Segoe UI','Helvetica Neue',Helvetica,Arial,sans-serif"


def sig(dark):
    t = "ink" if dark else "white"
    bg = "#141B2A" if dark else "#FFFFFF"
    text = "#FFFFFF" if dark else "#141B2A"
    line = "#3DFFC1" if dark else "#141B2A"
    role = "#B9C0CC" if dark else "#55595F"
    tag = "#B9C0CC" if dark else "#55595F"
    logo = "email-logo-dark.png" if dark else "email-logo.png"
    pad = "22px 26px" if dark else "0"
    box = (f'bgcolor="{bg}" style="border-collapse:collapse;background:{bg};font-family:{FONT};"'
           if dark else f'style="border-collapse:collapse;font-family:{FONT};"')
    title = "Ink" if dark else "White"

    def row(icon, alt, href, val):
        return (f'<tr><td style="width:19px;padding:0 7px 0 0;vertical-align:middle;">'
                f'<img src="{BASE}/signature/icon-{icon}-{t}.png" width="12" height="12" alt="{alt}" style="display:block;width:12px;height:12px;border:0;"></td>'
                f'<td style="font-size:11.5px;line-height:16px;vertical-align:middle;"><a href="{href}" style="color:{text};text-decoration:none;">{val}</a></td></tr>')

    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Ryan Peddigrew – Email Signature ({title})</title>
</head>
<body style="margin:0;padding:24px;background:#ffffff;">
<!-- Copy everything between the START and END markers into your email signature -->
<!-- START SIGNATURE -->
<table cellpadding="0" cellspacing="0" border="0" role="presentation" {box}>
  <tr>
    <td style="padding:{pad};">
      <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">
        <tr>
          <td style="vertical-align:middle;padding:0 16px 0 0;">
            <img src="{BASE}/email-headshot.jpg" width="92" height="92" alt="Ryan Peddigrew" style="display:block;width:92px;height:92px;border-radius:48px;border:2px solid #3DFFC1;">
          </td>
          <td style="vertical-align:middle;padding:0 0 0 16px;border-left:3px solid {line};">
            <p style="margin:0;font-size:18px;line-height:21px;font-weight:bold;letter-spacing:1.1px;color:{text};white-space:nowrap;">RYAN PEDDIGREW</p>
            <p style="margin:0;font-size:10px;line-height:13px;font-weight:bold;letter-spacing:2.2px;color:{role};">FOUNDER</p>
            <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;margin-top:5px;">
              {row("phone", "Phone", "tel:+16474537926", "(647) 453 7926")}
              {row("mail", "Email", "mailto:ryan@usechairlift.com", "ryan@usechairlift.com")}
              {row("web", "Website", "https://usechairlift.com", "usechairlift.com")}
            </table>
            <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;margin-top:8px;">
              <tr>
                <td style="vertical-align:middle;padding:0 10px 0 0;"><a href="https://usechairlift.com"><img src="{BASE}/{logo}" width="42" height="42" alt="Chairlift" style="display:block;width:42px;height:42px;border:0;"></a></td>
                <td style="vertical-align:middle;">
                  <p style="margin:0;font-size:15px;line-height:19px;font-weight:bold;letter-spacing:0.3px;color:{text};">Chairlift</p>
                  <p style="margin:1px 0 0;font-size:10.5px;line-height:13px;font-style:italic;color:{tag};">Make the climb easier.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<!-- END SIGNATURE -->
</body>
</html>
'''


for dark, n in [(False, "white"), (True, "ink")]:
    open(os.path.join(OUT, f"email-signature-{n}.html"), "w").write(sig(dark))
print("ok")
