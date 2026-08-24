import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Container } from '@/components/layout/Container';
import { Seo } from '@/components/Seo';
import { WhatsAppCta } from '@/components/WhatsAppCta';
import { usePostBySlug, useIsUnknownPost } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';
import { SITE_URL, site } from '@/content/site';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = usePostBySlug(slug);
  const isMissing = useIsUnknownPost(slug, post);

  // Markdown parsing plus sanitisation is not free; only redo it when the body
  // actually changes.
  const html = useMemo(() => (post ? renderMarkdown(post.content) : ''), [post]);

  /*
   * A slug that resolves to nothing renders an in-place "not found" state rather
   * than redirecting to /blog. The old version issued <Navigate to="/blog"> the
   * moment a fetch failed, which silently swallowed the URL — bad for a shared
   * or bookmarked link, and it made a transient API error look like a deleted
   * post.
   */
  if (isMissing) {
    return (
      <PublicLayout>
        <Seo path={`/blog/${slug ?? ''}`} title="Article not found" />
        <Container size="narrow">
          <div className="py-24 text-center">
            <h1 className="mb-4 text-3xl font-bold">Article not found</h1>
            <p className="mb-8 text-muted-foreground">
              We couldn't find an article at this address. It may have been moved or unpublished.
            </p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse all articles
              </Link>
            </Button>
          </div>
        </Container>
      </PublicLayout>
    );
  }

  // Live-content lookup still in flight for a slug not in the bundle.
  if (!post) {
    return (
      <PublicLayout>
        <Container size="narrow">
          <div className="py-24 text-center text-muted-foreground">Loading article…</div>
        </Container>
      </PublicLayout>
    );
  }

  const published = post.publishedAt ?? post.createdAt;

  return (
    <PublicLayout>
      <Seo
        path={`/blog/${post.slug}`}
        title={post.title}
        description={post.excerpt}
        type="article"
        image={post.coverImage}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          datePublished: published,
          dateModified: post.updatedAt,
          keywords: post.tags.join(', '),
          articleSection: post.category,
          mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
          author: { '@type': 'Organization', name: site.firmName },
          publisher: { '@type': 'Organization', name: site.firmName },
          ...(post.coverImage ? { image: post.coverImage } : {}),
        }}
      />

      {post.coverImage && (
        <section className="relative h-64 overflow-hidden md:h-96">
          <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
          <div
            className="absolute inset-0 bg-gradient-to-t from-background to-transparent"
            aria-hidden="true"
          />
        </section>
      )}

      <article className="py-12 md:py-16">
        <Container size="narrow">
          <Button asChild variant="ghost" size="sm" className="mb-6">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          <div className="mb-6 flex flex-wrap items-center gap-4">
            <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
              {post.category}
            </span>
            <time
              dateTime={published}
              className="flex items-center text-sm text-muted-foreground"
            >
              <Calendar className="mr-1 h-4 w-4" aria-hidden="true" />
              {new Date(published).toLocaleDateString('en-IN', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>

          <h1 className="mb-6 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <p className="mb-8 border-b border-border pb-8 text-lg text-muted-foreground">
            {post.excerpt}
          </p>

          {/* Sanitised in renderMarkdown() — see src/lib/markdown.ts */}
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

          {post.tags.length > 0 && (
            <div className="mt-12 border-t border-border pt-8">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 rounded-lg bg-muted/50 p-6 text-center">
            <h2 className="mb-2 font-serif text-lg font-semibold">Need IP Advice?</h2>
            <p className="mb-4 text-muted-foreground">
              This article is general information. For advice on your own situation, send us a
              message.
            </p>
            <WhatsAppCta
              message={`Hello IPR Central, I read your article "${post.title}" and have a question.`}
            >
              Ask a Question
            </WhatsAppCta>
          </div>
        </Container>
      </article>
    </PublicLayout>
  );
}
