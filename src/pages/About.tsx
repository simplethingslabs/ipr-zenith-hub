import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Users, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Container } from '@/components/layout/Container';
import { mockSettings } from '@/lib/mockData';
import { settingsApi } from '@/lib/api';
import { Settings } from '@/types';

const values = [
  {
    icon: Target,
    title: 'Client-Focused',
    description: 'Your goals drive our strategy. We tailor our approach to your specific needs and business objectives.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We maintain the highest standards in everything we do, from legal analysis to client communication.',
  },
  {
    icon: Users,
    title: 'Accessibility',
    description: 'Expert IP services shouldn\'t be exclusive. We make professional IP protection accessible to all.',
  },
  {
    icon: Clock,
    title: 'Responsiveness',
    description: 'Time matters in IP. We respond promptly and keep you informed at every stage of your matter.',
  },
];

const milestones = [
  { year: '2018', event: 'IPR Central founded with a mission to democratize IP services' },
  { year: '2019', event: 'Expanded practice to include patent services' },
  { year: '2020', event: 'Launched digital-first client service platform' },
  { year: '2021', event: 'Reached 500+ successful registrations milestone' },
  { year: '2022', event: 'Introduced specialized startup IP packages' },
  { year: '2023', event: 'Expanded team and opened advisory services' },
  { year: '2024', event: 'Celebrating 1000+ clients served' },
];

export default function About() {
  const [settings, setSettings] = useState<Settings>(mockSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsApi.get();
        setSettings(data);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
            <p className="text-lg text-muted-foreground">
              {settings.bio}
            </p>
          </div>
        </Container>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                At IPR Central, we believe that every innovator, creator, and business deserves access to quality intellectual property protection. Our mission is to demystify IP law and make professional IP services accessible, affordable, and effective.
              </p>
              <p className="text-muted-foreground mb-4">
                We combine deep legal expertise with a modern, client-centric approach. Whether you're an individual inventor protecting your first patent or a multinational corporation managing a global trademark portfolio, we provide the same level of dedication and expertise.
              </p>
              <p className="text-muted-foreground">
                Our team stays at the forefront of IP developments, from emerging technologies to evolving regulations, ensuring you receive advice that's both legally sound and practically relevant.
              </p>
            </div>
            <div className="bg-primary text-primary-foreground rounded-lg p-8">
              <blockquote className="text-xl font-serif italic mb-4">
                "Innovation deserves protection. We're here to ensure your ideas have the legal foundation to thrive."
              </blockquote>
              <p className="text-primary-foreground/80">— The IPR Central Team</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="border-border text-center">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-serif font-semibold text-lg mb-2">{value.title}</h3>
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-muted-foreground">
              Key milestones in our growth story.
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <span className="text-accent font-bold">{milestone.year}</span>
                    <p className="text-muted-foreground">{milestone.event}</p>
                  </div>
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-accent md:-translate-x-1/2" />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Work With Us?</h2>
            <p className="text-primary-foreground/80 mb-8">
              Let's discuss how we can help protect your intellectual property.
            </p>
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
