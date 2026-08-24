/**
 * Site-wide identity, contact details and SEO defaults.
 *
 * This is the SOURCE OF TRUTH for the static build. Edit this file and redeploy
 * to change the site. If the admin API/database is running, values here are used
 * for the instant first paint and then transparently refreshed from the API.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TODO(owner): every value marked PLACEHOLDER below is carried over from the
 * original database seed and is NOT real. Replace before going live.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Settings } from '@/types';

/** Canonical production origin, used for canonical URLs, sitemap and OG tags. */
export const SITE_URL = 'https://iprcentral.in'; // PLACEHOLDER — set to your real domain

/**
 * WhatsApp number in international format, digits only, no `+` or spaces.
 * This powers the primary call-to-action across the entire site, so it must be
 * correct before launch.
 */
export const WHATSAPP_NUMBER = '919518297826';

/** Prefilled message for the WhatsApp deep link. */
export const WHATSAPP_GREETING =
  "Hello IPR Central, I'd like to discuss protecting my intellectual property.";

/**
 * Builds a wa.me deep link. Works on desktop web, Android and iOS, and needs no
 * backend — which is why it replaced the old server-backed contact form.
 */
export function whatsappUrl(message: string = WHATSAPP_GREETING): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const site: Settings = {
  id: 'main',
  firmName: 'IPR Central',
  tagline: 'Protecting Your Intellectual Property Rights',
  bio:
    'IPR Central is an intellectual property consultancy specialising in trademark ' +
    'registration, patent prosecution, copyright protection and IP enforcement. We work ' +
    'with founders, creators and established businesses to turn ideas into protected, ' +
    'enforceable assets — with clear advice and transparent pricing.',
  email: 'sahil09pr@gmail.com',
  phone: '+91 95182 97826',
  whatsapp: `+${WHATSAPP_NUMBER}`,
  address: {
    line: 'Chamber No. 44, Bar Association Court Complex, Bahadurgarh, Jhajjar',
    city: 'Bahadurgarh',
    state: 'Haryana',
    postalCode: '124507',
  },
  socialLinks: {
    linkedin: 'https://linkedin.com/company/iprcentral', // PLACEHOLDER
    twitter: 'https://twitter.com/iprcentral', // PLACEHOLDER
  },
};

/** Rendered on the Contact page. */
export const officeHours = [
  { days: 'Monday – Friday', hours: '9:00 AM – 6:00 PM' },
  { days: 'Saturday', hours: '10:00 AM – 2:00 PM' },
  { days: 'Sunday', hours: 'Closed' },
];

/** Default meta description used when a page does not supply its own. */
export const defaultDescription =
  'Expert intellectual property consultancy for trademarks, patents, copyrights and ' +
  'designs. Transparent fees, clear advice, and end-to-end filing and enforcement support.';
