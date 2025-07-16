import {
  ChangeDetectorRef,
  Component,
  OnInit,
  Renderer2,
  HostListener,
} from '@angular/core';
import { PortfolioService } from '../../services/portfolioService';
import { PortfolioDetails as PortfolioDetailsModel } from '../../models/portfolioDetails';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-portfolio-details',
  templateUrl: './portfolio-details.html',
  styleUrls: ['./portfolio-details.css'],
  standalone: true,
  imports: [CommonModule, RouterModule], // add CommonModule etc. if needed
})
export class PortfolioDetails implements OnInit {
  portfolioDetails: PortfolioDetailsModel = new PortfolioDetailsModel();
  activeTab: string = 'certificate';
  profileImage: any = '';
  activeSection: string = 'home';

  constructor(
    private portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.getPortfolioDetails();
  }

  activateTab(tab: string) {
    this.activeTab = tab;

    // Find all ripple spans and reset them
    setTimeout(() => {
      document.querySelectorAll('.ripple').forEach((el) => {
        el.classList.remove('animate');
      });
    }, 0);
  }

  get filteredItems() {
    console.log('certificates: ', this.portfolioDetails.certificates);

    return this.portfolioDetails.certificates?.filter(
      (item) => item.type === this.activeTab
    );
  }

  formatDate(date?: string | Date): string {
    if (!date) return ''; // If undefined or null, return empty string
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
    return (
      this.portfolioDetails?.skills?.flatMap((entry) => {
        return entry.skills.split(',').map((skill) => {
          const percent = Math.floor(Math.random() * 30 + 60); // random between 60–90%
          const color = colors[Math.floor(Math.random() * colors.length)];
          return {
            name: skill.trim(),
            percent,
            color,
          };
        });
      }) ?? []
    );
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const sections = ['home', 'experience', 'skill', 'project', 'certificate'];
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          this.activeSection = section;
          break;
        }
      }
    }
  }
}
