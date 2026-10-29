/**
 * Content for /privacy and /terms.
 *
 * The text is drafted to be accurate to how this site actually behaves: it is a
 * static site with no forms, no accounts, no analytics and no tracking cookies.
 * If you later add analytics, a chat widget or a form, update the privacy page
 * and LEGAL_LAST_UPDATED. Reviewed and approved by the owner before launch.
 */

export const LEGAL_LAST_UPDATED = '29 October 2026';

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export const privacySections: LegalSection[] = [
  {
    heading: 'The short version',
    paragraphs: [
      'This website is a static brochure site. It has no user accounts, no contact form, no analytics and no advertising or tracking cookies. We do not collect personal information from you when you browse it.',
      'When you choose to contact us — by WhatsApp, email or telephone — you share information with us directly, and we use it only to respond to you and to provide the services you ask for.',
    ],
  },
  {
    heading: 'Information we do not collect',
    paragraphs: [
      'Browsing this site does not require you to submit any information, and we do not set cookies to profile or track you. We do not operate advertising pixels, session recording, heat mapping or cross-site tracking of any kind.',
    ],
  },
  {
    heading: 'Information handled by our hosting provider',
    paragraphs: [
      'Like any website, ours is delivered by a hosting provider whose servers process standard technical request data — such as your IP address, browser type and the pages requested — in order to serve the site and protect it from abuse. This is processed by the provider as part of delivering the service and is not used by us to build a profile of you.',
      'The site also loads typefaces from Google Fonts, which means your browser makes a request to Google to fetch those font files. That request is subject to Google’s own privacy terms.',
    ],
  },
  {
    heading: 'When you contact us',
    paragraphs: [
      'If you message us on WhatsApp, the conversation takes place on WhatsApp’s platform and is subject to its privacy terms in addition to ours. If you email or call, we receive whatever you choose to tell us.',
      'We use what you send us to respond to your enquiry, to advise you, and to carry out any engagement you instruct us on. We do not sell it, rent it, or share it for marketing.',
    ],
  },
  {
    heading: 'Confidentiality',
    paragraphs: [
      'Information you share with us in the course of seeking or receiving professional advice is treated as confidential and handled in accordance with the professional obligations that apply to our practice. Please note that an initial enquiry does not by itself create a client relationship — see our Terms of Service.',
    ],
  },
  {
    heading: 'Retention',
    paragraphs: [
      'We keep enquiry correspondence for as long as needed to respond and to meet our record-keeping and professional obligations, and matter files for the period required by the rules applicable to our practice.',
    ],
  },
  {
    heading: 'Your choices',
    bullets: [
      'You can ask us what information we hold about you, and ask us to correct it.',
      'You can ask us to delete enquiry correspondence, where we are not required to retain it.',
      'You can stop sharing information with us at any time by not contacting us further.',
    ],
  },
  {
    heading: 'Changes to this policy',
    paragraphs: [
      'If we change how this site works — for example by adding a contact form or analytics — we will update this page and the date shown above.',
    ],
  },
];

export const termsSections: LegalSection[] = [
  {
    heading: 'About these terms',
    paragraphs: [
      'These terms govern your use of this website. By using the site you accept them. If you do not accept them, please do not use the site.',
    ],
  },
  {
    heading: 'No legal advice',
    paragraphs: [
      'Everything on this website — including the practice area descriptions, the fee information and the articles on our blog — is general information about intellectual property. It is not legal advice, and it is not a substitute for advice on your own situation.',
      'Intellectual property outcomes turn on specific facts, dates and documents. Do not act, or refrain from acting, on the basis of anything you read here without obtaining advice on your own circumstances.',
    ],
  },
  {
    heading: 'No solicitation, no client relationship',
    paragraphs: [
      'This website is intended to provide information about our practice at your request. Nothing on it is an advertisement, solicitation or inducement to seek professional services.',
      'Sending us an enquiry — by WhatsApp, email or telephone — does not by itself create a professional relationship between us. A relationship begins only when we have confirmed in writing that we are able to act for you and the terms of that engagement are agreed. Until then, please do not send us confidential or time-sensitive information.',
    ],
  },
  {
    heading: 'Fee information',
    paragraphs: [
      'Fees are quoted on request, for example through the WhatsApp links on our Fees page. Quoted professional fees are stated exclusive of applicable taxes, and exclusive of government and statutory filing fees unless we say otherwise.',
      'Any figure discussed in an initial enquiry is indicative and not binding. The final amount depends on scope, and we confirm a quote in writing before any work begins.',
    ],
  },
  {
    heading: 'Accuracy and currency',
    paragraphs: [
      'We take care to keep the site accurate, but intellectual property law, official fees and procedural timelines change. We make no warranty that the content is current or complete, and official positions should be verified against the relevant government source.',
    ],
  },
  {
    heading: 'External links',
    paragraphs: [
      'Where we link to third-party websites — including official registries — we do so for convenience. We do not control those sites and are not responsible for their content or their handling of your information.',
    ],
  },
  {
    heading: 'Intellectual property in this site',
    paragraphs: [
      'The text, design and articles on this site are ours unless stated otherwise. You are welcome to read, quote with attribution, and link to them. You may not republish substantial portions as your own.',
    ],
  },
  {
    heading: 'Limitation of liability',
    paragraphs: [
      'To the extent permitted by law, we are not liable for loss arising from reliance on the general information published on this site. This does not limit any liability that cannot lawfully be limited, and it does not affect the terms of any engagement we separately agree with you.',
    ],
  },
  {
    heading: 'Governing law',
    paragraphs: [
      'These terms are governed by the laws of India, and the courts at our principal place of business have jurisdiction over any dispute arising from your use of this site.',
    ],
  },
];
