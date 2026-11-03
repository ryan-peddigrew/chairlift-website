# 2. Website Upgrade

**Owner:** TBD (doc says "outside agency, I assume") · **Target:** ASAP
**Status:** The existing MAC Show mock-up was fine-tuned (not rebuilt): quote request form, SEO and a sales resources section are now in it. An agency brief and vetting scorecard are below so the decision on who builds the live site can be made quickly.

## What changed on the mock-up (in this branch: `mac-show-mock/`)
| Ask | What was done |
|---|---|
| Quote request form | Rebuilt the "Get a quote" form: name, company, email, phone, event type, indoor/outdoor, start date, number of days, venue and city, guest count, services needed (checkboxes), budget range in CAD, lead source, file upload for floor plan / rider / RFP, notes. Required fields are checked before submit. Wired for Netlify Forms with a spam honeypot, but the mock still shows "nothing was sent" until launch. |
| Better SEO | New title and meta description built on "AV rentals" and "event production" + Toronto / GTA, canonical URL, Open Graph tags for link previews, LocalBusiness structured data (name, Toronto, LinkedIn, services), FAQ structured data on the resources page, `sitemap.xml` and `robots.txt` ready for launch. |
| Sales resources on the site | New "Resources" section on the home page (planning checklist, package sheets and room AV guides, capabilities overview, insurance and WSIB documents, riders and stage plots, FAQ and glossary) and a new `/resources/` page with a quote checklist, FAQ and AV glossary. |
| Navigation | Added "Resources"; main call to action now reads "Get a Quote". |

**Still a mock:** `noindex` stays on and `robots.txt` blocks crawlers until launch. Nothing was deployed.

**Before launch, confirm:** street address, phone, hours (left out of the schema on purpose), response-time promise, which resources exist as PDFs today, and that all photos are cleared for public web use.

## Who should design it? (decision for Charles)
| Option | Pros | Cons |
|---|---|---|
| A. Build from this mock in-house | Fastest; content and look already agreed internally | Needs someone to own hosting, forms, updates |
| B. Freelancer finishes the mock | Low cost; keeps the design | Single point of failure |
| C. Agency (vetted, 3 quotes) | Full SEO, CMS, support | Highest cost and longest timeline |

**Recommendation:** whichever option, hand the builder this mock as the brief so the content work isn't paid for twice. If an agency is used, vet three with the scorecard below. Note: the 7 Oct tracker shows the MAC Group rebrand option (in-house / agency / freelancer) still open, which also blocks the website. Decide both together.

## Agency vetting scorecard (score 1 to 5)
| Criteria | Weight | Agency 1 | Agency 2 | Agency 3 |
|---|---|---|---|---|
| Event / AV / B2B service portfolio | 20% | | | |
| Local SEO results they can show (with references) | 20% | | | |
| CMS we can edit ourselves (no developer for text and photos) | 15% | | | |
| Form + CRM integration (HubSpot) | 15% | | | |
| Price (fixed quote, CAD, what's included) | 15% | | | |
| Timeline to launch | 10% | | | |
| Support / hosting after launch | 5% | | | |

**Questions to ask every agency:** Who owns the domain, hosting and content after launch? Can quote form leads go straight into HubSpot? What is included for SEO (technical, local, content) and for how long? Can they show two B2B service sites they launched and their search results today? Is accessibility (AODA / WCAG 2.0 AA) included?

## SEO plan (for the live site)
1. **Google Business Profile:** claim/verify, correct categories (Audio visual equipment rental service, Event management company, Stage lighting equipment supplier), photos, services, and a routine to ask happy clients for reviews (also a 15 Sep action: improve Google Reviews).
2. **Service pages** (one page each, so each can rank): AV rentals Toronto; event production; corporate event AV; festival and outdoor stage rentals; LED wall rental; staging and draping; backline rental; hybrid / streaming; venue in-house AV partnerships; sound stage rental (once live).
3. **Segment pages** matching the target segments: corporate and agencies, hotels and venues, festivals and BIAs, concerts and touring, weddings and galas, AV partners / cross-rentals.
4. **Case studies** in the playbook's Appendix E format, one per event type first. Only with client approval.
5. **Technical:** fast images (already WebP), one H1 per page, descriptive alt text (done on the mock), schema, sitemap, HTTPS, Search Console + free analytics.
6. **Local citations:** consistent name, address and phone on Google, Bing, Apple Maps, Destination Toronto listing (membership in progress), associations.
7. **Measure monthly:** form submissions, calls, Google Business Profile actions, rankings for 10 core terms.

## Sales resources: what to produce for the site
| Resource | Exists today? | Owner |
|---|---|---|
| Capabilities overview (1 page) | [CONFIRM] | Sales |
| Package sheets / room AV guides (venue partners) | In-house AV proposal exists (Peter + Paul's) | Sales |
| Sound stage sheet | New (see open house plan) | Sales |
| Certificate of insurance / WSIB | Yes, on request | Office |
| Event planning checklist | Now on `/resources/` | Done |
| FAQ + glossary | Now on `/resources/` | Done |
| Pitch decks by segment (corporate, festival, cross-rental) | In progress (7 Oct tracker) | Ryan |
