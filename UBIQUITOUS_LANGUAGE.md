# Ubiquitous Language

## Core Systems

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Main-Site (Legacy)** | The existing Next.js codebase for the Segmento main website (`apps/main-site`). | Old site, current site |
| **Segmento Website** | The new Next.js codebase being built to replace the legacy main-site (`apps/segmento-website`). | New site, new UI |
| **Data Intelligence Platform** | The collective suite of Segmento products (Pulse, Sense, Collect, Resolve, SprintQL). | The platform, suite |

## Products

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Segmento Pulse** | Tracks global data privacy news and regulatory changes. | Pulse |
| **Segmento Sense** | Explainable AI that detects, classifies, and redact PII. | Sense |
| **Segmento Collect** | Aggregates data from 12+ source types through intelligent pipelines. | Collect |
| **Segmento Resolve** | Turns data requests into structured, trackable tickets. | Resolve |
| **Segmento SprintQL** | Collaborative tool for actionable retrospectives. | SprintQL |

## Example dialogue

> **Dev:** "Are we modifying the **Main-Site (Legacy)** directly for the redesign?"
> **Domain expert:** "No, we are building the **Segmento Website** in a completely new folder. Once it's ready and mirrors the functionality of the **Data Intelligence Platform** products, we will delete the legacy one."
> **Dev:** "Got it. So I'll reference the **Main-Site (Legacy)** for content but write all new code in **Segmento Website**."

## Design & Architecture

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Dual Accent palette** | Segmento's color strategy: Electric Indigo (`#384CD3`) is the sole CTA/action color; Coral (`#E8734A`) is a secondary accent reserved for hero and illustration highlights only, never for CTAs. | Two-tone theme, accent colors |
| **Particle Field Hero** | The Hero section's 3D element: a field of nodes that resolves from scattered to clustered on load/scroll, visualizing "find it → protect it." Replaces the earlier Torus Knot. | 3D background, torus knot |
| **Light-primary / dark-toggle** | The site's theming foundation: light mode is the default rendered state; dark mode is an explicit user-toggled variant, not the default. | Dark-mode-first |


## Flagged ambiguities

- "main-site" was used to refer to both the current codebase and the overall public-facing website concept. We will use **Main-Site (Legacy)** for the old code and **Segmento Website** for the new implementation.


## Organization Roles
 
*Added 2026-09-02. Builds on Organization Account Handling — does not modify it. An Organization now supports more than one member, each with a role.*
 
| Term | Definition | Aliases to avoid |
| ----------- | ------------------------------------------------------- | --------------------- |
| **Roles Table** | The Sense-defined `roles` table (`name` PK, boolean permission flags: `can_use_connectors`, `can_tag_pii`, `can_view_profile_stats`, `can_manage_org`, `can_use_model_lab`). Seeded with exactly `admin` and `support` today. A future third role is a data insert, not a schema migration — this is the whole reason it's a table and not a hardcoded check. | Role enum, permission list |
| **Admin Role** | The org creator's permanent role. Full access — identical to what an Individual account already has, plus org management (`can_manage_org`). Exactly one Admin per org in this round; no succession, no self-removal. | Owner, org owner |
| **Support Role** | The restricted role granted via invite. Can use File Handlers and see their own results/credits (baseline capabilities, ungated). Cannot use Connectors, tag PII, view org-wide Profile Stats, or use Model Lab/Evaluator tools — enforced server-side, not just hidden in the UI. | Member role, viewer role |
| **Org Invite** | A row in `sense_org_invites` — single-use, ~7-day expiry, holding an unguessable `token`, the `invited_email`, and the role it grants (always `support` today, stored for future-proofing). Status is derived, not stored: unused + unexpired = pending; `used_at` set = claimed; past `expires_at` unused = dead. | Invite token, join link |
| **Linked Identity Check** | *(Existing term, reused here.)* Originally built for Google OAuth — decides whether an authentication event represents a genuinely new person or an existing identity gaining new context. Applied a second time in Org Invites: an invite accepted by an email matching an existing Individual account converts that account in place rather than creating a duplicate. | Account matching, identity merge |
| **require_permission Dependency** | The FastAPI dependency (sits beside `_uid_from_auth()`) that gates a protected route by permission name. Default-allows any user with no org role (every Individual account, unconditionally) — this feature is designed to never restrict someone who isn't in an organization. | Permission check, role guard |
| **Member Removal** | The act of an Admin removing a Support user from their org. Demotes them to a normal Individual account — clears `org_id`/`role`, keeps their own login and their own data untouched. Never deletes or deactivates the person's account; that would be a different, larger feature. | Kick, ban, deactivate |