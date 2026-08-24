/**
 * Fee schedule rendered on /fees.
 *
 * Prices are professional fees in INR. `priceMax` is only set for `variable`
 * items, where the final quote depends on scope. Government/statutory fees are
 * called out per item in `notes` rather than assumed.
 *
 * TODO(owner): these figures came from the original database seed. Confirm every
 * amount against your current rate card before launch.
 */

import type { FeeItem } from '@/types';

/**
 * Category order controls the order of sections on the page. Any category used
 * below but missing here is appended alphabetically.
 */
export const feeCategoryOrder = ['Trademarks', 'Patents', 'Copyrights', 'Designs', 'Consulting'];

export const fees: FeeItem[] = [
  // ── Trademarks ──────────────────────────────────────────────────────────────
  {
    id: 'tm-search',
    name: 'Trademark Search',
    audience: 'Individuals',
    type: 'fixed',
    priceMin: 5000,
    category: 'Trademarks',
    notes: 'Availability search across one class, with a written opinion on registrability.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tm-registration',
    name: 'Trademark Registration',
    audience: 'Individuals',
    type: 'fixed',
    priceMin: 15000,
    category: 'Trademarks',
    notes: 'Single class, single applicant. Government filing fee billed separately at actuals.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tm-registration-business',
    name: 'Trademark Registration',
    audience: 'Businesses',
    type: 'variable',
    priceMin: 18000,
    priceMax: 45000,
    category: 'Trademarks',
    notes: 'Scales with the number of classes and marks filed. Government fees at actuals.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tm-opposition',
    name: 'Opposition / Objection Response',
    audience: 'Businesses',
    type: 'variable',
    priceMin: 20000,
    priceMax: 60000,
    category: 'Trademarks',
    notes: 'Drafting and prosecuting a reply to an examination report or third-party opposition.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },

  // ── Patents ─────────────────────────────────────────────────────────────────
  {
    id: 'patent-search',
    name: 'Patentability / Prior Art Search',
    audience: 'Businesses',
    type: 'variable',
    priceMin: 20000,
    priceMax: 40000,
    category: 'Patents',
    notes: 'Prior-art landscape with a written patentability opinion.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'patent-drafting',
    name: 'Patent Drafting & Filing',
    audience: 'Businesses',
    type: 'variable',
    priceMin: 50000,
    priceMax: 150000,
    category: 'Patents',
    notes:
      'Specification drafting, claims and filing. Range reflects technical complexity. ' +
      'Government fees at actuals.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'patent-provisional',
    name: 'Provisional Application',
    audience: 'Individuals',
    type: 'variable',
    priceMin: 25000,
    priceMax: 60000,
    category: 'Patents',
    notes: 'Secures a priority date while the invention is developed further.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },

  // ── Copyrights ──────────────────────────────────────────────────────────────
  {
    id: 'copyright-registration',
    name: 'Copyright Registration',
    audience: 'Individuals',
    type: 'fixed',
    priceMin: 8000,
    category: 'Copyrights',
    notes: 'Single work. Covers application, filing and follow-up until registration.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'copyright-licensing',
    name: 'Licensing / Assignment Agreement',
    audience: 'Businesses',
    type: 'variable',
    priceMin: 15000,
    priceMax: 50000,
    category: 'Copyrights',
    notes: 'Drafting or reviewing transfer, licence and work-for-hire agreements.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },

  // ── Designs ─────────────────────────────────────────────────────────────────
  {
    id: 'design-registration',
    name: 'Design Registration',
    audience: 'Individuals',
    type: 'fixed',
    priceMin: 12000,
    category: 'Designs',
    notes: 'One design, one class. Includes preparation of representation sheets.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'design-portfolio',
    name: 'Design Portfolio Filing',
    audience: 'Businesses',
    type: 'variable',
    priceMin: 30000,
    priceMax: 90000,
    category: 'Designs',
    notes: 'Multiple related designs filed together across product variants.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },

  // ── Consulting ──────────────────────────────────────────────────────────────
  {
    id: 'ip-audit',
    name: 'IP Portfolio Audit',
    audience: 'Businesses',
    type: 'variable',
    priceMin: 75000,
    priceMax: 200000,
    category: 'Consulting',
    notes: 'Full review of owned IP, gaps, risks and a prioritised protection roadmap.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'startup-package',
    name: 'Startup IP Starter Package',
    audience: 'Businesses',
    type: 'variable',
    priceMin: 35000,
    priceMax: 80000,
    category: 'Consulting',
    notes: 'Brand clearance, one trademark filing and a founder IP-assignment set.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'consultation',
    name: 'Advisory Consultation',
    audience: 'Individuals',
    type: 'fixed',
    priceMin: 2500,
    category: 'Consulting',
    notes: 'One-hour session. Waived if you proceed with a filing within 30 days.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

/** Caveats rendered under the fee tables. */
export const feeNotes = [
  'All amounts are professional fees in Indian Rupees and exclusive of applicable GST.',
  'Government and statutory filing fees are billed separately at actuals unless a line item says otherwise.',
  'Variable pricing is confirmed as a fixed quote before any work begins.',
  'Custom quotes are available for portfolios, multi-jurisdiction filings and high-volume work.',
];
