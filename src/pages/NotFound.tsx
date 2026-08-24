import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Container } from '@/components/layout/Container';
import { Seo } from '@/components/Seo';

const suggestions = [
  { to: '/services', label: 'Services' },
  { to: '/practice-areas', label: 'Practice Areas' },
  { to: '/fees', label: 'Fees' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

/**
 * Wrapped in PublicLayout so a visitor who lands on a bad URL still gets the
 * header, navigation and footer instead of a bare dead end. The previous version
 * also logged every 404 to console.error, which did nothing useful in production.
 */
export default function NotFound() {
  const { pathname } = useLocation();

  return (
    <PublicLayout>
      <Seo path={pathname} title="Page not found" />
      <Container size="narrow">
        <div className="py-24 text-center md:py-32">
          <p className="mb-2 font-serif text-6xl font-bold text-accent">404</p>
          <h1 className="mb-4 text-3xl font-bold">Page not found</h1>
          <p className="mb-8 text-muted-foreground">
            We couldn't find anything at <code className="text-foreground">{pathname}</code>. It
            may have been moved, or the link may be out of date.
          </p>

          <Button asChild className="mb-10">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="border-t border-border pt-8">
            <p className="mb-4 text-sm text-muted-foreground">Or try one of these:</p>
            <nav className="flex flex-wrap justify-center gap-2" aria-label="Suggested pages">
              {suggestions.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </Container>
    </PublicLayout>
  );
}
