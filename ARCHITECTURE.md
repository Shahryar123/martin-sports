# Martin Sports — Architecture (Phase 1–2: Foundation + Admin CRUD)

This document captures the architectural decisions made while scaffolding
the project (Phase 1) and building out full admin CRUD for products,
categories, ambassadors and content (Phase 2). It is a living document —
update it as decisions change in later phases.

## 1. Stack & application architecture

- **Next.js 16 (App Router) + TypeScript + Tailwind v4 + shadcn/ui
  (radix-nova style) + Framer Motion + Lucide.**
- Rendering model: mostly **Server Components** reading from repositories
  (see §7) at request time; **Client Components** only where interactivity
  requires it (login form, WhatsApp order button, future cart UI, product
  filters).
- No online payments in v1, so there is no payment/session-critical state
  that needs a database transaction — this simplifies the whole stack to
  "read-heavy content site + a couple of write paths" (admin CRUD, order
  inquiries), which is why a repository-backed in-memory data layer is
  sufficient for now (§7, §13).
- **Next.js 16 note:** this version renamed `middleware.ts` → `proxy.ts`
  and changed several APIs (async `cookies()`/`params` everywhere, image
  config, caching model). The app already follows the new conventions
  (`src/proxy.ts`, awaited `params` in `products/[slug]/page.tsx`, etc.).

## 2. Folder structure

```
src/
  app/
    layout.tsx            root shell: fonts, <html class="dark">, metadata, Toaster
    globals.css            design tokens (see §theme below)
    sitemap.ts / robots.ts
    (site)/                 route group: public storefront, wrapped in SiteHeader/Footer/FAB
      page.tsx               home
      products/              listing + [slug] detail
      about/ ambassadors/ contact/ delivery/
    admin/
      login/page.tsx          public — NOT wrapped by the dashboard shell
      (dashboard)/             route group: everything that requires a session
        layout.tsx              sidebar + mobile-nav shell, calls getSession()
        page.tsx                 dashboard stats
        products/                list/new/[id]/edit
        categories/              list (dialog-based create/edit)
        ambassadors/             list/new/[id]/edit
        inquiries/               read-only (seam — see §15)
        content/                 About/Homepage/Testimonials/Contact tabs
  components/
    ui/            shadcn primitives (generated, don't hand-edit)
    admin/         admin-only UI: nav, page-header, stat-card, status/publish
                   badges, confirm-dialog, admin-pagination, and
                   products/categories/ambassadors/content feature folders
    layout/        site-header, site-footer
    products/      product-image (placeholder/real image seam), order-on-whatsapp-button
    shared/        whatsapp-fab
  lib/
    constants/     site.ts (brand/contact config), categories.ts, nav.ts
    data/          placeholder seed data (products/ambassadors/testimonials/
                   categories/content)
    repositories/  data-access interfaces + in-memory implementations (§7, §7a)
    validations/   zod schemas (incl. product/category/ambassador/content)
    auth/          session.ts, admin.ts, guard.ts (§9, §7a)
    actions/       server actions — admin-auth.ts plus admin-products.ts/
                   admin-categories.ts/admin-ambassadors.ts/admin-content.ts
                   (§7a), product-search.ts
    whatsapp.ts     wa.me link builder (§10)
    seo.ts          metadata builder (§11)
    utils.ts        cn (shadcn) + slugify
  store/           zustand cart store
  types/           domain types (Product, Ambassador, Testimonial, Order...)
  proxy.ts         Next 16 middleware-equivalent — guards /admin/**
```

**Why the `(site)` and `(dashboard)` route groups exist:** the root layout
only provides `<html>/<body>`, fonts and the toast portal. The public site
and the admin dashboard have genuinely different shells (marketing
header/footer/WhatsApp FAB vs. a sidebar + admin topbar), so each gets its
own nested layout via a route group. `admin/login` sits outside the
`(dashboard)` group specifically so the auth-gated layout doesn't wrap — and
redirect-loop — the login page itself (a real bug hit and fixed during this
phase).

## 3. Component architecture

- `components/ui/*` — shadcn primitives, treated as vendored code.
- Feature folders (`products/`, `layout/`, `shared/`) hold composed,
  project-specific components. Rule of thumb: if it renders domain data
  (a `Product`, an `Ambassador`), it belongs under a feature folder, not
  `ui/`.
- `ProductImage` is the single seam between "no photo yet" and "real
  photo": it renders the first URL in `Product.images` if present, else a
  branded placeholder tile (category icon on a dark surface). No other
  component needs to know whether real photography exists yet (§12).

## 4. Data models

Defined in `src/types/*`: `Product`, `ProductVariant`, `ProductFilters` /
`ProductListParams` / `ProductListResult`, `Ambassador`, `OwnerProfile`,
`Testimonial`, `CartLineItem`, `CustomerDetails`, `OrderInquiry`.

Every seed record has an `isPlaceholder: boolean` flag. This is
deliberate: it's a machine-checkable marker for "must be replaced with
real content before launch" that a future admin UI or CI check can grep
for, rather than relying on humans remembering which products are real.

## 5. Categories

The 15 categories from the brief still live in `lib/constants/categories.ts`
(`CATEGORIES`) as the icon/name lookup used by the shop's filter UI,
homepage groups and the placeholder-image fallback (`getCategoryIcon`/
`getCategoryName`, both tolerant of an unknown slug). `CategorySlug` is now
a plain `string`, not a union derived from that array: `/admin/categories`
manages a separate, mutable `Category` entity (`lib/repositories/
category-repository.ts`, seeded 1:1 from `CATEGORIES`) with description,
image, sort order and published state, and admins can add categories
beyond the original 15. A category created this way is fully manageable in
the admin (and selectable on the product form's category dropdown, which
reads from `categoryRepository`), but won't get a bespoke Lucide icon or
appear in the storefront's hardcoded `HOMEPAGE_CATEGORY_GROUPS` — wiring
the public nav/homepage to the dynamic category list is a deliberate scope
cut for this phase, not an oversight.

## 6. Product repository / service abstraction

`lib/repositories/product-repository.ts` defines a `ProductRepository`
interface (`list`, `getBySlug`, `getById`, `getFeatured`, `getRelated`,
`getAllSlugs`) and an `InMemoryProductRepository` implementation backed by
`lib/data/products.ts`. All app code imports the exported
**`productRepository` instance**, never the raw seed array or the class —
that's what makes swapping the data source later a one-file change (§13).
`list()` already supports category/price/stock/tag/search filtering,
sorting and pagination, even though the current `/products` page only
uses a subset — the contract is built for the phase-2 filter/sort UI.

Mirrors: `ambassador-repository.ts`, `testimonial-repository.ts`.

## 7. Admin architecture

- Route group `admin/(dashboard)/` — responsive sidebar (Dashboard /
  Products / Categories / Ambassadors / Inquiries / Content), a Sheet-based
  mobile nav (`admin-mobile-nav.tsx`) below `md`, + topbar (signed-in-as
  email, sign out).
- `admin/login/` — outside the dashboard group, no sidebar, own centered
  card layout.
- **Phase 2 (this phase) ships full CRUD**, not just the shell:
  - `/admin/products` — search/filter/paginated table, create/edit form
    (`product-form.tsx`, React Hook Form + Zod, `useFieldArray` for
    features/specs/sizes/images), publish/featured/new/best-seller toggles,
    delete with confirmation.
  - `/admin/categories` — dialog-based create/edit (image, description,
    sort order, publish), delete.
  - `/admin/ambassadors` — full-page create/edit form (achievements,
    social links, publish), delete.
  - `/admin/content` — tabs for About (+ founder profile), Homepage,
    Testimonials (full CRUD), Contact — see §14.
  - Dashboard stats (total/published/draft/featured products, categories,
    low-stock, recent products, inquiry counts) read live from the
    repositories' `getStats()`/`adminList()` methods.
- **Data layer split**: every repository now has a public read path
  (published-only, used by the storefront) and an `admin*` read path plus
  `create`/`update`/`delete` mutation methods (seen only by
  `lib/actions/admin-*.ts` server actions). UI components never call a
  repository directly — see §7a.
- **Auth on mutations**: `proxy.ts` and the dashboard layout gate *pages*,
  but a Server Action is its own callable endpoint and bypasses both, so
  every `lib/actions/admin-*.ts` function calls
  `requireAdminSession()` (`lib/auth/guard.ts`) first, before touching a
  repository. This is what "protect admin APIs/CRUD operations" means here
  — there's no separate REST/route-handler layer to guard.

### 7a. Service layer (server actions)

`lib/actions/admin-products.ts` / `admin-categories.ts` /
`admin-ambassadors.ts` / `admin-content.ts` are the only code paths allowed
to mutate catalog/content data. Each exported action: checks the session,
re-validates the input with the matching Zod schema in `lib/validations/*`
(never trusts client-side validation alone), calls the repository, then
`revalidatePath`s the affected admin + public routes. Forms call these
directly as async functions (not via `<form action>` + FormData) because
several (product, ambassador) have nested arrays that don't round-trip
through FormData cleanly — React Hook Form manages client state,
`safeParse` runs again client-side for immediate feedback, and the server
action re-validates regardless.

## 8. Authentication approach

There is exactly one (or a small, fixed set of) admin user — Abdul Qayyum
and whoever he delegates to — with no self-registration, password reset
flow, or roles/permissions needed yet. Given that, a full auth library
(NextAuth/Auth.js, Clerk, etc.) would be more machinery than the problem
requires. Instead:

- **Credentials** live in environment variables (`ADMIN_EMAIL`,
  `ADMIN_PASSWORD_HASH`), not a database. `lib/auth/admin.ts` hashes with
  Node's built-in `scrypt` (no bcrypt dependency needed) and compares with
  `timingSafeEqual`.
- **Sessions** are an HMAC-SHA256-signed cookie (`lib/auth/session.ts`,
  secret from `AUTH_SECRET`) containing the admin email + issued-at time,
  `httpOnly`/`sameSite=lax`/`secure` in production, 8-hour expiry. No
  session store needed since the token is self-verifying.
- **`src/proxy.ts`** (Next 16's middleware replacement) redirects
  unauthenticated requests to `/admin/**` (except `/admin/login`) to the
  login page. The dashboard layout re-checks the session server-side as
  defense in depth.
- **Upgrade path:** if requirements grow (multiple admins with different
  roles, audit trail, password reset), swap `lib/auth/admin.ts` for a
  database-backed user table and swap the session cookie for a proper
  session-store or JWT library — the `getSession()`/`createSession()`
  call sites in route/layout code don't need to change.

Dev-only credentials are seeded in `.env.local` (gitignored):
`admin@martinsports.pk` / `ChangeMe123!` — replace before any real
deployment. `.env.example` documents how to generate a new hash/secret.

## 9. WhatsApp ordering architecture

`lib/whatsapp.ts` exports `buildWhatsAppOrderLink({ items, customer? })`,
which formats a `wa.me/<number>?text=<encoded message>` deep link listing
each line item, subtotal, optional delivery details, and "Payment: Cash on
Delivery". Two call sites today:

- `WhatsAppFab` (site-wide, generic "I have a question" message).
- `OrderOnWhatsAppButton` (per-product page, pre-fills that specific
  product).

Phase 2 wires the same function up to the cart (multi-item checkout) and
a structured order-inquiry form (`lib/validations/inquiry.ts` already
defines the Zod schema for it) that can submit to WhatsApp *and/or* store
an `OrderInquiry` for the admin "Inquiries" screen.

## 10. SEO architecture

- `lib/seo.ts` → `buildMetadata()` is the single place that assembles
  `title`, canonical URL, Open Graph and Twitter card metadata; route
  segments call it with just a title/description/path. Root layout sets
  the title template (`%s | Martin Sports`).
- `app/sitemap.ts` and `app/robots.ts` use the App Router file conventions
  (`MetadataRoute.Sitemap` / `.Robots`), pulling product slugs from
  `productRepository.getAllSlugs()` so the sitemap always matches the
  catalog. `/admin` is disallowed in `robots.ts`.
- Not yet done (phase 2): JSON-LD structured data (`Product`,
  `Organization`, `BreadcrumbList`) on product/detail pages, and
  per-category metadata.

## 11. Image & data replacement strategy

- `Product.images: string[]` — empty until real photography exists.
  `ProductImage` renders the first URL via `next/image` when present,
  otherwise a dark placeholder tile with the category's Lucide icon. No
  external stock photos were used, by design — an obviously-a-placeholder
  tile is more honest than a generic stock photo that looks like real
  inventory.
- `next.config.ts` now allows any `https` `remotePatterns` host. There's
  still no fixed image host or upload/storage service, and the admin
  product/category/ambassador forms take a plain image path-or-URL text
  input (no file upload) — so the optimizer needs a permissive pattern
  rather than one fixed host. Only authenticated admins can set these URLs.
  Narrow this once a real CDN/host is chosen; local `/public` images never
  needed it.
- Every placeholder record (products, ambassadors, testimonials, the
  ambassador bios) is flagged `isPlaceholder: true` and commented with
  what must not be treated as fact — no invented player names, awards or
  statistics anywhere, per the brief. Abdul Qayyum's profile only contains
  the facts given (PIA Sports Complex, Karachi; trained players who went
  on to represent Pakistan) with no invented specifics.
- Replacing content today means editing `lib/data/*.ts` directly; once
  the admin CRUD screens exist (phase 2) it means using them instead —
  the repository layer doesn't change either way.

## 12. Path to a real database

Nothing in route/component code talks to `lib/data/*.ts` directly — it
only calls `productRepository` / `ambassadorRepository` /
`testimonialRepository`. Moving to Postgres (or SQLite/Turso for a
lighter start) via Prisma or Drizzle means:

1. Write a schema mirroring `src/types/*`.
2. Implement a new class (e.g. `DbProductRepository`) satisfying the same
   `ProductRepository` interface, querying the DB instead of the seed
   array.
3. Swap the single `export const productRepository = ...` line in
   `product-repository.ts` (and the other two repositories).
4. Swap `lib/auth/admin.ts`'s env-var check for a `users` table lookup
   once there's more than one admin.

No route, page, or component changes required — that's the point of the
interface boundary.

## 13. Path to adding online payments later

The brief explicitly excludes a payment gateway for v1 (COD + WhatsApp
only). To keep that decision cheap to reverse:

- `OrderInquiry.fulfillment` is already a union type (`"cod-delivery"` for
  now) rather than a boolean — adding `"online-payment"` later is a type
  change, not a rewrite.
- Checkout today ends at "open WhatsApp" / "submit inquiry". A payment
  gateway (Stripe or a Pakistani PSP) would slot in as an alternative
  checkout path from the same cart state (`store/cart-store.ts`) and the
  same `OrderInquiry`/order model, gated behind a new `fulfillment` value
  and a new server action — it doesn't require restructuring the product
  catalog, cart, or admin data layer.
- Server Actions are already the mutation pattern in use (`admin-auth.ts`),
  so a payment-intent-creation action would follow the same shape.

## 14. Content architecture

`lib/repositories/content-repository.ts` holds three singleton records —
`AboutContent`, `HomepageContent`, `ContactConfig` (`src/types/content.ts`)
— seeded from the copy currently hardcoded in the About/Homepage/Contact
pages and `lib/constants/site.ts`. `/admin/content` (tabbed: About /
Homepage / Testimonials / Contact) is the admin UI for all of it, per the
brief's "prepare a clean architecture... don't overbuild a full CMS":
no rich text, versioning or media library, just typed forms over typed
records.

- **About** is fully wired end-to-end: the About page already read
  `ambassadorRepository.getOwnerProfile()`, so the admin form's owner-
  profile save (`updateOwnerProfileAction`) and the new `about.intro` save
  (`updateAboutAction`) both take effect on the live public page
  immediately (via `revalidatePath("/about")`).
- **Homepage and Contact are save-only for now** — the admin form
  validates and persists to `contentRepository`, but `HeroSection` and the
  contact page still read `SITE_CONFIG`/hardcoded JSX directly rather than
  these records. `SITE_CONFIG` is a build-time constant imported by many
  site-wide components (header, footer, WhatsApp links), so switching it
  to an async, admin-editable source is a larger, separate refactor — not
  done here to avoid touching unrelated public-site rendering paths for a
  dashboard task. The seam (repository + validated forms) is in place for
  that follow-up.
- **Testimonials** are a real list, not a singleton, and get full CRUD
  (`admin-content.ts`'s `create/update/deleteTestimonialAction`) exactly
  like products/ambassadors/categories; `testimonialRepository.list()`
  (used by the homepage) already filters to `published`, so unpublishing
  one immediately hides it from the public site.

## 15. Order inquiries (seam only)

No checkout/order-inquiry flow persists an `OrderInquiry` yet — the cart
(`CartView`) still goes straight to a WhatsApp deep link with no server
round-trip or stored record, per the brief's own "if order inquiries are
persisted" phrasing. `lib/repositories/order-inquiry-repository.ts` exists
as the storage seam: `/admin/inquiries` and the dashboard's inquiry stats
already read from it (showing an honest empty state today) so that wiring
an inquiry-submission form into checkout later is additive — call
`orderInquiryRepository.create()` — not a rewrite of the admin UI.

## 16. Architectural risks & things to revisit

- **Single-admin auth via env vars** doesn't scale past a handful of
  trusted admins and has no audit trail or password-reset flow. Fine for
  v1; flagged in §8 as the first thing to replace if more admins join.
- **In-memory repositories have no persistence.** This phase built real
  admin CRUD (products, categories, ambassadors, testimonials, content)
  against them anyway, per the brief — every write (create/update/delete/
  publish toggle) works and is visible immediately, but all of it resets
  to the seed data on server restart. This is a known, accepted limit of
  this phase, not a bug: §12 is the migration path (swap each
  `export const xRepository = new InMemoryXRepository(...)` line for a
  DB-backed class implementing the same interface) once real persistence
  is needed — no route/action/component code changes required.
- **Remote image URLs are unvalidated beyond "looks like a URL."** The
  admin image fields accept any path/https URL with no upload, size, or
  content-type check (§11); combined with the now-permissive
  `images.remotePatterns: [{hostname: "**"}]`, an admin (only) could point
  the image optimizer at an arbitrary external URL. Acceptable for a
  single-trusted-admin dashboard; revisit if more admins with less trust
  are added, or once a real image host/upload flow exists.
- **`AUTH_SECRET`/`ADMIN_PASSWORD_HASH` must be set per environment.**
  `lib/auth/session.ts` and `admin.ts` throw clear errors if missing
  rather than silently allowing access — but that means admin login is
  "down" until whoever deploys this sets those two env vars in production.
- **WhatsApp number and all contact/social links in `site.ts` are
  placeholders.** Nothing breaks if they're not replaced, but real
  customers must not reach a fake number — replace before launch.
- **No rate limiting on the login action or the (future) inquiry form.**
  Not a concern at current scale/single-admin, but worth adding if the
  inquiry form becomes public-facing and abusable.
- **Turbopack is now Next.js 16's default** for both dev and build. It's
  worked cleanly through this phase, but keep an eye out for any
  webpack-only tooling incompatibility as the project grows (e.g. certain
  bundle analyzers).

## Design tokens (theme foundation)

`src/app/globals.css` defines a **dark-only** design system (no light
theme — `color-scheme: dark`, `<html class="dark">`, no theme toggle):

- Layered surfaces: `--surface-0` (page) → `--surface-1` (cards) →
  `--surface-2` (hover/elevated) → `--surface-3` (popovers/modals),
  exposed as Tailwind utilities (`bg-surface-1`, etc.) via `@theme inline`.
- **One accent color**: a muted premium gold (`--primary`), used for CTAs,
  links, focus rings and the brand mark — deliberately distinct from
  `--destructive` (true red) so a delete button never reads as a brand
  action.
- Headings use **Oswald** (condensed, athletic) via `--font-heading`; body
  text uses **Geist Sans**. Border radius is a modest `0.5rem` — sharper
  and more structured than the shadcn default, avoiding an overly
  "rounded SaaS" look per the brief.
