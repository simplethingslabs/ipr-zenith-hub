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
import type { Audience } from '@/types';

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatPrice(min: number, max?: number): string {
  if (max && max !== min) return `${inr.format(min)} – ${inr.format(max)}`;
  return inr.format(min);
}

export default function Fees() {
  const [audience, setAudience] = useState<Audience>('Individuals');
  const fees = useFees();
  const sections = groupFeesByCategory(fees, audience);

  return (
    <PublicLayout>
      <Seo
        path="/fees"
        title="Fees"
        description="Transparent professional fees for trademark, patent, copyright and design work. Fixed prices where we can, quoted ranges where scope varies — no hidden costs."
      />

      {/* Hero */}
      <section className="bg-muted/30 py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">Our Fees</h1>
            <p className="text-lg text-muted-foreground">
              Transparent, competitive pricing for all our IP services. Fixed prices where the
              work is predictable, quoted ranges where it genuinely depends on scope — and a
              firm quote before anything starts.
            </p>
          </div>
        </Container>
      </section>

      {/* Fee tables */}
      <section className="py-16 md:py-24">
        <Container>
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
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <h3 className="text-lg font-semibold">{fee.name}</h3>
                            <span className="flex-shrink-0 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                              {fee.type === 'fixed' ? 'Fixed' : 'From'}
                            </span>
                          </div>
                          <p className="mb-2 text-2xl font-bold text-accent">
                            {formatPrice(fee.priceMin, fee.priceMax)}
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
              details and we'll come back with a fixed quote.
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
