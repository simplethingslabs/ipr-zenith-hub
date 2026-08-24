import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Container } from '@/components/layout/Container';
import { Seo } from '@/components/Seo';
import { WhatsAppCta } from '@/components/WhatsAppCta';
import { services } from '@/content/services';

export default function Services() {
  return (
    <PublicLayout>
      <Seo
        path="/services"
        title="Services"
        description="IP search and analysis, registration and filing, protection and enforcement, and strategic advisory — end-to-end intellectual property services."
      />

      {/* Hero */}
      <section className="bg-muted/30 py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">Our Services</h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive intellectual property services tailored to protect and grow your
              innovations, brands and creative works.
            </p>
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {services.map((service) => (
              <Card key={service.title} className="border-border">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <service.icon className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="font-serif text-2xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm">
                        <span
                          className="mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <Container>
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div>
              <h2 className="mb-2 text-3xl font-bold">Need a Custom Solution?</h2>
              <p className="text-primary-foreground/80">
                Every business is unique. Let's discuss your specific IP needs.
              </p>
            </div>
            <WhatsAppCta
              size="lg"
              className="flex-shrink-0"
              message="Hello IPR Central, I'd like to discuss a custom IP services engagement."
            >
              Get in Touch
            </WhatsAppCta>
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
