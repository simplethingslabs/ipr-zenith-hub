import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { WhatsAppCta } from '@/components/WhatsAppCta';
import { cn } from '@/lib/utils';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/practice-areas', label: 'Practice Areas' },
  { to: '/fees', label: 'Fees' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the drawer on navigation. Previously each link had its own onClick to
  // do this, which meant any new link silently left the menu open.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Escape should close an open drawer, and focus should return to the toggle.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-serif text-2xl font-bold text-primary">
            IPR<span className="text-accent">Central</span>
          </span>
        </Link>

        <nav className="hidden items-center space-x-1 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeClassName="text-foreground bg-muted"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center md:flex">
          <WhatsAppCta size="sm">Get Started</WhatsAppCta>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="p-2 text-foreground md:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/*
        `hidden` rather than opacity/visibility: the old version kept the panel in
        the accessibility tree and tab order while invisible, so keyboard users
        tabbed through a menu they could not see.
      */}
      <div
        id="mobile-nav"
        hidden={!mobileMenuOpen}
        className={cn(
          'absolute left-0 right-0 top-16 border-b border-border bg-background md:hidden',
        )}
      >
        <nav className="container flex flex-col space-y-2 py-4" aria-label="Mobile">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeClassName="text-foreground bg-muted"
            >
              {link.label}
            </NavLink>
          ))}
          <div className="border-t border-border pt-4">
            <WhatsAppCta size="sm" className="w-full">
              Get Started
            </WhatsAppCta>
          </div>
        </nav>
      </div>
    </header>
  );
}
