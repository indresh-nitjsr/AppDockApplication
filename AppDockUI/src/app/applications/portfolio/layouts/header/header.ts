import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { filter } from 'rxjs';
import { PortfolioIdService } from '../../services/portfolio-id.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  menuOpen: boolean = false;
  portfolioId: string | null = null;
  isUserLoggedIn = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private portfolioIdService: PortfolioIdService
  ) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  smoothScrollTo(targetY: number, duration = 600) {
    const startY = window.scrollY;
    const diff = targetY - startY;
    let startTime: number;

    function step(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percent = Math.min(progress / duration, 1);
      window.scrollTo(0, startY + diff * easeInOutQuad(percent));
      if (percent < 1) requestAnimationFrame(step);
    }

    function easeInOutQuad(t: number) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    requestAnimationFrame(step);
  }

  ngOnInit(): void {
    const User = localStorage.getItem('user');
    if (User) {
      const userId = JSON.parse(User).userId;
      if (userId) {
        this.isUserLoggedIn = true;
      }
    }

    this.route.paramMap.subscribe((params) => {
      const id = params.get('portfolioId');
      if (id) {
        this.portfolioIdService.setPortfolioId(id);
      }
    });

    // Try to get portfolioId from route params
    let child = this.route.root;
    while (child.firstChild) {
      child = child.firstChild;
    }

    const paramPortfolioId = child.snapshot.paramMap.get('portfolioId');
    if (paramPortfolioId) {
      this.portfolioId = paramPortfolioId;
    } else {
      // Fallback: get from localStorage
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          this.portfolioId = parsedUser?.portfolioId || null;
        } catch (err) {
          console.error('Error parsing user from localStorage', err);
        }
      }
    }

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const fragment = this.router.parseUrl(event.urlAfterRedirects).fragment;

        if (fragment) {
          setTimeout(() => {
            const el = document.getElementById(fragment);
            if (el) {
              const yOffset = -80; // adjust for navbar height
              const y =
                el.getBoundingClientRect().top + window.scrollY + yOffset;
              this.smoothScrollTo(y);
            } else {
              console.warn('Element not found for fragment:', fragment);
            }
          }, 300);
        }
      });
  }

  scrollToSection(fragment: string, event: Event): void {
    event.preventDefault(); // prevent href="#" from jumping
    this.router.navigate([], {
      fragment: fragment,
      skipLocationChange: false,
      queryParamsHandling: 'preserve',
    });
  }

  navigateWithFragment(fragment: string): void {
    const portfolioId = this.portfolioIdService.getPortfolioId();

    if (!portfolioId) {
      return;
    }

    this.router.navigate(
      ['/services/portfolio/portfolio-details', portfolioId],
      { fragment: fragment }
    );
  }
}
