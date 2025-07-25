import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { Header } from '../../layouts/header/header';
import { PortfolioDetails as PortfolioDetailsModel } from '../../models/portfolioDetails';
import { PortfolioService } from '../../services/portfolioService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  About,
  Certificates,
  Contact,
  Experience,
  Projects,
  Skill,
} from '../../models/portfolio.models';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { PortfolioIdService } from '../../services/portfolio-id.service';
import { ToastService } from '../../../../core/services/toast-service';

@Component({
  selector: 'app-profile',
  imports: [Header, CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  portfolioDetails: PortfolioDetailsModel = new PortfolioDetailsModel();
  aboutObj: About = new About();
  experienceObj: Experience = new Experience();
  projectObj: Projects = new Projects();
  certificateObj: Certificates = new Certificates();
  skillObj: Skill = new Skill();
  contactObj: Contact = new Contact();
  isUserLoggedIn = false;

  employmentTypes: string[] = [
    'Full-time',
    'Part-time',
    'Internship',
    'Self-employed',
    'Freelance',
    'Trainee',
  ];

  certificateTypes: string[] = ['certificate', 'achievement'];

  sectionVisibility = {
    about: true,
    experience: false,
    projects: false,
    certificates: false,
    contact: false,
  };

  modalOpen = false;
  sectionType: string = '';
  currentEditIndex: number | null = null;

  formData: any = {};

  constructor(
    private portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute,
    private portfolioIdService: PortfolioIdService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // check user authenticated
    const user = localStorage.getItem('user');

    if (user) {
      const userId = JSON.parse(user).userId;
      this.isUserLoggedIn = true;
    } else {
      this.router.navigate(['auth/login']);
      return;
    }

    //getPortfolio details
    this.loadPortfolio();

    // Handle smooth scroll on fragment change
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Access the current fragment
        this.route.fragment.subscribe((fragment) => {
          if (fragment) {
            setTimeout(() => {
              const el = document.getElementById(fragment);
              if (el) {
                const yOffset = -80; // adjust for fixed nav height
                const y =
                  el.getBoundingClientRect().top + window.scrollY + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }, 100); // delay ensures DOM is ready
          }
        });
      });
  }

  loadPortfolio() {
    const user = localStorage.getItem('user');
    if (user) {
      const userId = JSON.parse(user).userId;
      if (userId) {
        this.portfolioService.getUserPortfolioByUserId(userId).subscribe(
          (portfolio) => {
            this.portfolioDetails = PortfolioDetailsModel.fromJson(portfolio);
            this.cdr.detectChanges();
            if (this.portfolioDetails.id) {
              this.portfolioIdService.setPortfolioId(this.portfolioDetails.id);
            }
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
        this.toastService.show(`User not authenticated.`, 'error', 4000);
      }
    } else {
      this.toastService.show(`User not authenticated.`, 'error', 4000);
    }
  }

  get groupExperienceByCompany() {
    const grouped: { [companyName: string]: any[] } = {};
    this.portfolioDetails.experiences.forEach((exp: any) => {
      const key = exp.companyName || 'Other';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(exp);
    });
    return grouped;
  }

  toggleSection(section: keyof typeof this.sectionVisibility) {
    this.sectionVisibility[section] = !this.sectionVisibility[section];
  }

  openModal(section: string, item: any = null, idx: number | null = null) {
    this.modalOpen = true;
    this.sectionType = section;
    this.currentEditIndex = idx;
    const user = localStorage.getItem('user');

    if (user) {
      const userDetails = JSON.parse(user);
      if (section === 'about') {
        this.aboutObj = item ? { ...item } : new About();
      }

      if (section === 'experience') {
        this.experienceObj = item
          ? {
              ...item,
              startDate: this.formatDateForInput(item.startDate),
              endDate: this.formatDateForInput(item.endDate),
            }
          : new Experience();
      }

      if (section === 'project') {
        this.projectObj = item
          ? {
              ...item,
              startDate: this.formatDateForInput(item.startDate),
              endDate: this.formatDateForInput(item.endDate),
            }
          : new Projects();
      }

      if (section === 'certificate') {
        this.certificateObj = item
          ? {
              ...item,
              issueDate: this.formatDateForInput(item.issueDate),
              expiryDate: this.formatDateForInput(item.expiryDate),
            }
          : new Certificates();
      }

      if (section === 'skill') {
        this.skillObj = item
          ? {
              ...item,
            }
          : new Skill();
      }

      if (section === 'contact') {
        this.contactObj = item
          ? {
              ...item,
            }
          : new Skill();
      }
    }
  }

  formatDateForInput(date?: string | Date | null): string {
    if (!date) return ''; // If undefined or null, return empty string
    const d = typeof date === 'string' ? new Date(date) : date;
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      year: 'numeric',
    };
    return d.toLocaleDateString('en-US', options);
  }

  closeModal() {
    this.modalOpen = false;
    this.currentEditIndex = null;
    this.formData = {};
  }

  saveEntry() {
    const portfolioId = this.portfolioDetails.id;
    let saveOperation: Observable<any> | null = null;

    if (this.sectionType === 'about') {
      saveOperation = this.portfolioService.createUpdateAbout(this.aboutObj);
    } else if (this.sectionType === 'experience') {
      console.log('exp request: ', this.experienceObj);

      this.experienceObj.portfolioId = portfolioId;
      this.experienceObj.startDate = this.safeParseDate(
        this.experienceObj.startDate
      );
      this.experienceObj.endDate = this.experienceObj.isCurrentlyWorking
        ? null
        : this.experienceObj.endDate
        ? this.safeParseDate(this.experienceObj.endDate)
        : null;

      saveOperation = this.experienceObj.id
        ? this.portfolioService.updateExperience(this.experienceObj)
        : this.portfolioService.createExperience(this.experienceObj);
    } else if (this.sectionType === 'project') {
      this.projectObj.portfolioId = portfolioId;
      this.projectObj.startDate = this.safeParseDate(this.projectObj.startDate);
      this.projectObj.endDate = this.safeParseDate(this.projectObj.endDate);

      saveOperation = this.projectObj.projectId
        ? this.portfolioService.updateProject(this.projectObj)
        : this.portfolioService.createProject(this.projectObj);
    } else if (this.sectionType === 'certificate') {
      this.certificateObj.portfolioId = portfolioId;
      this.certificateObj.issueDate = this.safeParseDate(
        this.certificateObj.issueDate
      );
      this.certificateObj.expiryDate = this.safeParseDate(
        this.certificateObj.expiryDate
      );

      saveOperation = this.certificateObj.id
        ? this.portfolioService.updateCertificate(
            this.certificateObj.id,
            this.certificateObj
          )
        : this.portfolioService.createCertificate(this.certificateObj);
    } else if (this.sectionType === 'skill') {
      this.skillObj.portfolioId = portfolioId;

      saveOperation = this.skillObj.skillId
        ? this.portfolioService.updateSkill(this.skillObj)
        : this.portfolioService.createSkill(this.skillObj);
    } else if (this.sectionType === 'contact') {
      this.contactObj.portfolioId = portfolioId;

      saveOperation = this.contactObj.id
        ? this.portfolioService.updateContact(this.contactObj)
        : this.portfolioService.createContact(this.contactObj);
    }

    // Execute the save operation
    if (saveOperation) {
      saveOperation.subscribe({
        next: () => {
          this.loadPortfolio();
          this.closeModal();
          this.cdr.detectChanges();
        },
        error: (err) =>
          this.toastService.show(
            `Error saving ${this.sectionType}: ${err}`,
            'error',
            4000
          ),
      });
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  safeParseDate(input?: string | Date | null): Date | null {
    return input ? new Date(input) : null;
  }
}
