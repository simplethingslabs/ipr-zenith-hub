/**
 * Content for /about.
 *
 * TODO(owner): the milestone years below came from the original scaffold and are
 * illustrative. Replace them with the firm's actual history, or delete the
 * timeline section — an invented history is worse than none.
 */

import { Target, Award, Users, Clock, type LucideIcon } from 'lucide-react';

export interface Value {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const mission = [
  'At IPR Central we believe that every innovator, creator and business deserves access ' +
    'to quality intellectual property protection. Our mission is to demystify IP law and ' +
    'make professional IP services accessible, affordable and effective.',
  "We combine deep legal expertise with a modern, client-centric approach. Whether you're " +
    'an individual inventor protecting a first patent or an established company managing a ' +
    'multi-jurisdiction trademark portfolio, the work gets the same attention.',
  'Our team tracks IP developments closely — from emerging technologies to evolving ' +
    "regulations — so the advice you get is both legally sound and practically useful.",
];

export const pullQuote = {
  quote:
    'Innovation deserves protection. We are here to ensure your ideas have the legal ' +
    'foundation to thrive.',
  attribution: '— The IPR Central Team',
};

export const values: Value[] = [
  {
    icon: Target,
    title: 'Client-Focused',
    description:
      'Your goals drive our strategy. We tailor our approach to your specific needs and business objectives.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description:
      'We maintain high standards in everything we do, from legal analysis to client communication.',
  },
  {
    icon: Users,
    title: 'Accessibility',
    description:
      "Expert IP services shouldn't be exclusive. We make professional IP protection accessible to all.",
  },
  {
    icon: Clock,
    title: 'Responsiveness',
    description:
      'Time matters in IP. We respond promptly and keep you informed at every stage of your matter.',
  },
];

export interface Milestone {
  year: string;
  event: string;
}

export const milestones: Milestone[] = [
  { year: '2018', event: 'IPR Central founded with a mission to democratise IP services' },
  { year: '2019', event: 'Expanded practice to include patent services' },
  { year: '2020', event: 'Launched a digital-first client service platform' },
  { year: '2021', event: 'Reached the 500-registration milestone' },
  { year: '2022', event: 'Introduced specialised startup IP packages' },
  { year: '2023', event: 'Expanded the team and opened advisory services' },
  { year: '2024', event: 'Crossed 1,000 clients served' },
];
