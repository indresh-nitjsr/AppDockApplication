import { Routes } from '@angular/router';
import { Login } from './login/login';
import { VerifyEmail } from './verify-email/verify-email';

export const authRoutes: Routes = [
  { path: 'login', component: Login },
  { path: 'verify-email', component: VerifyEmail },
];
