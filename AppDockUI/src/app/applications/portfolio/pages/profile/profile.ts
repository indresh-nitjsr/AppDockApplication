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
    private portfolioIdService: PortfolioIdService
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
            console.log('portfolioDetails: ', this.portfolioDetails);
            if (this.portfolioDetails.id) {
              this.portfolioIdService.setPortfolioId(this.portfolioDetails.id);
            }
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
        console.log('about data: ', this.aboutObj);
      }

      if (section === 'experience') {
        this.experienceObj = item
          ? {
              ...item,
              startDate: this.formatDateForInput(item.startDate),
              endDate: this.formatDateForInput(item.endDate),
            }
          : new Experience();
        console.log('experience data: ', this.experienceObj);
      }

      if (section === 'project') {
        this.projectObj = item
          ? {
              ...item,
              startDate: this.formatDateForInput(item.startDate),
              endDate: this.formatDateForInput(item.endDate),
            }
          : new Projects();
        console.log('project data: ', this.experienceObj);
      }

      if (section === 'certificate') {
        this.certificateObj = item
          ? {
              ...item,
              issueDate: this.formatDateForInput(item.issueDate),
              expiryDate: this.formatDateForInput(item.expiryDate),
            }
          : new Certificates();
        console.log('certificate data: ', this.certificateObj);
      }

      if (section === 'skill') {
        this.skillObj = item
          ? {
              ...item,
            }
          : new Skill();
        console.log('skill data: ', this.skillObj);
      }

      if (section === 'contact') {
        this.contactObj = item
          ? {
              ...item,
            }
          : new Skill();
        console.log('contact data: ', this.contactObj);
      }
    }
  }

  formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0]; // Returns 'YYYY-MM-DD'
  }

  closeModal() {
    this.modalOpen = false;
    this.currentEditIndex = null;
    this.formData = {};
  }

  // saveEntry() {
  //   if (this.sectionType === 'about') {
  //     this.portfolioService.createUpdateAbout(this.aboutObj).subscribe({
  //       next: () => {
  //         this.loadPortfolio();
  //         this.cdr.detectChanges();
  //         this.closeModal();
  //       },
  //       error: (err) => console.error('Error updating about:', err),
  //     });
  //   }
  //   if (this.sectionType === 'experience') {
  //     this.experienceObj.portfolioId = this.portfolioDetails.id;

  //     // convert date string to Date (optional)
  //     this.experienceObj.startDate = new Date(this.experienceObj.startDate);
  //     this.experienceObj.endDate = this.experienceObj.isCurrentlyWorking
  //       ? undefined
  //       : this.experienceObj.endDate
  //       ? new Date(this.experienceObj.endDate)
  //       : undefined;
  //     console.log('experience Id: ', this.experienceObj.id);

  //     if (this.experienceObj.id) {
  //       this.portfolioService
  //         .updateExperience(this.experienceObj)
  //         .subscribe(() => {
  //           this.closeModal();
  //           this.loadPortfolio();
  //         });
  //     } else {
  //       this.portfolioService
  //         .createExperience(this.experienceObj)
  //         .subscribe(() => {
  //           this.closeModal();
  //           this.loadPortfolio();
  //         });
  //     }
  //   }
  //   if (this.sectionType === 'project') {
  //     this.projectObj.portfolioId = this.portfolioDetails.id;

  //     // convert date string to Date (optional)
  //     this.projectObj.startDate = new Date(this.experienceObj.startDate);
  //     this.projectObj.endDate = new Date(this.projectObj.endDate || new Date());

  //     if (this.projectObj.projectId) {
  //       this.portfolioService.updateProject(this.projectObj).subscribe(() => {
  //         this.closeModal();
  //         this.loadPortfolio();
  //       });
  //     } else {
  //       this.portfolioService.createProject(this.projectObj).subscribe(() => {
  //         this.closeModal();
  //         this.loadPortfolio();
  //       });
  //     }
  //   }
  //   if (this.sectionType === 'certificate') {
  //     this.certificateObj.portfolioId = this.portfolioDetails.id;

  //     // convert date string to Date (optional)
  //     this.certificateObj.issueDate = new Date(this.certificateObj.issueDate);
  //     this.certificateObj.expiryDate = new Date(
  //       this.certificateObj.expiryDate || new Date()
  //     );

  //     if (this.certificateObj.id) {
  //       this.portfolioService
  //         .updateCertificate(this.certificateObj.id, this.certificateObj)
  //         .subscribe(() => {
  //           this.closeModal();
  //           this.loadPortfolio();
  //         });
  //     } else {
  //       this.portfolioService
  //         .createCertificate(this.certificateObj)
  //         .subscribe(() => {
  //           this.closeModal();
  //           this.loadPortfolio();
  //         });
  //     }
  //   }
  //   if (this.sectionType === 'skill') {
  //     this.skillObj.portfolioId = this.portfolioDetails.id;

  //     if (this.skillObj.skillId) {
  //       this.portfolioService.updateSkill(this.skillObj).subscribe(() => {
  //         this.closeModal();
  //         this.loadPortfolio();
  //       });
  //     } else {
  //       this.portfolioService.createSkill(this.skillObj).subscribe(() => {
  //         this.closeModal();
  //         this.loadPortfolio();
  //       });
  //     }
  //   }
  //   if (this.sectionType === 'contact') {
  //     this.contactObj.portfolioId = this.portfolioDetails.id;

  //     if (this.contactObj.id) {
  //       this.portfolioService.updateContact(this.contactObj).subscribe(() => {
  //         this.closeModal();
  //         this.loadPortfolio();
  //       });
  //     } else {
  //       this.portfolioService.createContact(this.contactObj).subscribe(() => {
  //         this.closeModal();
  //         this.loadPortfolio();
  //       });
  //     }
  //   }
  // }

  saveEntry() {
    const portfolioId = this.portfolioDetails.id;
    let saveOperation: Observable<any> | null = null;

    if (this.sectionType === 'about') {
      saveOperation = this.portfolioService.createUpdateAbout(this.aboutObj);
    } else if (this.sectionType === 'experience') {
      this.experienceObj.portfolioId = portfolioId;
      this.experienceObj.startDate = new Date(this.experienceObj.startDate);
      this.experienceObj.endDate = this.experienceObj.isCurrentlyWorking
        ? undefined
        : this.experienceObj.endDate
        ? new Date(this.experienceObj.endDate)
        : undefined;

      saveOperation = this.experienceObj.id
        ? this.portfolioService.updateExperience(this.experienceObj)
        : this.portfolioService.createExperience(this.experienceObj);
    } else if (this.sectionType === 'project') {
      this.projectObj.portfolioId = portfolioId;
      this.projectObj.startDate = new Date(this.projectObj.startDate);
      this.projectObj.endDate = new Date(this.projectObj.endDate || new Date());

      saveOperation = this.projectObj.projectId
        ? this.portfolioService.updateProject(this.projectObj)
        : this.portfolioService.createProject(this.projectObj);
    } else if (this.sectionType === 'certificate') {
      this.certificateObj.portfolioId = portfolioId;
      this.certificateObj.issueDate = new Date(this.certificateObj.issueDate);
      this.certificateObj.expiryDate = new Date(
        this.certificateObj.expiryDate || new Date()
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
        error: (err) => console.error(`Error saving ${this.sectionType}:`, err),
      });
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
