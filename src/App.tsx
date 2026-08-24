import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from '@/components/ScrollToTop';

// Public pages — eagerly imported. These are what visitors actually land on and
// together they are small, so splitting them would only add round-trips.
import Home from './pages/Home';
import Services from './pages/Services';
import PracticeAreas from './pages/PracticeAreas';
import Fees from './pages/Fees';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import { Privacy, Terms } from './pages/Legal';
import NotFound from './pages/NotFound';

/*
 * Two lazy boundaries, each for a specific reason.
 *
 * `AdminRoutes` is ~2,000 lines of editors, tables and forms — plus zod,
 * react-hook-form and the Radix dialog/table/toast primitives — that exactly one
 * person will ever open. It used to sit in the same bundle as the home page.
 *
 * `BlogPost` is the only page that renders Markdown, and `marked` + `dompurify`
 * come to ~24 kB gzipped. Keeping this route lazy stops Vite from emitting a
 * modulepreload for that chunk on every page in the site.
 */
const AdminRoutes = lazy(() => import('./pages/admin/AdminRoutes'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center text-muted-foreground">
      Loading…
    </div>
  );
}

const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/practice-areas" element={<PracticeAreas />} />
      <Route path="/fees" element={<Fees />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route
        path="/blog/:slug"
        element={
          <Suspense fallback={<RouteFallback />}>
            <BlogPost />
          </Suspense>
        }
      />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

      {/* Admin */}
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<RouteFallback />}>
            <AdminRoutes />
          </Suspense>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
