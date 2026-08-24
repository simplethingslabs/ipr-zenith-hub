/** Copy and value propositions for the home page. */

import { Shield, FileText, Scale, Award, type LucideIcon } from 'lucide-react';

export const hero = {
  headline: 'Protect Your Ideas.',
  headlineAccent: 'Secure Your Future.',
  /** Kept short deliberately — the hero should not carry a wall of text. */
  subhead:
    'End-to-end intellectual property support for founders, creators and established ' +
    'businesses. Trademarks, patents, copyrights and designs — filed, defended and ' +
    'maintained, with fees published up front.',
};

export interface ValueProp {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const valueProps: ValueProp[] = [
  {
    icon: Shield,
    title: 'Comprehensive Protection',
    description:
      'Full-spectrum IP protection covering trademarks, patents, copyrights and designs.',
  },
  {
    icon: FileText,
    title: 'Expert Guidance',
    description:
      'Navigate complex IP regulations with experienced professionals by your side.',
  },
  {
    icon: Scale,
    title: 'Strategic Enforcement',
    description:
      'Protect your rights with effective enforcement and dispute resolution strategies.',
  },
  {
    icon: Award,
    title: 'Transparent Pricing',
    description:
      "Clear, upfront fees with no hidden costs. Know exactly what you're paying for.",
  },
];
