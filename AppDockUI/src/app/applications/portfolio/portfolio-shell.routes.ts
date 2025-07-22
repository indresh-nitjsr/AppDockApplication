import { Routes } from '@angular/router';
import { Preview } from './pages/preview/preview';
import { Portfolio } from './pages/portfolio/portfolio';
import { PortfolioDetails } from './pages/portfolio-details/portfolio-details';
import { AuthGuard } from '../../core/gaurds/auth-guard';
import { Profile } from './pages/profile/profile';

export const PORTFOLIO_ROUTES: Routes = [
  { path: '', component: Preview },
  { path: 'create', canActivate: [AuthGuard], component: Portfolio },
  { path: 'portfolio-details/:portfolioId', component: PortfolioDetails },
  { path: 'profile', component: Profile },
];
