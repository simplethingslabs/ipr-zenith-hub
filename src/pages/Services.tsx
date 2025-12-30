import { Link } from 'react-router-dom';
import { ArrowRight, Search, FileCheck, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Container } from '@/components/layout/Container';

const services = [
  {
    icon: Search,
    title: 'IP Search & Analysis',
    description: 'Comprehensive searches to identify existing registrations and potential conflicts before you invest in registration.',
    features: ['Trademark availability search', 'Patent prior art search', 'Freedom-to-operate analysis', 'Competitive landscape review'],
  },
  {
    icon: FileCheck,
    title: 'Registration & Filing',
    description: 'End-to-end management of your IP registration process, from application drafting to certificate procurement.',
    features: ['Trademark registration', 'Patent applications', 'Copyright registration', 'Design registration'],
  },
  {
    icon: Shield,
    title: 'Protection & Enforcement',
    description: 'Vigilant protection of your IP rights through monitoring, enforcement actions, and dispute resolution.',
    features: ['Infringement monitoring', 'Cease & desist letters', 'Opposition proceedings', 'Litigation support'],
  },
  {
    icon: Users,
    title: 'Strategic Advisory',
    description: 'Strategic guidance to maximize the value of your IP portfolio and align it with your business goals.',
    features: ['Portfolio audits', 'IP valuation', 'Due diligence', 'Licensing strategy'],
  },
];

export default function Services() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive intellectual property services tailored to protect and grow your innovations, brands, and creative works.
            </p>
          </div>
        </Container>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="border-border">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="font-serif text-2xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent mr-2" />
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
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Need a Custom Solution?</h2>
              <p className="text-primary-foreground/80">
                Every business is unique. Let's discuss your specific IP needs.
              </p>
            </div>
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact">
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
