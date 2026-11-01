import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Container } from '@/components/layout/Container';
import { Seo } from '@/components/Seo';
import { WhatsAppCta } from '@/components/WhatsAppCta';
import { useFees, groupFeesByCategory } from '@/lib/content';
import { feeNotes } from '@/content/fees';
import { whatsappUrl } from '@/content/site';
import type { Audience } from '@/types';

export default function Fees() {
  const [audience, setAudience] = useState<Audience>('Individuals');
  const fees = useFees();
  const sections = groupFeesByCategory(fees, audience);

  return (
    <PublicLayout>
      <Seo
        path="/fees"
        title="Fees"
        description="Professional fees for trademark, patent, copyright and design work. Contact us on WhatsApp for a clear quote before any work begins."
      />

      {/* Hero */}
      <section className="bg-muted/30 py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">Our Fees</h1>
            <p className="text-lg text-muted-foreground">
              Every matter is different, so we quote each one individually. Message us on
              WhatsApp with the details and we'll come back with the consultation fees for
              your service.
            </p>
          </div>
        </Container>
      </section>

      {/* Fee tables */}
      <section className="py-16 md:py-24">
        <Container>
          <p className="mb-8 rounded-lg border border-accent/30 bg-accent/10 p-4 text-base font-medium">
            Professional trademark filing fees start at ₹1,599, excluding government fees and
            other statutory charges.
          </p>

          {/*
            Tabs are used purely as a segmented control here — both audiences come
            from the same in-memory list, so there is no per-tab fetch and no
            reason to mount separate TabsContent panels.
          */}
          <Tabs value={audience} onValueChange={(v) => setAudience(v as Audience)}>
            <TabsList className="mb-8">
              <TabsTrigger value="Individuals">Individuals</TabsTrigger>
              <TabsTrigger value="Businesses">Businesses</TabsTrigger>
            </TabsList>
          </Tabs>

          {sections.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No published fees for {audience.toLowerCase()} yet.
              </p>
              <WhatsAppCta
                className="mt-4"
                message={`Hello IPR Central, I'd like a quote for IP services (${audience.toLowerCase()}).`}
              >
                Ask for a Quote
              </WhatsAppCta>
            </div>
          ) : (
            <div className="space-y-12">
              {sections.map((section) => (
                <div key={section.category}>
                  <h2 className="mb-6 text-2xl font-bold">{section.category}</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {section.items.map((fee) => (
                      <Card key={fee.id} className="flex flex-col border-border">
                        <CardContent className="flex flex-1 flex-col pt-6">
                          <h3 className="mb-2 text-lg font-semibold">{fee.name}</h3>
                          <p className="mb-2 text-lg font-bold text-accent">
                            <a
                              href={whatsappUrl(
                                `Hello IPR Central, I'd like to know the consultation fees for ${fee.name} (${fee.audience.toLowerCase()}).`,
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline-offset-4 hover:underline"
                            >
                              Contact for Consultation Fees
                            </a>
                          </p>
                          {fee.notes && (
                            <p className="text-sm text-muted-foreground">{fee.notes}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 rounded-lg bg-muted/50 p-6">
            <h2 className="mb-3 font-serif text-lg font-semibold">Note on Pricing</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {feeNotes.map((note) => (
                <li key={note} className="flex gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Need a Custom Quote?</h2>
            <p className="mb-8 text-primary-foreground/80">
              For portfolios, multi-jurisdiction filings or high-volume work, send us the
              details and we'll come back with a quote.
            </p>
            <WhatsAppCta
              size="lg"
              message="Hello IPR Central, I'd like a custom quote for IP work."
            >
              Request a Quote
            </WhatsAppCta>
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
