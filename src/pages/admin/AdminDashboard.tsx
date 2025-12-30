import { Link } from 'react-router-dom';
import { FileText, DollarSign, Settings, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Container } from '@/components/layout/Container';
import { useAuthStore } from '@/stores/authStore';
import { mockPosts, mockFees } from '@/lib/mockData';

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const publishedPosts = mockPosts.filter((p) => p.status === 'published').length;
  const draftPosts = mockPosts.filter((p) => p.status === 'draft').length;
  const totalFees = mockFees.length;

  const recentPosts = mockPosts.slice(0, 5);

  return (
    <AdminLayout>
      <Container>
        <div className="py-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name || 'Admin'}
              </p>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockPosts.length}</div>
                <p className="text-xs text-muted-foreground">
                  {publishedPosts} published, {draftPosts} drafts
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <FileText className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{publishedPosts}</div>
                <p className="text-xs text-muted-foreground">Live on website</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{draftPosts}</div>
                <p className="text-xs text-muted-foreground">Awaiting publication</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fee Items</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalFees}</div>
                <p className="text-xs text-muted-foreground">Services listed</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-accent" />
                  Create Post
                </CardTitle>
                <CardDescription>Write a new blog post or judgment analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/admin/posts/new">New Post</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-accent" />
                  Manage Fees
                </CardTitle>
                <CardDescription>Update service pricing and fee items</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/admin/fees">Manage Fees</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-accent" />
                  Settings
                </CardTitle>
                <CardDescription>Update site settings and contact info</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/admin/settings">Edit Settings</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Posts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Posts</CardTitle>
                <CardDescription>Your latest blog posts and articles</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/posts">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{post.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            post.status === 'published'
                              ? 'bg-accent/10 text-accent'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {post.status}
                        </span>
                        <span className="text-xs text-muted-foreground">{post.category}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/admin/posts/${post.id}/edit`}>Edit</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </AdminLayout>
  );
}
