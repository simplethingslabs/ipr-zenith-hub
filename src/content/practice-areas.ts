/**
 * Practice areas rendered on /practice-areas.
 *
 * `id` doubles as the in-page anchor target (the footer deep-links to
 * `/practice-areas#trademarks` and friends), so ids must stay stable.
 */

export interface PracticeArea {
  id: string;
  title: string;
  description: string;
  /** Paragraphs. Rendered in order; no Markdown processing. */
  body: string[];
  services: string[];
}

export const practiceAreas: PracticeArea[] = [
  {
    id: 'trademarks',
    title: 'Trademarks',
    description: 'Protect your brand identity with comprehensive trademark services.',
    body: [
      'Trademarks are vital assets that distinguish your goods and services from competitors. Our trademark services cover the entire lifecycle of your brand protection needs.',
      'We assist with trademark searches to confirm a proposed mark is available, guide you through registration across the relevant classes, and keep registrations alive through renewals and updates.',
      'Our team handles opposition proceedings, responds to examination objections, and advises on building a trademark portfolio that grows with the business.',
    ],
    services: [
      'Comprehensive trademark searches',
      'Multi-class registration',
      'Opposition and cancellation proceedings',
      'Trademark portfolio management',
      'Brand protection strategy',
    ],
  },
  {
    id: 'patents',
    title: 'Patents',
    description: 'Secure exclusive rights to your inventions and innovations.',
    body: [
      'Patents provide powerful protection for technical innovations, granting exclusive rights to make, use and sell an invention for a limited term.',
      'We work with inventors and businesses across technology sectors, from mechanical devices to software and life sciences. Our patent services include patentability assessments, specification drafting, prosecution and maintenance.',
      'We also advise on portfolio development, licensing opportunities and freedom-to-operate questions before a product launch.',
    ],
    services: [
      'Patentability assessments',
      'Provisional and complete applications',
      'Patent prosecution',
      'Freedom-to-operate analysis',
      'Patent licensing and monetisation',
    ],
  },
  {
    id: 'copyrights',
    title: 'Copyrights',
    description: 'Protect your creative works and artistic expressions.',
    body: [
      'Copyright protects original works of authorship — literary, dramatic, musical and artistic works, as well as software and databases.',
      'We help creators and businesses register their copyrights, producing documentation that strengthens your position in a dispute. Our work extends to licensing, assignment agreements and enforcement against infringement.',
      'We also advise on permissions, fair-dealing questions, and the ownership issues that arise around commissioned work, digital distribution and AI-assisted output.',
    ],
    services: [
      'Copyright registration',
      'Licensing agreements',
      'Assignment and transfer',
      'Infringement analysis',
      'Digital rights management',
    ],
  },
  {
    id: 'designs',
    title: 'Industrial Designs',
    description: 'Protect the unique visual appearance of your products.',
    body: [
      'Design registration protects the ornamental or aesthetic aspects of a product — its shape, configuration, pattern or ornamentation.',
      'Design protection is decisive for products where visual appeal drives the purchase. We identify which elements are registrable, prepare representation sheets that hold up to examination, and manage the filing.',
      'We also advise on portfolio strategy across product variants, renewal management, and enforcement against copycat designs.',
    ],
    services: [
      'Design registrability assessment',
      'Design application filing',
      'Portfolio management',
      'Design enforcement',
      'International design protection',
    ],
  },
  {
    id: 'enforcement',
    title: 'Enforcement & Disputes',
    description: 'Protect and defend your IP rights against infringement.',
    body: [
      'When intellectual property rights are threatened, the speed and shape of the first response often determines the outcome. Our enforcement work is about protecting the asset, not escalating for its own sake.',
      'We handle cease-and-desist notices, opposition and cancellation proceedings, and provide litigation support for court proceedings — balancing firm protection against the commercial cost of a fight.',
      'We also defend against infringement claims and advise on reducing exposure before it becomes a dispute.',
    ],
    services: [
      'Cease and desist notices',
      'Opposition and cancellation proceedings',
      'Litigation support',
      'Settlement negotiations',
      'Anti-counterfeiting measures',
    ],
  },
];
