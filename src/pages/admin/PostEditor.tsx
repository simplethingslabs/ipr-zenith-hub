import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { marked } from 'marked';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Container } from '@/components/layout/Container';
import { mockPosts } from '@/lib/mockData';
import { Post, PostStatus, PostCategory } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface PostFormData {
  title: string;
  slug: string;
  coverImage: string;
  content: string;
  excerpt: string;
  category: PostCategory;
  tags: string;
  status: PostStatus;
}

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export default function PostEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    coverImage: '',
    content: '',
    excerpt: '',
    category: 'Commentary',
    tags: '',
    status: 'draft',
  });

  const [autoSlug, setAutoSlug] = useState(true);

  useEffect(() => {
    if (id) {
      const post = mockPosts.find((p) => p.id === id);
      if (post) {
        setFormData({
          title: post.title,
          slug: post.slug,
          coverImage: post.coverImage || '',
          content: post.content,
          excerpt: post.excerpt,
          category: post.category,
          tags: post.tags.join(', '),
          status: post.status,
        });
        setAutoSlug(false);
      }
    }
  }, [id]);

  useEffect(() => {
    if (autoSlug && formData.title) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(prev.title) }));
    }
  }, [formData.title, autoSlug]);

  const renderedContent = useMemo(() => {
    if (!formData.content) return '';
    return marked(formData.content);
  }, [formData.content]);

  const handleChange = (field: keyof PostFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'slug') {
      setAutoSlug(false);
    }
  };

  const handleSave = (status: PostStatus) => {
    if (!formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a title for the post.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.content.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter content for the post.',
        variant: 'destructive',
      });
      return;
    }

    // In a real app, this would make an API call
    const post: Post = {
      id: id || Date.now().toString(),
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      coverImage: formData.coverImage || undefined,
      content: formData.content,
      excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
      category: formData.category,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      status,
      publishedAt: status === 'published' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Saving post:', post);

    toast({
      title: isEditing ? 'Post updated' : 'Post created',
      description: `The post has been ${status === 'published' ? 'published' : 'saved as draft'}.`,
    });

    navigate('/admin/posts');
  };

  return (
    <AdminLayout>
      <Container>
        <div className="py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/posts')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{isEditing ? 'Edit Post' : 'New Post'}</h1>
                <p className="text-muted-foreground">
                  {isEditing ? 'Update your post content' : 'Create a new blog post'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleSave('draft')}>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => handleSave('published')}>
                Publish
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Post Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter post title..."
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      placeholder="post-url-slug"
                      value={formData.slug}
                      onChange={(e) => handleChange('slug', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      URL: /blog/{formData.slug || 'your-post-slug'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      placeholder="Brief description of the post..."
                      value={formData.excerpt}
                      onChange={(e) => handleChange('excerpt', e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Content (Markdown)</Label>
                    <Tabs defaultValue="write" className="w-full">
                      <TabsList className="w-full justify-start">
                        <TabsTrigger value="write">Write</TabsTrigger>
                        <TabsTrigger value="preview">
                          <Eye className="mr-1 h-4 w-4" />
                          Preview
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="write" className="mt-4">
                        <Textarea
                          placeholder="Write your post content in Markdown..."
                          value={formData.content}
                          onChange={(e) => handleChange('content', e.target.value)}
                          rows={20}
                          className="font-mono text-sm"
                        />
                      </TabsContent>
                      <TabsContent value="preview" className="mt-4">
                        <div className="min-h-[400px] p-4 border rounded-md bg-background">
                          {formData.content ? (
                            <div
                              className="prose prose-slate max-w-none"
                              dangerouslySetInnerHTML={{ __html: renderedContent }}
                            />
                          ) : (
                            <p className="text-muted-foreground text-center py-12">
                              Start writing to see preview...
                            </p>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Post Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(v) => handleChange('category', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Judgment">Judgment</SelectItem>
                        <SelectItem value="Commentary">Commentary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(v) => handleChange('status', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="tag1, tag2, tag3"
                      value={formData.tags}
                      onChange={(e) => handleChange('tags', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate tags with commas
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cover Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="coverImage">Image URL</Label>
                    <Input
                      id="coverImage"
                      placeholder="https://example.com/image.jpg"
                      value={formData.coverImage}
                      onChange={(e) => handleChange('coverImage', e.target.value)}
                    />
                  </div>
                  {formData.coverImage && (
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={formData.coverImage}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </AdminLayout>
  );
}
