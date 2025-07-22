import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Header } from './layouts/header/header';
import { Profile } from './pages/profile/profile';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio-shell',
  imports: [RouterModule, Header, CommonModule],
  templateUrl: './portfolio-shell.html',
  styleUrl: './portfolio-shell.css',
})
export class PortfolioShell {
  showHeader = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Hide header only on this route
        this.showHeader = event.url !== '/services/portfolio';
      }
    });
  }
}
