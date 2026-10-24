import { lazy, Suspense, useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/app/layouts/AppLayout';
import { PAGES, REFERENCE_PAGE, UI_TEXT } from '@/config/site';
import { installDragScroll } from '@/lib/dragScroll';

const HomePage = lazy(() => import('@/pages/HomePage'));
const TopicPage = lazy(() => import('@/pages/TopicPage'));
const DefinitionsPage = lazy(() => import('@/pages/DefinitionsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

/** The routes without a router, so tests can mount them in a MemoryRouter. */
export function AppRoutes() {
  return (
    <Suspense fallback={<p className="p-6">{UI_TEXT.loading}</p>}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          {PAGES.map((page) => (
            <Route key={page.id} path={page.route} element={<TopicPage pageId={page.id} />} />
          ))}
          <Route path={REFERENCE_PAGE.route} element={<DefinitionsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export function App() {
  useEffect(installDragScroll, []);
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
