import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PortfolioService } from '../../services/portfolioService';
import { PortfolioDetails } from '../../models/portfolioDetails';
import { ToastService } from '../../../../core/services/toast-service';

@Component({
  selector: 'app-preview',
  imports: [],
  templateUrl: './preview.html',
  styleUrl: './preview.css',
})
export class Preview {
  portfolioDetails: PortfolioDetails = new PortfolioDetails();
  constructor(
    private router: Router,
    private portfolioService: PortfolioService,
    private toastService: ToastService
  ) {}

  handleGetStarted() {
    localStorage.setItem('returnUrl', this.router.url);
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (user) {
      const userId = JSON.parse(user).userId;
      this.portfolioService.getUserPortfolioByUserId(userId).subscribe(
        (portfolio) => {
          this.portfolioDetails = PortfolioDetails.fromJson(portfolio);
          if (this.portfolioDetails && this.portfolioDetails.id) {
            this.router.navigate([
              `services/portfolio/portfolio-details/${this.portfolioDetails.id}`,
            ]);
          } else if (token && user) {
            this.router.navigate(['services/portfolio/create']);
          } else {
            this.router.navigate(['/auth/login']);
          }
        },
        (error) => {
          if (error.status !== 404) {
            this.toastService.show(
              `Unexpected error fetching portfolio: ${error}`,
              'error',
              4000
            );
          }

          // If error or not found, redirect accordingly
          if (token && user) {
            this.router.navigate(['services/portfolio/create']);
          } else {
            this.router.navigate(['/auth/login']);
          }
        }
      );
    } else {
      // If no user, redirect to login
      this.router.navigate(['/auth/login']);
    }
  }
}
