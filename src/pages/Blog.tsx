import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Container } from '@/components/layout/Container';
import { Seo } from '@/components/Seo';
import { usePublishedPosts } from '@/lib/content';
import type { PostCategory } from '@/types';

const categories: (PostCategory | 'All')[] = ['All', 'Judgment', 'Commentary'];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'All'>('All');
  const posts = usePublishedPosts();

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesSearch =
        q === '' ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((tag) => tag.toLowerCase().includes(q));
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const isFiltered = searchQuery !== '' || selectedCategory !== 'All';

  return (
    <PublicLayout>
      <Seo
        path="/blog"
        title="Blog & Insights"
        description="Practical commentary and case analysis on intellectual property — trademarks, patents, copyright and enforcement in India."
      />

      {/* Hero */}
      <section className="bg-muted/30 py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">Blog &amp; Insights</h1>
            <p className="text-lg text-muted-foreground">
              Practical guidance and case commentary on intellectual property matters — written
              for the people making the decisions, not for other lawyers.
            </p>
          </div>
        </Container>
      </section>

      {/* Filters */}
      <section className="border-b border-border py-8">
        <Container>
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <div className="relative max-w-md flex-1">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Search articles..."
                aria-label="Search articles"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2" role="group" aria-label="Filter by category">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  aria-pressed={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Posts */}
      <section className="py-16 md:py-24">
        <Container>
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                {isFiltered
                  ? 'No articles match your criteria.'
                  : 'No articles published yet — check back soon.'}
              </p>
              {isFiltered && (
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post) => (
                <Card
                  key={post.id}
                  className="flex flex-col overflow-hidden border-border transition-shadow hover:shadow-lg"
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
                  <CardContent className="flex flex-1 flex-col pt-4">
                    <div className="mb-3 flex items-center gap-2">
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
                    <h2 className="mb-2 line-clamp-2 font-serif text-xl font-semibold">
                      <Link to={`/blog/${post.slug}`} className="transition-colors hover:text-accent">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mb-4 line-clamp-3 flex-1 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs text-muted-foreground">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </section>
    </PublicLayout>
  );
}
