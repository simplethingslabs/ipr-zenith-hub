import { PublicLayout } from '@/components/layout/PublicLayout';
import { Container } from '@/components/layout/Container';
import { Card, CardContent } from '@/components/ui/card';
import { Seo } from '@/components/Seo';
import { WhatsAppCta } from '@/components/WhatsAppCta';
import { useSiteSettings } from '@/lib/content';
import { mission, pullQuote, values, milestones } from '@/content/about';

export default function About() {
  const settings = useSiteSettings();

  return (
    <PublicLayout>
      <Seo
        path="/about"
        title="About Us"
        description="IPR Central is an intellectual property consultancy working with founders, creators and established businesses across trademarks, patents, copyrights and designs."
      />

      {/* Hero */}
      <section className="bg-muted/30 py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">About Us</h1>
            <p className="text-lg text-muted-foreground">{settings.bio}</p>
          </div>
        </Container>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold">Our Mission</h2>
              {mission.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mb-4 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="rounded-lg bg-primary p-8 text-primary-foreground">
              <blockquote className="mb-4 font-serif text-xl italic">
                “{pullQuote.quote}”
              </blockquote>
              <p className="text-primary-foreground/80">{pullQuote.attribution}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="bg-muted/30 py-16 md:py-24">
        <Container>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Our Values</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              The principles that guide everything we do.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title} className="border-border text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <value.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mb-2 font-serif text-lg font-semibold">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Our Journey</h2>
            <p className="text-muted-foreground">Key milestones in our growth story.</p>
          </div>
          <div className="relative">
            <div
              className="absolute bottom-0 left-4 top-0 w-px bg-border md:left-1/2 md:-translate-x-px"
              aria-hidden="true"
            />
            <ol className="space-y-8">
              {milestones.map((milestone, index) => (
                <li
                  key={milestone.year}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div
                    className={`w-full pl-12 md:w-1/2 md:pl-0 ${
                      index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                    }`}
                  >
                    <span className="font-bold text-accent">{milestone.year}</span>
                    <p className="text-muted-foreground">{milestone.event}</p>
                  </div>
                  <div
                    className="absolute left-4 h-3 w-3 rounded-full bg-accent md:left-1/2 md:-translate-x-1/2"
                    aria-hidden="true"
                  />
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to Work With Us?</h2>
            <p className="mb-8 text-primary-foreground/80">
              Let's discuss how we can help protect your intellectual property.
            </p>
            <WhatsAppCta size="lg">Get in Touch</WhatsAppCta>
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
