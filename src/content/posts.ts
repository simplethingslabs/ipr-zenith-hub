/**
 * Blog posts rendered on /blog and /blog/:slug.
 *
 * `content` is Markdown and is rendered through `marked` + DOMPurify. Posts are
 * sorted newest-first by `publishedAt` at read time, so the order here does not
 * matter.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * NOTE ON THE "Judgment" CATEGORY
 * The original seed contained a post titled "Landmark Judgment: Delhi High Court
 * on Patent Infringement" whose body was a stub with no real case name, citation
 * or holding. Publishing invented case law on a practising firm's site is a
 * professional risk, so it was not carried over. Judgment posts should be
 * authored by the firm against a real citation — the category and its filter are
 * wired up and ready.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Post } from '@/types';

export const posts: Post[] = [
  {
    id: 'trademark-registration-guide',
    title: 'Understanding Trademark Registration in India',
    slug: 'understanding-trademark-registration-india',
    excerpt:
      'What actually happens between filing a trademark application and holding a registration certificate — the stages, the waiting, and the decisions that matter most.',
    category: 'Commentary',
    tags: ['trademark', 'registration', 'india', 'brand protection'],
    status: 'published',
    publishedAt: '2026-06-12T09:00:00.000Z',
    createdAt: '2026-06-12T09:00:00.000Z',
    updatedAt: '2026-06-12T09:00:00.000Z',
    content: `A trademark is the legal handle on your brand. It is what lets you stop
someone else from trading under a name confusingly close to yours, and what turns
a business name into an asset you can licence, franchise or sell.

Most people arrive at trademark registration with one question — *how long will
this take?* — and are surprised by the answer. Understanding the stages explains
why.

## Before you file: clearance

The single highest-value step happens before any application is submitted. A
clearance search looks for marks already on the register, or already in use, that
are close enough to yours to cause a conflict.

This matters more than it sounds. An application that collides with an earlier
mark does not simply get rejected cheaply — it gets objected to, which means
months of correspondence, or opposed by the earlier owner, which can mean years.
Worse, if you have already printed packaging and signage by then, the cost of
changing course is no longer a legal fee. It is a rebrand.

A search will not give you certainty. It will tell you whether you are walking
into a known problem, and that is usually the difference between a smooth filing
and an expensive one.

## Choosing the right classes

Trademarks are registered against classes of goods and services, following the
Nice Classification. You are not protecting a word in the abstract; you are
protecting it for particular commercial activities.

Two errors are common:

- **Filing too narrowly.** You register for the product you sell today, and have
  no protection for the adjacent line you launch in two years.
- **Filing too broadly.** Every additional class carries its own government fee,
  and claiming goods you have no intention of selling can leave a registration
  vulnerable to removal for non-use.

The right answer is usually your current business plus the directions you can
credibly see yourself moving in.

## Filing and examination

Once filed, the application receives a filing date — your priority date — which
is what fixes your place in the queue against later applicants.

The Registry then examines the application and issues an examination report.
Objections at this stage are routine rather than fatal. They typically fall into
two groups: the mark is considered too descriptive of the goods it covers, or it
is considered too similar to something already on the register. Both are answered
with a written response, and sometimes a hearing.

## Advertisement and opposition

If the application clears examination, it is advertised in the Trade Marks
Journal. This opens a window in which any third party may oppose the
registration.

Most applications are never opposed. When opposition does happen it is the
longest phase by far, because it is effectively a contested proceeding with
evidence and submissions on both sides.

## Registration — and then maintenance

Clearing opposition leads to registration and a certificate. Registration is
renewable indefinitely, which makes a trademark unusual among IP rights: a patent
expires, a well-maintained trademark does not.

"Well-maintained" is doing real work in that sentence. A registration needs to be
renewed on time, genuinely used in commerce for the goods it claims, and policed
against infringers. A registered mark that is never enforced steadily loses the
distinctiveness that made it protectable.

## The ™ and ® symbols

You may use **™** as soon as you are using the mark in trade, whether or not it
is registered — it signals a claim. You may only use **®** once the mark is
actually registered. Using ® prematurely is a misrepresentation, and it is worth
being careful about.

## A realistic expectation

A straightforward, unopposed application moves through these stages over a period
best measured in many months rather than weeks. An opposed one can take
substantially longer. The priority date, however, is secured on day one — which
is the strongest argument for filing earlier rather than waiting for the brand to
feel established.

---

*Official fee schedules, forms and the current status of any application are
published by the Office of the Controller General of Patents, Designs and Trade
Marks at [ipindia.gov.in](https://ipindia.gov.in). This article is general
information, not legal advice for your specific situation.*`,
  },

  {
    id: 'provisional-vs-complete-patent',
    title: 'Provisional or Complete? Choosing How to File Your First Patent Application',
    slug: 'provisional-vs-complete-patent-application',
    excerpt:
      'A provisional application buys you a priority date and time to develop the invention. It also sets a deadline you cannot miss. Here is how to decide which route fits.',
    category: 'Commentary',
    tags: ['patent', 'provisional application', 'filing strategy', 'startups'],
    status: 'published',
    publishedAt: '2026-05-20T09:00:00.000Z',
    createdAt: '2026-05-20T09:00:00.000Z',
    updatedAt: '2026-05-20T09:00:00.000Z',
    content: `Patent law rewards whoever gets to the office first. That single fact
drives most first-time filing decisions, and it is why the provisional
application exists.

## What each one is

A **complete specification** is the full document: a detailed description of the
invention, how to work it, and a set of claims defining precisely what you are
claiming as exclusively yours. It is what gets examined and, if granted, what you
own.

A **provisional specification** describes the invention without needing final
claims. Its job is narrower: to fix a priority date. You then have a limited
statutory window in which to file the complete specification, and if you do, the
complete application is treated as dating back to the provisional.

Miss that window and the provisional lapses. It does not quietly extend.

## When a provisional is the right call

**The invention still moves.** If you are actively iterating and the final form is
genuinely unsettled, a provisional secures your place while the engineering
finishes.

**You need to talk about it.** Disclosure is the quiet killer of patent rights. An
invention already public — through a demo, a conference talk, a launch, a paper —
may no longer be novel. If you have an investor meeting or a trade show before
the specification is ready, a provisional filed beforehand protects the position.
NDAs help, but a filing is stronger.

**Budget timing.** Provisional filing costs less up front and defers the larger
drafting spend.

## When to go straight to complete

**The invention is settled.** If the design is frozen, a provisional adds a step
and a deadline without adding much. Filing complete starts examination sooner,
which matters if you need a granted patent to raise money, license, or enforce.

**You are filing abroad on a tight schedule.** International routes run on their
own clocks that key off the priority date. A provisional consumes part of that
runway.

**There is a real risk of a parallel filing.** If competitors are visibly working
the same problem, the fastest route to an examined, granted right is usually the
better one.

## The trap worth knowing about

A provisional only protects what it actually describes.

This is the most common and most expensive misunderstanding. Filing a thin,
hurried provisional — a paragraph and a sketch — and then filing a rich, detailed
complete specification a year later does **not** give the new material the earlier
date. Anything not fairly disclosed in the provisional takes the later date, and
a competitor's disclosure in between can defeat it.

The practical consequence: a provisional should be written as though it were the
real thing, describing not just the version that works today but the variations,
alternatives and ranges you can reasonably foresee. "Provisional" describes its
legal status, not the effort that should go into it.

## Before you decide anything: search

Both routes assume the invention is patentable. A prior-art search is what tests
that assumption, and it is far cheaper than discovering the answer through an
examination report two years later.

A search will not prove novelty — no search can prove absence. It will find the
obvious problems, and the obvious problems are the ones that sink applications.

## The short version

Choose a provisional when the invention is real but still moving, or when you
need to disclose before you are ready to file fully. Choose complete when the
design is frozen and you want examination started. In both cases, write it as if
it were final — because for priority purposes, it is.

---

*Statutory timelines, forms and fees are published by the Indian Patent Office at
[ipindia.gov.in](https://ipindia.gov.in) and should be confirmed for your filing
date. This article is general information, not legal advice.*`,
  },

  {
    id: 'who-owns-freelance-work',
    title: 'Who Owns the Work? Copyright, Contractors and the Assignment You Forgot',
    slug: 'who-owns-freelance-work-copyright-assignment',
    excerpt:
      'Paying for creative work does not automatically make you its owner. The gap between commissioning and owning surfaces at the worst possible moment — during diligence.',
    category: 'Commentary',
    tags: ['copyright', 'contracts', 'assignment', 'startups', 'due diligence'],
    status: 'published',
    publishedAt: '2026-04-08T09:00:00.000Z',
    createdAt: '2026-04-08T09:00:00.000Z',
    updatedAt: '2026-04-08T09:00:00.000Z',
    content: `A founder commissions a logo from a freelance designer, pays the
invoice, and uses the logo on everything for three years. Then an acquirer's
lawyers ask for the assignment. There isn't one.

This is one of the most common IP defects in early-stage companies, and it is
entirely avoidable.

## Paying is not owning

Copyright arises automatically, in the author, the moment an original work is
created. The default owner is the person who made it.

An invoice marked "paid" transfers money. It does not, by itself, transfer
copyright. Depending on the arrangement, what a client gets from an unwritten
engagement may be an implied licence to use the work for the purpose it was
commissioned for — which is considerably less than ownership, and considerably
harder to prove.

The distinction between the two is invisible until it matters:

- **A licence** lets you use the work, within limits that may never have been
  discussed.
- **An assignment** makes you the owner, able to modify it, sublicense it,
  register it and sue over it.

Modifying a logo, using it on a new product line, or selling the company are all
moments where "we have a licence, we think" becomes a problem.

## Employees are treated differently — but not automatically

Work created by an employee in the course of employment generally vests with the
employer. That is the intended outcome, and it is why employment is cleaner than
contracting.

Two cautions. First, "in the course of employment" has edges — a side project
built on personal time and personal hardware is a genuinely contested category.
Second, and more importantly, many people who feel like employees are legally
contractors: the founding designer paid in equity, the "part-time CTO," the intern
on a stipend, the agency retained monthly. For every one of them, the default
runs the other way.

## Special categories

Certain works — commissioned photographs, portraits, engravings and some
cinematograph works — have their own ownership rules that can differ from the
general position, and those rules have changed over time. If your business depends
on commissioned photography or film, that is worth checking specifically rather
than assuming.

## Moral rights do not transfer

Even after a full assignment of economic rights, the author retains moral rights:
the right to be identified as the author, and the right to object to distortion or
mutilation of the work that would harm their reputation.

These cannot simply be bought out the way copyright can. In practice this rarely
obstructs ordinary commercial use, but it does mean an assignment is not quite the
clean sweep it appears to be — and heavily modifying an artist's work is a place
to be thoughtful.

## What to actually do

**Get it in writing, and get it early.** An assignment signed at the start of an
engagement costs nothing. The same assignment chased three years later, from a
freelancer who has moved countries and now understands their leverage, is a
negotiation.

**Say "assignment," not "we own it."** The document should identify the works,
assign copyright in them, and address moral rights and any pre-existing material
the contractor is bringing in.

**Watch for third-party material.** Designers use stock assets and licensed
fonts; developers use open-source libraries. A contractor cannot assign what they
never owned. The agreement should require them to disclose it, and someone should
read the licence terms — particularly for fonts, which are licensed far more
narrowly than most people assume, and for copyleft code.

**Sweep the founders in too.** Work created by founders before incorporation
belongs to the founders personally, not the company. A founder IP assignment at
incorporation closes a gap that diligence will otherwise find.

**Registration is optional but useful.** Copyright exists without registration.
Registration provides documentary evidence of the claim, which is materially
easier to rely on in an enforcement action than reconstructing a paper trail from
old email.

## The pattern

Nearly every version of this problem comes from the same place: the assumption
that commercial intent and legal effect are the same thing. Everyone involved
understood the logo was the company's. Nobody wrote it down.

A short assignment at the point of engagement is the cheapest insurance in
intellectual property.

---

*This article is general information about copyright ownership principles and is
not legal advice. Ownership of a specific work depends on its facts, the date it
was created and the terms actually agreed.*`,
  },
];
