import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolioService';
import { PortfolioDetails as PortfolioDetailsModel } from '../../models/portfolioDetails';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio-details',
  templateUrl: './portfolio-details.html',
  styleUrls: ['./portfolio-details.css'],
  standalone: true,
  imports: [CommonModule], // add CommonModule etc. if needed
})
export class PortfolioDetails implements OnInit {
  portfolioDetails: PortfolioDetailsModel = new PortfolioDetailsModel();

  constructor(
    private portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getPortfolioDetails();
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      year: 'numeric',
    };
    return d.toLocaleDateString('en-US', options);
  }

  getPortfolioDetails() {
    const user = localStorage.getItem('user');
    if (user) {
      const userId = JSON.parse(user).userId;
      if (userId) {
        this.portfolioService.getUserPortfolio(userId).subscribe(
          (portfolio) => {
            this.portfolioDetails = PortfolioDetailsModel.fromJson(portfolio);
            console.log('Portfolio details loaded:', this.portfolioDetails);
            this.cdr.detectChanges();
          },
          (error) => {
            console.error('Error fetching portfolio details:', error);
          }
        );
      } else {
        console.error('User ID not found in local storage');
      }
    } else {
      console.error('User not found in local storage');
    }
  
  
  }

  get skillsList() {
    const colors = ['blue', 'green', 'yellow', 'purple', 'red'];
    return this.portfolioDetails?.skills?.flatMap(entry => {
      return entry.skills.split(',').map(skill => {
        const percent = Math.floor(Math.random() * 30 + 60); // random between 60–90%
        const color = colors[Math.floor(Math.random() * colors.length)];
        return {
          name: skill.trim(),
          percent,
          color
        };
      });
    }) ?? [];
  }
}
