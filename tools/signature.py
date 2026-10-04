import os
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "brand")

def sig(dark):
    bg    = "#141B2A" if dark else "#FFFFFF"
    name  = "#FFFFFF" if dark else "#141B2A"
    role  = "#B9C0CC" if dark else "#55595F"
    text  = "#FFFFFF" if dark else "#141B2A"
    label = "#B9C0CC" if dark else "#141B2A"
    line  = "#3DFFC1" if dark else "#141B2A"
    tag   = "#B9C0CC" if dark else "#55595F"
    logo  = "email-logo-dark.png" if dark else "email-logo.png"
    pad   = "20px 24px" if dark else "0"
    box   = (f'bgcolor="{bg}" style="border-collapse:separate;background:{bg};font-family:Helvetica,Arial,sans-serif;"'
             if dark else 'style="border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;"')
    title = "Ink" if dark else "White"
    row = lambda l, href, val: (f'<tr><td style="width:22px;padding:0 6px 0 0;font-size:12px;line-height:19px;font-weight:bold;color:{label};">{l}:</td>'
                                f'<td style="font-size:13px;line-height:19px;"><a href="{href}" style="color:{text};text-decoration:none;">{val}</a></td></tr>')
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
            <img src="https://usechairlift.com/images/email-headshot.jpg" width="84" height="84" alt="Ryan Peddigrew" style="display:block;width:84px;height:84px;border-radius:44px;border:2px solid #3DFFC1;">
          </td>
          <td style="vertical-align:middle;padding:0 0 0 16px;border-left:3px solid {line};">
            <p style="margin:0;font-size:17px;line-height:21px;font-weight:bold;color:{name};">Ryan Peddigrew</p>
            <p style="margin:3px 0 10px;font-size:11px;line-height:14px;font-weight:bold;letter-spacing:1.5px;color:{role};">FOUNDER</p>
            <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">
              {row("M", "tel:+16474537926", "(647) 453 7926")}
              {row("E", "mailto:ryan@usechairlift.com", "ryan@usechairlift.com")}
              {row("W", "https://usechairlift.com", "usechairlift.com")}
            </table>
            <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;margin-top:14px;">
              <tr>
                <td style="vertical-align:middle;padding:0 10px 0 0;"><a href="https://usechairlift.com"><img src="https://usechairlift.com/images/{logo}" width="36" height="36" alt="Chairlift" style="display:block;width:36px;height:36px;border:0;"></a></td>
                <td style="vertical-align:middle;">
                  <p style="margin:0;font-size:13px;line-height:16px;font-weight:bold;letter-spacing:0.3px;color:{name};">Chairlift</p>
                  <p style="margin:1px 0 0;font-size:11px;line-height:14px;font-style:italic;color:{tag};">Make the climb easier.</p>
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
