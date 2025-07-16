import { Routes } from '@angular/router';
import { pagesRoutes } from './pages/pages.routes';
import { AppShell } from './layouts/app-shell/app-shell';
import { authRoutes } from './auth/auth.routes';
import { PortfolioShell } from './applications/portfolio/portfolio-shell';

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
    component: PortfolioShell,
    loadChildren: () =>
      import('./applications/portfolio/portfolio-shell.routes').then(
        (m) => m.PORTFOLIO_ROUTES
      ),
  },
];
