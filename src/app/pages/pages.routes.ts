import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Service } from './service/service';
import { Contact } from './contact/contact';

export const pagesRoutes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'services', component: Service },
  { path: 'contact', component: Contact },
];
