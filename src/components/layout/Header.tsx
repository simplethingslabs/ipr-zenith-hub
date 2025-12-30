import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/NavLink';
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-serif font-bold text-primary">
            IPR<span className="text-accent">Central</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
              activeClassName="text-foreground bg-muted"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA & Admin */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/admin"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Admin
          </Link>
          <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/contact">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border transition-all duration-200',
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
      >
        <nav className="container py-4 flex flex-col space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
              activeClassName="text-foreground bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-4 border-t border-border flex flex-col space-y-2">
            <Link
              to="/admin"
              className="px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin Login
            </Link>
            <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
