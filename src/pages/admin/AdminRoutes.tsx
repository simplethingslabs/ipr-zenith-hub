/**
 * The entire admin section, behind a single lazy boundary.
 *
 * Grouping the admin routes AND the toast host in one lazily-imported module
 * keeps them out of the public bundle. Mounting `<Toaster />` in `App` instead
 * would pull the Radix toast primitives into the main chunk for every visitor,
 * even though only the admin panel ever raises a toast.
 */

import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import PostsManager from './PostsManager';
import PostEditor from './PostEditor';
import FeesManager from './FeesManager';
import AdminSettings from './Settings';
import NotFound from '../NotFound';

export default function AdminRoutes() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route path="" element={<AdminDashboard />} />
        <Route path="posts" element={<PostsManager />} />
        <Route path="posts/new" element={<PostEditor />} />
        <Route path="posts/:id/edit" element={<PostEditor />} />
        <Route path="fees" element={<FeesManager />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
