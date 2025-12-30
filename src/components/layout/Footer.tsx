import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react';
import { mockSettings } from '@/lib/mockData';

const quickLinks = [
  { to: '/services', label: 'Services' },
  { to: '/practice-areas', label: 'Practice Areas' },
  { to: '/fees', label: 'Fees' },
  { to: '/about', label: 'About Us' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

const practiceAreas = [
  { to: '/practice-areas#trademarks', label: 'Trademarks' },
  { to: '/practice-areas#patents', label: 'Patents' },
  { to: '/practice-areas#copyrights', label: 'Copyrights' },
  { to: '/practice-areas#designs', label: 'Designs' },
  { to: '/practice-areas#enforcement', label: 'Enforcement' },
];

export function Footer() {
  const settings = mockSettings;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-serif font-bold">
                IPR<span className="text-accent">Central</span>
              </span>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-4">
              {settings.tagline}. Expert intellectual property consultancy for businesses and individuals.
            </p>
            {/* Social Links */}
            <div className="flex space-x-3">
              {settings.socialLinks.linkedin && (
                <a
                  href={settings.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {settings.socialLinks.twitter && (
                <a
                  href={settings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Practice Areas */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-4">Practice Areas</h3>
            <ul className="space-y-2">
              {practiceAreas.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-1 text-accent flex-shrink-0" />
                <span className="text-sm text-primary-foreground/80">
                  {settings.address.line}<br />
                  {settings.address.city}, {settings.address.state} {settings.address.postalCode}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-accent flex-shrink-0" />
                <a
                  href={`tel:${settings.phone}`}
                  className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-primary-foreground/60">
              © {currentYear} {settings.firmName}. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-primary-foreground/60">
              <Link to="/privacy" className="hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-accent transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
