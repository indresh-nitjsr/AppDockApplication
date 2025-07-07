import { Component, Inject } from '@angular/core';
import { UserPortfolio } from '../../models/userPortfolio';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { PortfolioService } from '../../services/portfolioService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portfolio',
  imports: [FormsModule, CommonModule],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio {
  portfolioObj: UserPortfolio = new UserPortfolio();
  constructor(
    public portfolioService: PortfolioService,
    private router: Router
  ) {}

  createPortfolio() {
    this.portfolioService.createUserPortfolio(this.portfolioObj).subscribe(
      (res: UserPortfolio) => {
        console.log('Portfolio created successfully:', res);
        this.router.navigate(['services/portfolio', 'portfolio-details']);
      },
      (error: any) => {
        console.error('Error creating portfolio:', error);
      }
    );
  }
}
