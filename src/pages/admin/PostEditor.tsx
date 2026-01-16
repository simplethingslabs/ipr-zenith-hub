import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Upload, X, Link, Loader2 } from 'lucide-react';
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
import { postsApi } from '@/lib/api';
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

interface CoverImageUploadProps {
  coverImage: string;
  onImageChange: (url: string) => void;
}

function CoverImageUpload({ coverImage, onImageChange }: CoverImageUploadProps) {
  const [useUrl, setUseUrl] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return;
    }

    // Create object URL for preview (in production, this would upload to storage)
    const objectUrl = URL.createObjectURL(file);
    onImageChange(objectUrl);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onImageChange(urlInput.trim());
      setUrlInput('');
      setUseUrl(false);
    }
  };

  const handleRemove = () => {
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cover Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {coverImage ? (
          <div className="relative">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={coverImage}
                alt="Cover preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {useUrl ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                  />
                  <Button type="button" onClick={handleUrlSubmit}>
                    Add
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setUseUrl(false)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload instead
                </Button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload an image
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
            
            {!useUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setUseUrl(true)}
              >
                <Link className="mr-2 h-4 w-4" />
                Use URL instead
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

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
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        setIsLoading(true);
        try {
          // First try to get all posts and find by ID
          const posts = await postsApi.getAll();
          const post = posts.find((p) => p.id === id);
          
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
          } else {
            toast({
              title: 'Error',
              description: 'Post not found',
              variant: 'destructive',
            });
            navigate('/admin/posts');
          }
        } catch (err) {
          console.error('Failed to fetch post:', err);
          toast({
            title: 'Error',
            description: 'Failed to load post',
            variant: 'destructive',
          });
          navigate('/admin/posts');
        } finally {
          setIsLoading(false);
        }
      };
      fetchPost();
    }
  }, [id, navigate, toast]);

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

  const handleSave = async (status: PostStatus) => {
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

    setIsSaving(true);
    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
        coverImage: formData.coverImage || undefined,
        category: formData.category,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        status,
      };

      if (isEditing && id) {
        await postsApi.update(id, postData);
        toast({
          title: 'Post updated',
          description: `The post has been ${status === 'published' ? 'published' : 'saved as draft'}.`,
        });
      } else {
        await postsApi.create(postData);
        toast({
          title: 'Post created',
          description: `The post has been ${status === 'published' ? 'published' : 'saved as draft'}.`,
        });
      }

      navigate('/admin/posts');
    } catch (err) {
      console.error('Failed to save post:', err);
      toast({
        title: 'Error',
        description: 'Failed to save post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <Container>
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </Container>
      </AdminLayout>
    );
  }

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
              <Button variant="outline" onClick={() => handleSave('draft')} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Draft
              </Button>
              <Button 
                className="bg-accent text-accent-foreground hover:bg-accent/90" 
                onClick={() => handleSave('published')}
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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

              <CoverImageUpload
                coverImage={formData.coverImage}
                onImageChange={(url) => handleChange('coverImage', url)}
              />
            </div>
          </div>
        </div>
      </Container>
    </AdminLayout>
  );
}
