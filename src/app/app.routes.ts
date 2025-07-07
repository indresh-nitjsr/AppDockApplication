import { Routes } from '@angular/router';
import { pagesRoutes } from './pages/pages.routes';
import { AppShell } from './layouts/app-shell/app-shell';
import { authRoutes } from './auth/auth.routes';

export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: pagesRoutes,
  },
  {
    path: 'auth',
    children: authRoutes,
  },
  {
    path: 'services/portfolio',
    loadChildren: () =>
      import('./applications/portfolio/portfolio.routes').then(
        (m) => m.PORTFOLIO_ROUTES
      ),
  },
];
