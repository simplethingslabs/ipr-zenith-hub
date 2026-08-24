/**
 * Site footer.
 *
 * Previously this fetched `/api/settings` on mount — on every page, with no
 * cache — and rendered a duplicated "loading" copy of itself until the request
 * landed. That was ~130 lines of near-identical markup maintained twice, plus a
 * redundant request on every navigation. Settings now resolve synchronously from
 * the content bundle, so there is one footer and no request.
 */

import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';
import { useSiteSettings } from '@/lib/content';
import { WhatsAppIcon } from '@/components/WhatsAppCta';
import { whatsappUrl } from '@/content/site';

const quickLinks = [
  { to: '/services', label: 'Services' },
  { to: '/practice-areas', label: 'Practice Areas' },
  { to: '/fees', label: 'Fees' },
  { to: '/about', label: 'About Us' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

const practiceAreaLinks = [
  { to: '/practice-areas#trademarks', label: 'Trademarks' },
  { to: '/practice-areas#patents', label: 'Patents' },
  { to: '/practice-areas#copyrights', label: 'Copyrights' },
  { to: '/practice-areas#designs', label: 'Designs' },
  { to: '/practice-areas#enforcement', label: 'Enforcement' },
];

export function Footer() {
  const settings = useSiteSettings();
  const currentYear = new Date().getFullYear();

  const socials = [
    { url: settings.socialLinks.linkedin, Icon: Linkedin, label: 'LinkedIn' },
    { url: settings.socialLinks.twitter, Icon: Twitter, label: 'Twitter' },
    { url: settings.socialLinks.facebook, Icon: Facebook, label: 'Facebook' },
  ].filter((s): s is { url: string; Icon: typeof Linkedin; label: string } => Boolean(s.url));

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="mb-4 inline-block">
              <span className="font-serif text-2xl font-bold">
                IPR<span className="text-accent">Central</span>
              </span>
            </Link>
            <p className="mb-4 text-sm leading-relaxed text-primary-foreground/80">
              {settings.tagline}. Expert intellectual property consultancy for businesses and
              individuals.
            </p>
            {socials.length > 0 && (
              <div className="flex space-x-3">
                {socials.map(({ url, Icon, label }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-primary-foreground/10 p-2 transition-colors hover:bg-primary-foreground/20"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <nav aria-label="Quick links">
            <h2 className="mb-4 font-serif text-lg font-semibold">Quick Links</h2>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Practice areas */}
          <nav aria-label="Practice areas">
            <h2 className="mb-4 font-serif text-lg font-semibold">Practice Areas</h2>
            <ul className="space-y-2">
              {practiceAreaLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="mb-4 font-serif text-lg font-semibold">Contact Us</h2>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-accent" aria-hidden="true" />
                <address className="text-sm not-italic text-primary-foreground/80">
                  {settings.address.line}
                  <br />
                  {settings.address.city}, {settings.address.state} {settings.address.postalCode}
                </address>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-accent" aria-hidden="true" />
                <a
                  href={`tel:${settings.phone.replace(/\s/g, '')}`}
                  className="text-sm text-primary-foreground/80 transition-colors hover:text-accent"
                >
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-accent" aria-hidden="true" />
                <a
                  href={`mailto:${settings.email}`}
                  className="break-all text-sm text-primary-foreground/80 transition-colors hover:text-accent"
                >
                  {settings.email}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <WhatsAppIcon className="h-4 w-4 flex-shrink-0 text-accent" />
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-foreground/80 transition-colors hover:text-accent"
                >
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-primary-foreground/60">
              © {currentYear} {settings.firmName}. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-primary-foreground/60">
              <Link to="/privacy" className="transition-colors hover:text-accent">
                Privacy Policy
              </Link>
              <Link to="/terms" className="transition-colors hover:text-accent">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
