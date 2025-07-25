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
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PortfolioIdService } from '../../services/portfolio-id.service';
import { ToastService } from '../../../../core/services/toast-service';

@Component({
  selector: 'app-portfolio-details',
  templateUrl: './portfolio-details.html',
  styleUrls: ['./portfolio-details.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // add CommonModule etc. if needed
})
export class PortfolioDetails implements OnInit {
  portfolioDetails: PortfolioDetailsModel = new PortfolioDetailsModel();
  activeTab: string = 'certificate';
  profileImage: any = '';
  activeSection: string = 'home';
  isFlipped: boolean[] = [];
  isUserLoggedIn = false;

  constructor(
    private portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute,
    private portfolioIdService: PortfolioIdService,
    private toastService: ToastService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      const portfolioId = params.get('portfolioId');
      if (portfolioId) {
        this.getPortfolioDetails(portfolioId);
      }
    });
    this.initializeFlips();
    if (localStorage.getItem('user')) {
      this.isUserLoggedIn = true;
    }
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

  initializeFlips(): void {
    if (this.filteredItems) {
      this.isFlipped = this.filteredItems.map(() => false);
    }
  }

  get filteredItems() {
    return this.portfolioDetails.certificates?.filter(
      (item) => item.type === this.activeTab
    );
  }

  formatDate(date?: string | Date | null): string {
    if (!date) return ''; // If undefined or null, return empty string
    const d = typeof date === 'string' ? new Date(date) : date;
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      year: 'numeric',
    };
    return d.toLocaleDateString('en-US', options);
  }

  getPortfolioDetails(portfolioId: string) {
    // const portfolioId = '2d41cd57-5110-4ee6-8d9f-c2374d8ffe3b';

    if (portfolioId) {
      this.portfolioService
        .getUserPortfolioByPortfolioId(portfolioId)
        .subscribe(
          (portfolio) => {
            this.portfolioDetails = PortfolioDetailsModel.fromJson(portfolio);
            if (this.portfolioDetails.id) {
              this.portfolioIdService.setPortfolioId(this.portfolioDetails.id);
            }
            this.cdr.detectChanges();
          },
          (error) => {
            this.toastService.show(
              `Error fetching portfolio details: ${error}`,
              'error',
              4000
            );
          }
        );
    } else {
      this.toastService.show(`Portfolio not found.`, 'error', 4000);
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

  selectedCertificate: any = null;
  isModalOpen: boolean = false;

  openModal(certificate: any): void {
    this.selectedCertificate = certificate;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.selectedCertificate = null;
    this.isModalOpen = false;
  }

  flippedIndex: number | null = null;

  toggleFlip(index: number): void {
    this.flippedIndex = index;
  }

  resetFlip(index: number): void {
    if (this.flippedIndex === index) {
      this.flippedIndex = null;
    }
  }

  expandedDescriptions: { [key: number]: boolean } = {};

  toggleDescription(index: number): void {
    this.expandedDescriptions[index] = !this.expandedDescriptions[index];
  }

  // Contact form
  contactData = {
    name: '',
    email: '',
    message: '',
  };

  sendMessage() {
    if (
      this.contactData.name &&
      this.contactData.email &&
      this.contactData.message
    ) {
      // You can replace this with actual HTTP POST to backend
      this.toastService.show(`Sending message...`, 'warning', 4000);

      // Reset the form
      this.contactData = { name: '', email: '', message: '' };
      this.toastService.show(`Message sent successfully!`, 'success', 4000);
    } else {
      this.toastService.show(`Please fill in all fields.`, 'error', 4000);
    }
  }
}
