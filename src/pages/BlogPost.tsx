import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { marked } from 'marked';
import { Button } from '@/components/ui/button';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Container } from '@/components/layout/Container';
import { mockPosts } from '@/lib/mockData';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = mockPosts.find((p) => p.slug === slug && p.status === 'published');

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const htmlContent = marked(post.content);

  return (
    <PublicLayout>
      {/* Hero with cover image */}
      {post.coverImage && (
        <section className="relative h-64 md:h-96 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </section>
      )}

      {/* Article */}
      <article className="py-12 md:py-16">
        <Container size="narrow">
          {/* Back link */}
          <Button asChild variant="ghost" size="sm" className="mb-6">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-accent/10 text-accent">
              {post.category}
            </span>
            <span className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              {new Date(post.publishedAt!).toLocaleDateString('en-IN', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-muted-foreground mb-8 pb-8 border-b border-border">
            {post.excerpt}
          </p>

          {/* Content */}
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm px-3 py-1 rounded-full bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 p-6 bg-muted/50 rounded-lg text-center">
            <h3 className="font-serif font-semibold text-lg mb-2">Need IP Advice?</h3>
            <p className="text-muted-foreground mb-4">
              Our experts are ready to help you with your intellectual property needs.
            </p>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </Container>
      </article>
    </PublicLayout>
  );
}
