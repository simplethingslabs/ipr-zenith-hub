import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Container } from '@/components/layout/Container';

const practiceAreas = [
  {
    id: 'trademarks',
    title: 'Trademarks',
    description: 'Protect your brand identity with comprehensive trademark services.',
    content: `Trademarks are vital assets that distinguish your goods and services from competitors. Our trademark services cover the entire lifecycle of your brand protection needs.

We assist with trademark searches to ensure your proposed mark is available, guide you through the registration process across multiple classes, and help maintain your registrations through renewals and updates.

Our team handles opposition proceedings, helps respond to examination objections, and provides strategic advice on building a strong trademark portfolio.`,
    services: [
      'Comprehensive trademark searches',
      'Multi-class registration',
      'Opposition and cancellation proceedings',
      'Trademark portfolio management',
      'Brand protection strategy',
    ],
  },
  {
    id: 'patents',
    title: 'Patents',
    description: 'Secure exclusive rights to your inventions and innovations.',
    content: `Patents provide powerful protection for your technical innovations, granting exclusive rights to make, use, and sell your invention for up to 20 years.

We work with inventors and businesses across all technology sectors, from mechanical devices to software and biotechnology. Our patent services include patentability assessments, application drafting, prosecution, and maintenance.

We also provide strategic advice on patent portfolio development, licensing opportunities, and freedom-to-operate analyses.`,
    services: [
      'Patentability assessments',
      'Provisional and complete applications',
      'Patent prosecution',
      'Freedom-to-operate analysis',
      'Patent licensing and monetization',
    ],
  },
  {
    id: 'copyrights',
    title: 'Copyrights',
    description: 'Protect your creative works and artistic expressions.',
    content: `Copyright protects original works of authorship, including literary, dramatic, musical, and artistic works, as well as software and databases.

We help creators and businesses register their copyrights, providing documentation that strengthens your legal position. Our services extend to copyright licensing, assignment agreements, and enforcement actions against infringement.

We also advise on fair use, permissions, and the complex issues arising from digital content and AI-generated works.`,
    services: [
      'Copyright registration',
      'Licensing agreements',
      'Assignment and transfer',
      'Infringement analysis',
      'Digital rights management',
    ],
  },
  {
    id: 'designs',
    title: 'Industrial Designs',
    description: 'Protect the unique visual appearance of your products.',
    content: `Industrial design registration protects the ornamental or aesthetic aspects of a product—its shape, configuration, pattern, or ornamentation.

Design protection is crucial for products where visual appeal drives consumer choice. We help you identify registrable design elements, prepare quality representations, and navigate the registration process.

Our team also advises on design portfolio strategy, renewal management, and enforcement against design infringement.`,
    services: [
      'Design registrability assessment',
      'Design application filing',
      'Portfolio management',
      'Design enforcement',
      'International design protection',
    ],
  },
  {
    id: 'enforcement',
    title: 'Enforcement & Disputes',
    description: 'Protect and defend your IP rights against infringement.',
    content: `When your intellectual property rights are threatened, swift and effective action is essential. Our enforcement services help you protect your valuable IP assets through strategic legal action.

We handle cease and desist notices, opposition proceedings, cancellation actions, and provide litigation support for court proceedings. Our approach balances aggressive protection with practical business considerations.

We also help defend against claims of infringement and provide strategic advice on risk mitigation.`,
    services: [
      'Cease and desist notices',
      'Opposition and cancellation proceedings',
      'Litigation support',
      'Settlement negotiations',
      'Anti-counterfeiting measures',
    ],
  },
];

export default function PracticeAreas() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Practice Areas</h1>
            <p className="text-lg text-muted-foreground">
              Deep expertise across all areas of intellectual property law, from registration to enforcement.
            </p>
          </div>
        </Container>
      </section>

      {/* Practice Areas */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="space-y-16">
            {practiceAreas.map((area, index) => (
              <div key={area.id} id={area.id} className="scroll-mt-24">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-start ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div>
                    <h2 className="text-3xl font-bold mb-4">{area.title}</h2>
                    <p className="text-lg text-muted-foreground mb-6">{area.description}</p>
                    <div className="prose text-muted-foreground">
                      {area.content.split('\n\n').map((paragraph, i) => (
                        <p key={i} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-6">
                    <h3 className="font-serif font-semibold text-lg mb-4">Our {area.title} Services</h3>
                    <ul className="space-y-3">
                      {area.services.map((service) => (
                        <li key={service} className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-accent mr-3" />
                          {service}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
                      <Link to="/contact">
                        Discuss Your Needs
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                {index < practiceAreas.length - 1 && (
                  <div className="border-b border-border mt-16" />
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
