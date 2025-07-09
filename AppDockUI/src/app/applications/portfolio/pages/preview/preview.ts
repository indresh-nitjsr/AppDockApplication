import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PortfolioService } from '../../services/portfolioService';
import { PortfolioDetails } from '../../models/portfolioDetails';

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
    private portfolioService: PortfolioService
  ) {}

  handleGetStarted() {
    localStorage.setItem('returnUrl', this.router.url);
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (user) {
      const userId = JSON.parse(user).userId;
      this.portfolioService.getUserPortfolio(userId).subscribe(
        (portfolio) => {
          this.portfolioDetails = PortfolioDetails.fromJson(portfolio);
          console.log('Portfolio details:', this.portfolioDetails);

          if (this.portfolioDetails && this.portfolioDetails.id) {
            this.router.navigate(['services/portfolio/portfolio-details']);
          } else if (token && user) {
            this.router.navigate(['services/portfolio/create']);
          } else {
            this.router.navigate(['/auth/login']);
          }
        },
        (error) => {
          console.error('Error fetching user portfolio:', error);

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
