import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Container } from '@/components/layout/Container';
import { Seo } from '@/components/Seo';
import { organizationJsonLd } from '@/lib/structured-data';
import { WhatsAppCta } from '@/components/WhatsAppCta';
import { usePublishedPosts } from '@/lib/content';
import { hero, valueProps } from '@/content/home';

export default function Home() {
  const posts = usePublishedPosts();
  const featured = posts.slice(0, 3);

  return (
    <PublicLayout>
      <Seo path="/" jsonLd={organizationJsonLd()} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/90 py-20 text-primary-foreground md:py-32">
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent blur-3xl" />
        </div>
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              {hero.headline}
              <br />
              <span className="text-accent">{hero.headlineAccent}</span>
            </h1>
            <p className="mb-8 max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
              {hero.subhead}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <WhatsAppCta
                size="lg"
                message="Hello IPR Central, I'd like to request a consultation about protecting my IP."
              >
                Request a Consultation
              </WhatsAppCta>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/50 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/fees">View Our Fees</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Value propositions */}
      <section className="bg-background py-16 md:py-24">
        <Container>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Why Choose IPR Central?</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              We combine deep expertise with a client-first approach to deliver exceptional IP solutions.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((prop) => (
              <Card key={prop.title} className="border-border bg-card transition-shadow hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <prop.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mb-2 font-serif text-lg font-semibold">{prop.title}</h3>
                  <p className="text-sm text-muted-foreground">{prop.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Latest insights */}
      {featured.length > 0 && (
        <section className="bg-muted/30 py-16 md:py-24">
          <Container>
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">Latest Insights</h2>
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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {featured.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden border-border bg-card transition-shadow hover:shadow-lg"
                >
                  {post.coverImage && (
                    <Link to={`/blog/${post.slug}`}>
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.coverImage}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    </Link>
                  )}
                  <CardContent className="pt-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                        {post.category}
                      </span>
                      {post.publishedAt && (
                        <time
                          dateTime={post.publishedAt}
                          className="text-xs text-muted-foreground"
                        >
                          {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                      )}
                    </div>
                    <h3 className="mb-2 line-clamp-2 font-serif text-lg font-semibold">
                      <Link to={`/blog/${post.slug}`} className="transition-colors hover:text-accent">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
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
      )}

      {/* Closing CTA */}
      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Protect Your IP?</h2>
            <p className="mb-8 text-primary-foreground/80">
              Send us a message and we'll help you build a strategy for protecting your
              intellectual property.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <WhatsAppCta size="lg">Message Us on WhatsApp</WhatsAppCta>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/50 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/contact">All Contact Options</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
