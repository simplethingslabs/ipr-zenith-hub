import { Link } from 'react-router-dom';
import { ArrowRight, Shield, FileText, Scale, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Container } from '@/components/layout/Container';
import { mockPosts, mockSettings } from '@/lib/mockData';

const valueProps = [
  {
    icon: Shield,
    title: 'Comprehensive Protection',
    description: 'Full-spectrum IP protection covering trademarks, patents, copyrights, and designs.',
  },
  {
    icon: FileText,
    title: 'Expert Guidance',
    description: 'Navigate complex IP regulations with experienced professionals by your side.',
  },
  {
    icon: Scale,
    title: 'Strategic Enforcement',
    description: 'Protect your rights with effective enforcement and dispute resolution strategies.',
  },
  {
    icon: Award,
    title: 'Transparent Pricing',
    description: 'Clear, upfront fees with no hidden costs. Know exactly what you\'re paying for.',
  },
];

export default function Home() {
  const settings = mockSettings;
  const featuredPosts = mockPosts.filter((p) => p.status === 'published').slice(0, 3);

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Protect Your Ideas.<br />
              <span className="text-accent">Secure Your Future.</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl">
              {settings.bio.substring(0, 200)}...
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/contact">
                  Request Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/fees">View Our Fees</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Value Propositions */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose IPR Central?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine deep expertise with a client-first approach to deliver exceptional IP solutions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((prop) => (
              <Card key={prop.title} className="border-border bg-card hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <prop.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-serif font-semibold text-lg mb-2">{prop.title}</h3>
                  <p className="text-sm text-muted-foreground">{prop.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Blog Posts */}
      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Insights</h2>
              <p className="text-muted-foreground">
                Expert commentary and analysis on intellectual property developments.
              </p>
            </div>
            <Button asChild variant="ghost" className="hidden sm:flex">
              <Link to="/blog">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden border-border bg-card hover:shadow-lg transition-shadow">
                {post.coverImage && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent/10 text-accent">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.publishedAt!).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h3 className="font-serif font-semibold text-lg mb-2 line-clamp-2">
                    <Link to={`/blog/${post.slug}`} className="hover:text-accent transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button asChild variant="outline">
              <Link to="/blog">
                View All Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Protect Your IP?</h2>
            <p className="text-primary-foreground/80 mb-8">
              Get in touch with our experts today for a consultation. We'll help you develop a comprehensive strategy to protect your intellectual property.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/contact">Contact Us Today</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/fees">View Pricing</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
