import { ReactNode } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, FileText, DollarSign, Settings, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/NavLink';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const adminNavLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/posts', label: 'Posts', icon: FileText },
  { to: '/admin/fees', label: 'Fees', icon: DollarSign },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-primary-foreground flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6">
          <Link to="/admin" className="block">
            <span className="text-xl font-serif font-bold">
              IPR<span className="text-accent">Central</span>
            </span>
            <span className="block text-xs text-primary-foreground/60 mt-1">Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {adminNavLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
              activeClassName="bg-primary-foreground/10 text-primary-foreground"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-primary-foreground/10">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
          >
            <Home className="h-4 w-4" />
            View Site
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-primary text-primary-foreground flex items-center justify-between px-4 z-50">
        <Link to="/admin">
          <span className="text-lg font-serif font-bold">
            IPR<span className="text-accent">Central</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="text-primary-foreground">
            <Link to="/">
              <Home className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-primary-foreground" onClick={logout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
        <nav className="flex justify-around py-2">
          {adminNavLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground"
              activeClassName="text-accent"
            >
              <link.icon className="h-5 w-5" />
              <span className="text-xs">{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-muted/30 md:pt-0 pt-14 pb-20 md:pb-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
