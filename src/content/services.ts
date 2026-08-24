/** Service offerings rendered on /services. */

import { Search, FileCheck, Shield, Users, type LucideIcon } from 'lucide-react';

export interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
}

export const services: Service[] = [
  {
    icon: Search,
    title: 'IP Search & Analysis',
    description:
      'Comprehensive searches to identify existing registrations and potential conflicts before you invest in registration.',
    features: [
      'Trademark availability search',
      'Patent prior art search',
      'Freedom-to-operate analysis',
      'Competitive landscape review',
    ],
  },
  {
    icon: FileCheck,
    title: 'Registration & Filing',
    description:
      'End-to-end management of your IP registration process, from application drafting to certificate procurement.',
    features: [
      'Trademark registration',
      'Patent applications',
      'Copyright registration',
      'Design registration',
    ],
  },
  {
    icon: Shield,
    title: 'Protection & Enforcement',
    description:
      'Vigilant protection of your IP rights through monitoring, enforcement actions and dispute resolution.',
    features: [
      'Infringement monitoring',
      'Cease & desist letters',
      'Opposition proceedings',
      'Litigation support',
    ],
  },
  {
    icon: Users,
    title: 'Strategic Advisory',
    description:
      'Strategic guidance to maximise the value of your IP portfolio and align it with your business goals.',
    features: ['Portfolio audits', 'IP valuation', 'Due diligence', 'Licensing strategy'],
  },
];
