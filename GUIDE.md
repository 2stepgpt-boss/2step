# ANSWER-FIRST — Guided Business Website Template

**Reference installation:** Mavuka People Advisory demonstration  
**Template status:** strengthened Default Installation V1  
**Stack:** Astro, React, TypeScript, Tailwind CSS, Supabase, Groq (server-only), Vercel

## Governing principle

Visitors should not have to understand a business's website structure before they can get useful help. They select a relevant service or ask a question, receive a grounded answer, inspect available approved resources, and take a practical next step.

The approved journey is:

`Choose service → Ask a focused question → Understand the answer → Assess fit and credibility → Take action`

This is a reusable template. Every customer receives an independent repository, Supabase project, Vercel deployment, credentials, knowledge library and operational ownership.

## Current homepage model

### Home

The homepage is the main Question Pad. It contains:

1. A direct question input.
2. Six configurable service selectors.
3. Four service-specific starter-question cards after a service is selected.
4. Three supporting decision cards alongside those questions:
   - **Why [Business]** — expertise, approach and credibility.
   - **Expected outcome** — supported outcomes, proof points and approved case material.
   - **Take action** — practical contact routes.
5. A compact bottom selector that lets a visitor change service without returning to the top.
6. A persistent **Speak to a human** route to WhatsApp or another approved contact destination.

Before a service is selected, the service selectors are displayed horizontally. After selection, only the selected service remains at the top with a close control that restores the full selector.

### Mavuka configuration example

The current demonstration uses:

- Fractional HC Leadership
- People & Culture Transformation
- HR Function Optimisation
- Organisational Design & Operating Model
- Recruitment Services
- HR Practice Management Setup

These are installation configuration, not hard-coded master-template services.

### Quick Info & Action

This sidebar view does not show the service-pill bar. It provides:

- inline question inputs for Products, Pricing and Availability;
- Book a Demo, Request a Quote, Call Now and WhatsApp actions;
- the same shared answer system as Home, not a separate chatbot.

### Articles and Contact

Articles are independent crawlable SEO routes. Contact routes are direct business enquiry paths. Neither replaces the central question-to-action journey.

## Answer workspace

Every information card and question submits to the same answer workspace. The workspace includes:

- answer title and summary;
- optional demonstration disclosure where demo-only material was used;
- approved resource reader;
- key points and key insight;
- helpful / not-yet feedback capture;
- follow-up, refinement and copy actions;
- persistent human-contact option.

The **Take action** card opens this same workspace with dedicated Call, WhatsApp, Book a Meeting and Book a Demo options.

## Knowledge and answer controls

Public answers use only records that belong to the current installation and are:

- `approval_status = approved`
- `access_level = public`
- effective today, where dates apply
- not expired

Supabase full-text retrieval identifies relevant approved documents. When `GROQ_API_KEY` is configured, the server may use Groq to write a concise response from those retrieved documents only. It must not invent facts, client names, prices, credentials, dates, availability or actions. If retrieval is missing or insufficient, the user is directed to a human.

The Groq key and Supabase service-role key are server-only. They must never be exposed in browser code, committed to Git, or stored in public environment variables.

## Approved resources

Resources are optional, but must be real, approved and publicly accessible before they appear.

Supported types:

- PDF
- video
- audio
- image
- checklist
- comparison
- verified external link

`Text` is implicit: every grounded answer is the text format. Do not show decorative resource badges.

When a resource is linked to a specific starter question, its format badge appears on that question card. Clicking the card opens the normal answer workspace; available PDFs open in the embedded reader on that same screen.

Resource records live in `knowledge_resources` and must include installation, document, question title where applicable, format, URL, approval status and access level. See migration `0003_approved_resources.sql`.

## Feedback and intelligence

Answer pages ask whether the answer was helpful. Feedback is stored in `question_feedback` for each installation. This supports later reporting on:

- questions that fail to help;
- knowledge gaps;
- high-interest services;
- action and contact demand;
- resource formats visitors use.

See migration `0004_question_feedback.sql`.

## Current Mavuka demonstration status

The Mavuka installation is a presentation environment. Some knowledge, proof points, resources, contact assumptions and business details are intentionally marked as demonstration-only until Mavuka approves replacements.

Before production, replace all illustrative material with verified Mavuka content. Do not remove a demo label merely because a response looks credible.

## Repository map

```text
src/
  components/QuestionPad.tsx              Home, cards, answer workspace and actions
  components/PillMorphTabs.tsx            Service selector behaviour
  installations/mavuka/site.ts            Mavuka navigation, services and identity
  installations/mavuka/knowledge/         Demo knowledge, question bank and readiness tests
  pages/api/answer.ts                     Grounded retrieval and optional Groq synthesis
  pages/api/question-resources.ts         Question-card resource availability
  pages/api/feedback.ts                   Answer feedback capture
  pages/articles/                         Crawlable SEO routes
  styles/global.css                       Shared visual rules
supabase/migrations/
  0001_default_installation.sql           Core installation and knowledge schema
  0002_mavuka_knowledge_model.sql         Enhanced answer fields
  0003_approved_resources.sql             Approved resource library
  0004_question_feedback.sql              Answer feedback storage
scripts/
  seed-mavuka-demo-resources.mjs          Clearly labelled demo PDF setup
```

## Required environment variables

```env
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<server-only-secret>
INSTALLATION_ID=<installation-uuid>
GROQ_API_KEY=<optional-server-only-key>
```

## Launch readiness

Run the test set in `src/installations/mavuka/knowledge/LAUNCH_READINESS_TESTS.md` after every knowledge, resource or template change.

Blocking failures include:

- invented or unsupported claims;
- internal/restricted information in public results;
- broken Call, WhatsApp, meeting, quote or demo paths;
- a resource badge that has no approved asset;
- expired resources or knowledge remaining visible;
- a service card that does not reach the shared answer workspace.

## New customer installation

1. Clone this tested template into a new repository.
2. Create separate Supabase and Vercel projects.
3. Apply all migrations.
4. Configure logo, brand tokens, navigation, service selectors, cards and action destinations.
5. Load and approve the customer's documents, question bank and resources.
6. Replace all demo-only material.
7. Run the readiness test set and correct blocking failures.
8. Record template, configuration and knowledge versions before launch.

The master template owns the interaction model. The customer installation owns facts, brand, content, resources, contact destinations, permissions and production operation.
