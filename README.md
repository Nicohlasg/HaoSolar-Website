# Hao Solar website

The public website for Hao Solar: home page, services, projects, solar savings calculator, contact form and guides.

Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4 and Framer Motion.

## What you need

- Node.js 22 or newer (`.nvmrc` pins 22) and npm 10 or newer
- Git
- Optional: Google Chrome, only for the screenshot check in `scripts/shoot.mjs`

`requirements.txt` lists the same thing in one place.

## Run it locally

```bash
git clone git@github.com:Nicohlasg/HaoSolar-Website.git
cd HaoSolar-Website
nvm use          # or any Node 22+
npm ci
npm run dev      # http://localhost:3000
```

Before pushing a change:

```bash
npm run lint
npm test
npm run build
npm run photos:check
```

## Deploy on the company server

> [!IMPORTANT]
> This site is **not** hosted on Vercel. It needs a running Node.js server; it cannot be exported as plain HTML files. The contact form, the newsletter sign-up, `/projects` and `/calculator` are rendered on the server.

```bash
npm ci
npm run build
PORT=3000 npm start
```

- Keep the process running with a service manager (systemd, pm2 or similar) and restart it after each deploy.
- Put it behind the company's web server or reverse proxy (nginx, IIS, Apache) with HTTPS.
- `next/image` resizes photos on the server and caches them in `.next/cache`, so that folder must be writable.
- The `allowedDevOrigins` IP in `next.config.ts` only affects `npm run dev`; it does nothing in production.

## Important before going live

> [!WARNING]
> **Leads are not delivered anywhere yet.** The form endpoints validate the input and then only write a short log line, without the customer's details. Connect them to the company email service and database first, or enquiries will be lost.

- **Email.** `src/app/api/lead/route.ts` has a draft block that sends through Resend. The company uses its own email service, so replace that block with a call to it. `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL` and `LEAD_FROM_EMAIL` are not needed and can be removed with it.
- **Database.** Nothing is stored yet. Save leads in `src/app/api/lead/route.ts` and newsletter sign-ups in `src/app/api/subscribe/route.ts` to the company database. Keep the connection details in environment variables on the server, never in the code.
- **Environment variables.** Put them in `.env.local` on the server (git ignores every `.env*` file). Only variables that start with `NEXT_PUBLIC_` reach the browser, so keep secrets without that prefix.
- **Spam and abuse.** Both form endpoints have a hidden honeypot field but no rate limit. Add a limit at the proxy or in the route, and consider a CAPTCHA (see the list below).
- **Placeholder content.** Figures that are not yet confirmed carry a red "to confirm" tag. Search the code for `TO CONFIRM`, `PLACEHOLDER` and `sample: true` before launch. That covers the export rate, the price per kWp, the maintenance period and the legal entity in the footer.
- **Photos.** Drone and phone photos contain the exact GPS position of the customer's house. Run `npm run photos:clean` after adding any image under `public/images`, and `npm run photos:check` before every push. If a photo only displays the right way up because of its metadata, the script refuses it and prints the rotation to apply first (`sips -r <degrees>` on a Mac).
- **Customer privacy.** Project cards show a rough area only, never an address or house number, and map positions are rounded to about a kilometre. Please keep it that way.

## Planned features and the APIs they need

| Feature | API or service | Notes |
|---|---|---|
| Roof-specific solar estimate from a postal code | [Google Maps Platform Solar API](https://developers.google.com/maps/documentation/solar) (Building Insights, Data Layers) | Paid per request, needs a Google Cloud project and an API key. Call it from the server so the key stays private. Would replace the rule-of-thumb model in `src/config/solar-model.ts` for covered roofs. |
| Postal code to map position | [OneMap API](https://www.onemap.gov.sg/apidocs/) (Singapore Land Authority) | Free, needs an account token. Turns the postal code from the hero and the calculator into coordinates for the Solar API. Google Geocoding API also works. |
| Aerial view of the customer's roof in the calculator | Google Maps Static API or Map Tiles API | Same Google Cloud project as the Solar API. |
| Live Google rating and reviews | Google Places API (Place Details) | Replaces the hand-copied reviews in `src/content/reviews.ts`. Cache the result for a day. |
| Current electricity tariff | SP Group tariff, published quarterly; [data.gov.sg](https://data.gov.sg) datasets | There is no official live API. A scheduled job that updates `src/config/solar-model.ts` each quarter is enough. |
| Form spam protection | Cloudflare Turnstile or Google reCAPTCHA | Site key in the browser, secret key checked on the server in the form routes. |
| Drone video in the hero | None, video files only | Drop an MP4 and a poster image into `public/video/` and set `HERO_CLIP` in `src/content/media.ts`. |
| WhatsApp replies from the website | WhatsApp Business Platform (Cloud API) | Optional. The site currently opens a normal `wa.me` chat link. |
| Visitor analytics | Google Analytics 4, or any tool the company already uses | Add the script in `src/app/layout.tsx` and update the privacy policy page. |

Not needed: Resend (the company has its own email service) and a hosted database such as Supabase (the company database is used instead).

## Where things live

```
src/app/               pages and the two API routes (api/lead, api/subscribe)
src/components/        page sections and UI pieces
src/content/           text, projects, reviews, FAQ, guides
src/config/            company details (site.ts), calculator figures (solar-model.ts), colours
src/lib/               calculator maths and animation helpers, with tests (*.test.ts)
public/images/         logo, certificates, project photos (metadata stripped)
scripts/               strip-photo-metadata.mjs, shoot.mjs (screenshot and overflow check)
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |
| `npm run photos:clean` | Remove GPS and camera data from every image in `public/images` |
| `npm run photos:check` | Fail if any image still has that data |
| `node scripts/shoot.mjs [url]` | Desktop and mobile screenshots of the main pages, reports sideways scroll and console errors |

Files ignored on purpose: all other `*.md` notes, `AGENTS.md` (Next.js rewrites it on every `npm run dev`), and the local tool folders `.claude/`, `.claude-flow/` and `.impeccable/`.
