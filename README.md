# The Maker — Artisanat Métaux

A working storefront and workshop dashboard for a fictional two-person metal
workshop in Morocco. Built from the **Shelf — Atelier, trimmed** landing design.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Prisma 6 · MongoDB

---

## What is in it

**Storefront** — home, catalogue with collection filters, product pages, journal
(markdown), about, contact, cart, checkout, order confirmation, FAQ, care &
repair, shipping & returns, terms, privacy, and a 404.

**Dashboard** at `/dashboard`, behind a login — overview with live figures,
plus full management of **products**, **journal posts**, **orders** and
**messages**, and an account page for changing your password.

**Seeded with real content** — 24 products with full copy and specifications,
6 long-form journal posts, 3 orders, 4 messages. Nothing is lorem ipsum.

**Photographs are uploaded from the dashboard** — up to six per product, one
per journal post, dragged onto the form or picked from disk. Until a piece has
one, its image position stays a hatched placeholder carrying the brief for the
frame that belongs there (for example `[ product — forged brass bowl ]`), so
the layout is final either way and the shoot list writes itself.

---

## Getting started

### 1. Install

```bash
npm install
```

### 2. A database

Prisma needs MongoDB **as a replica set** — a plain local `mongod` will not do.
Either point `DATABASE_URL` at a MongoDB Atlas cluster, or start the throwaway
one included here:

```bash
npm run db:local
```

That prints a connection string and holds the database open until you stop it.
Copy the string into `DATABASE_URL` in `.env`. The data is discarded on exit, so
it is for development only.

### 3. Configure

```bash
cp .env.example .env
```

| Variable | What it does |
| --- | --- |
| `DATABASE_URL` | MongoDB connection string (replica set required) |
| `NEXT_PUBLIC_SITE_URL` | Absolute origin, no trailing slash. Drives canonicals, sitemap and Open Graph |
| `AUTH_SECRET` | Signs the dashboard session cookie. At least 32 characters |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_NAME` / `SEED_ADMIN_PASSWORD` | The admin account the seed creates. Minimum 12 characters |

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

### 4. Schema and content

```bash
npm run db:push && npm run db:seed
```

`db:push` is used rather than `migrate` because Prisma Migrate does not support
MongoDB. The seed is safe to re-run — everything is upserted on a natural key —
but note that **re-seeding resets the admin password** to whatever is currently
in `.env`.

### 5. Run

```bash
npm run dev
```

Sign in to the dashboard at `/login` with the seeded credentials.

---

## The global variables file

`src/config/site.ts` is the single source of truth for anything appearing in
more than one place: brand strings, contact details, the address, opening hours,
social links, navigation, shipping rates, policy figures, SEO defaults
and the palette. Change it there and it changes across the site, the structured
data and the emails-to-be.

`src/config/content.ts` holds the editorial copy that is stable enough to live
in the repo rather than the database — the workshop story, the four promises,
testimonials, FAQs, and the long-form care and shipping text.

Everything a shopkeeper edits day to day — products, posts, orders, messages —
lives in MongoDB and is managed from the dashboard.

---

## Photographs

Uploads are stored **in MongoDB**, not on disk or in an object store. A 5 MB
ceiling sits well under Mongo's 16 MB per document, and it keeps deployment to
one variable: no bucket, no credentials, no second thing to back up. On a
serverless host it is also the only option that survives — the filesystem there
is read-only and per-instance.

- The dashboard uploads a file the moment it is chosen, to
  `POST /api/dashboard/images`, and the form then carries only its id. A
  Server Action's body is capped at 1 MB, which no photograph respects, and an
  editor who mistypes a slug does not have to choose their files again.
- The format and pixel size are read from the file's **own header**
  (`src/lib/image-file.ts`), never from the browser's `Content-Type`, which
  is set from the file extension and can say anything. JPEG, PNG, WebP and GIF
  are accepted; an SVG renamed to `.png` is refused, which is what keeps the
  one scriptable image format out.
- `GET /api/images/[id]` serves the bytes. An id never points at different
  bytes — editing uploads a new document and repoints the piece — so the
  response carries `immutable` for a year and answers conditional requests
  with a 304.
- Because that is a local path, `next/image` resizes and re-encodes it like
  any other asset: a 1500px PNG comes back as a 640px AVIF a third of the size.
- What a page needs to lay a photograph out — id, size, description — is kept
  on the product or post itself, so a listing of twenty-four products reads no
  image documents at all.
- Descriptions default to the product name or post title when left blank, so
  nothing is ever published with an empty `alt`.
- A photograph is deleted with the piece that used it, and when it is replaced
  or removed on save. One uploaded and then abandoned without saving is the
  single case left behind.

---

## Security

- Sessions are a signed JWT (HS256, `jose`) in an **httpOnly, SameSite=Lax**
  cookie, `Secure` in production, lasting 8 hours.
- Passwords are bcrypt at 12 rounds. A failed login for an address that does not
  exist is compared against a dummy hash, so wrong-email and wrong-password take
  the same time and the login cannot be used to enumerate accounts.
- Login is throttled on **both** the email and the client IP: 5 attempts per
  15 minutes, then a 15-minute lock. The counter lives in the database rather
  than in memory, so it survives a cold start.
- Middleware redirects unauthenticated dashboard navigations, but it is not the
  security boundary — every dashboard page and every server action calls
  `requireSession()` for itself, because actions are separate entry points.
- **Prices are never trusted from the browser.** Checkout sends product ids and
  quantities only; names, materials and prices are read back from the database
  and the totals recomputed server-side.
- Journal and product bodies are markdown rendered by `react-markdown` with raw
  HTML disabled, so dashboard content cannot inject script tags.
- Uploaded images are typed by sniffing their own header rather than by trusting
  the browser, and served back only as one of four raster types — an SVG cannot
  be stored, and so cannot be served back as something a browser would run.
- Public forms carry a honeypot field and a flood guard. A caught bot receives a
  normal success response and nothing is stored.
- Security headers (HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`, frame options) are set in `next.config.ts`, and
  `/dashboard` is additionally `X-Robots-Tag: noindex`.

---

## SEO

- Per-route metadata through `pageMetadata()` in `src/lib/seo.ts` — canonical,
  Open Graph and Twitter tags always stay in step.
- Structured data: `Organization`/`LocalBusiness`, `WebSite` with `SearchAction`,
  `Product` with `Offer` and availability, `Article`, `BreadcrumbList`,
  `ItemList` and `FAQPage`.
- `sitemap.xml` and `robots.txt` are generated from the database, so a new
  product appears in the sitemap as soon as it is published.
- A product's or post's own photograph becomes its Open Graph and Twitter card
  and its `Product`/`Article` `image`. Without one, the generated card at
  `/opengraph-image` stands in — built at request time from the brand config,
  so there is no image asset to keep in sync.
- Cart, checkout, order confirmations, login and the dashboard are all
  `noindex`, and blocked in `robots.txt`.

## Performance

- Product and journal pages are prerendered at build time via
  `generateStaticParams` and revalidated on a 10-minute ISR window; dashboard
  edits call `revalidatePath` so changes appear immediately rather than waiting.
- Fonts are self-hosted by `next/font` — no render-blocking request to Google
  and no layout shift.
- The cart is client-side only (localStorage read through
  `useSyncExternalStore`), so browsing needs no session and stays cacheable.
- Client JavaScript is limited to the header, the cart, and the forms. Every
  other page is a server component.

---

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Generate the Prisma client, then a production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run db:local` | Start a throwaway MongoDB replica set |
| `npm run db:push` | Apply the schema |
| `npm run db:seed` | Load catalogue, journal, orders, messages and the admin |
| `npm run db:studio` | Prisma Studio |

---

## Notes on scope

**No payment gateway.** Checkout records the order and confirms by email; the
workshop invoices by hand. This matches how a commission-led workshop actually
sells, and it means no payment credentials are needed to run the app. Adding
Stripe would mean a payment intent in `src/app/api/orders/route.ts` and a
webhook to move the order to `CONFIRMED`.

**No transactional email.** Orders and messages are captured and surfaced in the
dashboard, which links out to `mailto:` with the reply pre-addressed. Wiring a
provider means one call in the order and contact handlers.

**Stock** is committed when an order moves off `PENDING` and returned if it is
later cancelled — once each way, never twice.

Prisma is pinned to **6.19.3**: Prisma 7 does not support MongoDB yet and its
own documentation directs MongoDB users to the 6.19 line.
