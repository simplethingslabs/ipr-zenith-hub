/**
 * Shared renderer for /privacy and /terms.
 *
 * Both pages are the same shape — a title, an intro, a "last updated" stamp and
 * a list of headed sections — so they share one component rather than two
 * near-identical files.
 */

import { PublicLayout } from '@/components/layout/PublicLayout';
import { Container } from '@/components/layout/Container';
import { Seo } from '@/components/Seo';
import { useSiteSettings } from '@/lib/content';
import {
  LEGAL_LAST_UPDATED,
  privacySections,
  termsSections,
  type LegalSection,
} from '@/content/legal';

interface LegalPageProps {
  title: string;
  description: string;
  path: string;
  intro: string;
  sections: LegalSection[];
}

function LegalPage({ title, description, path, intro, sections }: LegalPageProps) {
  const settings = useSiteSettings();

  return (
    <PublicLayout>
      <Seo path={path} title={title} description={description} />

      <section className="bg-muted/30 py-16 md:py-20">
        <Container size="narrow">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">{title}</h1>
          <p className="mb-4 text-lg text-muted-foreground">{intro}</p>
          <p className="text-sm text-muted-foreground">
            Last updated: <time dateTime="2026-08-24">{LEGAL_LAST_UPDATED}</time>
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container size="narrow">
          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="mb-3 font-serif text-2xl font-semibold">{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="mb-4 leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="space-y-2 text-muted-foreground">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span
                          className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"
                          aria-hidden="true"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-lg bg-muted/50 p-6">
            <h2 className="mb-2 font-serif text-lg font-semibold">Questions about this page?</h2>
            <p className="text-sm text-muted-foreground">
              Write to us at{' '}
              <a
                href={`mailto:${settings.email}`}
                className="text-accent underline-offset-4 hover:underline"
              >
                {settings.email}
              </a>
              .
            </p>
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}

export function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy"
      description="How IPR Central handles information on this website. It is a static site with no forms, analytics or tracking cookies."
      intro="How we handle information on this website, and what happens when you get in touch."
      sections={privacySections}
    />
  );
}

export function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      path="/terms"
      description="Terms governing use of the IPR Central website, including the no-legal-advice notice and how fee information should be read."
      intro="The terms that govern your use of this website, including what the content on it is and is not."
      sections={termsSections}
    />
  );
}
