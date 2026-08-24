/**
 * schema.org structured data passed to <Seo jsonLd={...} />.
 *
 * Kept out of the component file so that module only exports components — which
 * keeps React Fast Refresh working during development.
 */

import { SITE_URL, site } from '@/content/site';

/** Organisation-level data for the home page. */
export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: site.firmName,
    description: site.bio,
    url: SITE_URL,
    email: site.email,
    telephone: site.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.line,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.postalCode,
      addressCountry: 'IN',
    },
    areaServed: 'IN',
    knowsAbout: [
      'Trademark registration',
      'Patent prosecution',
      'Copyright protection',
      'Industrial design registration',
      'Intellectual property enforcement',
    ],
    sameAs: Object.values(site.socialLinks).filter(Boolean),
  };
}
