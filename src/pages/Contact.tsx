/**
 * Contact page.
 *
 * The previous version rendered a five-field form that POSTed to `/api/contact`.
 * That made the site's main conversion path depend on the API and database being
 * up — and when they were not, the submission failed with a generic toast and the
 * enquiry was lost with no record and no way to follow up.
 *
 * This version routes enquiries through channels that cannot fail: WhatsApp,
 * email and phone. No backend, no validation state, no silent data loss.
 */

import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Container } from '@/components/layout/Container';
import { Seo } from '@/components/Seo';
import { WhatsAppCta, WhatsAppIcon } from '@/components/WhatsAppCta';
import { useSiteSettings } from '@/lib/content';
import { officeHours, whatsappUrl } from '@/content/site';

/**
 * Each entry becomes a one-tap WhatsApp link with the enquiry type prefilled, so
 * conversations arrive already labelled instead of starting from "hi".
 */
const enquiryTypes = [
  {
    label: 'Trademark enquiry',
    message:
      "Hello IPR Central, I'd like to discuss registering or protecting a trademark.",
  },
  {
    label: 'Patent enquiry',
    message: "Hello IPR Central, I'd like to discuss a patent application.",
  },
  {
    label: 'Copyright or design',
    message:
      "Hello IPR Central, I'd like to discuss copyright or industrial design protection.",
  },
  {
    label: 'Someone is infringing my IP',
    message:
      'Hello IPR Central, I believe someone is infringing my intellectual property and need advice on enforcement.',
  },
  {
    label: 'Business / portfolio review',
    message:
      "Hello IPR Central, I'd like to discuss an IP audit or portfolio review for my business.",
  },
  {
    label: 'Something else',
    message: 'Hello IPR Central, I have a question about intellectual property.',
  },
];

export default function Contact() {
  const settings = useSiteSettings();

  return (
    <PublicLayout>
      <Seo
        path="/contact"
        title="Contact"
        description="Talk to IPR Central about trademarks, patents, copyrights and designs. Message us on WhatsApp, email or call — we typically reply the same working day."
      />

      {/* Hero */}
      <section className="bg-muted/30 py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">Contact Us</h1>
            <p className="text-lg text-muted-foreground">
              Have a question about protecting your intellectual property? The fastest way to
              reach us is WhatsApp — pick the topic closest to your question and we'll take it
              from there.
            </p>
          </div>
        </Container>
      </section>

      {/* Primary CTA */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* WhatsApp routing */}
            <div className="lg:col-span-2">
              <div className="mb-8 rounded-lg border border-accent/30 bg-accent/5 p-6 sm:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-accent/15">
                    <WhatsAppIcon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-semibold">Message us on WhatsApp</h2>
                    <p className="text-sm text-muted-foreground">
                      Usually answered the same working day.
                    </p>
                  </div>
                </div>
                <WhatsAppCta size="lg" className="w-full sm:w-auto">
                  Start a Conversation
                </WhatsAppCta>
              </div>

              <h3 className="mb-4 font-serif text-lg font-semibold">
                Or start with your topic
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {enquiryTypes.map((enquiry) => (
                  <a
                    key={enquiry.label}
                    href={whatsappUrl(enquiry.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 text-sm font-medium transition-colors hover:border-accent hover:bg-accent/5"
                  >
                    <span>{enquiry.label}</span>
                    <MessageSquare className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
                  </a>
                ))}
              </div>

              {/* Fallback channels */}
              <div className="mt-10 border-t border-border pt-8">
                <h3 className="mb-4 font-serif text-lg font-semibold">Prefer email or phone?</h3>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild variant="outline" size="lg">
                    <a href={`mailto:${settings.email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      {settings.email}
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>
                      <Phone className="mr-2 h-4 w-4" />
                      {settings.phone}
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-border">
                <CardContent className="space-y-5 pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold">Office</h3>
                      <address className="text-sm not-italic text-muted-foreground">
                        {settings.address.line}
                        <br />
                        {settings.address.city}, {settings.address.state}{' '}
                        {settings.address.postalCode}
                      </address>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                      <Clock className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold">Office Hours</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {officeHours.map((slot) => (
                          <li key={slot.days}>
                            <span className="text-foreground/70">{slot.days}:</span> {slot.hours}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-lg bg-muted/50 p-6">
                <h3 className="mb-2 font-semibold">Before you write</h3>
                <p className="text-sm text-muted-foreground">
                  Telling us the mark, invention or work involved — and what you want to achieve
                  — lets us give you a useful answer in the first reply rather than the third.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
