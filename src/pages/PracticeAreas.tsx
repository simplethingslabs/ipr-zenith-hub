import { PublicLayout } from '@/components/layout/PublicLayout';
import { Container } from '@/components/layout/Container';
import { Seo } from '@/components/Seo';
import { WhatsAppCta } from '@/components/WhatsAppCta';
import { practiceAreas } from '@/content/practice-areas';

export default function PracticeAreas() {
  return (
    <PublicLayout>
      <Seo
        path="/practice-areas"
        title="Practice Areas"
        description="Trademarks, patents, copyrights, industrial designs, and IP enforcement and disputes — deep expertise across every area of intellectual property law."
      />

      {/* Hero */}
      <section className="bg-muted/30 py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">Practice Areas</h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Deep expertise across all areas of intellectual property law, from registration to
              enforcement.
            </p>
            {/* Jump links — the page is long, and the footer deep-links into it anyway. */}
            <nav aria-label="Jump to practice area" className="flex flex-wrap gap-2">
              {practiceAreas.map((area) => (
                <a
                  key={area.id}
                  href={`#${area.id}`}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
                >
                  {area.title}
                </a>
              ))}
            </nav>
          </div>
        </Container>
      </section>

      {/* Areas */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="space-y-16">
            {practiceAreas.map((area, index) => (
              <div key={area.id} id={area.id} className="scroll-mt-24">
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
                  <div>
                    <h2 className="mb-4 text-3xl font-bold">{area.title}</h2>
                    <p className="mb-6 text-lg text-muted-foreground">{area.description}</p>
                    <div className="text-muted-foreground">
                      {area.body.map((paragraph) => (
                        <p key={paragraph.slice(0, 40)} className="mb-4 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-6">
                    <h3 className="mb-4 font-serif text-lg font-semibold">
                      Our {area.title} Services
                    </h3>
                    <ul className="space-y-3">
                      {area.services.map((service) => (
                        <li key={service} className="flex items-start">
                          <span
                            className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-accent"
                            aria-hidden="true"
                          />
                          {service}
                        </li>
                      ))}
                    </ul>
                    <WhatsAppCta
                      className="mt-6"
                      message={`Hello IPR Central, I'd like to discuss ${area.title.toLowerCase()}.`}
                    >
                      Discuss Your Needs
                    </WhatsAppCta>
                  </div>
                </div>
                {index < practiceAreas.length - 1 && (
                  <div className="mt-16 border-b border-border" />
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
