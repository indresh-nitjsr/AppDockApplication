import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolioService';
import { UserPortfolio } from '../../models/userPortfolio';
import { PortfolioDetails as PortfolioDetailsModel } from '../../models/portfolioDetails';
import {
  About,
  Certificates,
  Contact,
  Experience,
  Projects,
  Skill,
} from '../../models/portfolio.models';
import { Router } from '@angular/router';
import { ToastService } from '../../../../core/services/toast-service';

@Component({
  selector: 'app-portfolio',
  imports: [FormsModule, CommonModule],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio implements OnInit {
  employmentTypes: string[] = [
    'Full-time',
    'Part-time',
    'Internship',
    'Self-employed',
    'Freelance',
    'Trainee',
  ];
  portfolioObj: UserPortfolio = new UserPortfolio();
  aboutObj: About = new About();
  portfolioDetails: PortfolioDetailsModel = new PortfolioDetailsModel();
  experienceObj: Experience = new Experience();
  certificateObj: Certificates = new Certificates();
  skillObj: Skill = new Skill();
  projectObj: Projects = new Projects();
  contactObj: Contact = new Contact();

  constructor(
    public portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.getPortfolioDetails();
  }

  getPortfolioDetails() {
    const user = localStorage.getItem('user');
    if (user) {
      const userId = JSON.parse(user).userId;
      if (userId) {
        this.portfolioService.getUserPortfolioByUserId(userId).subscribe(
          (portfolio) => {
            this.portfolioDetails = PortfolioDetailsModel.fromJson(portfolio);
            this.toastService.show(
              `Portfolio loaded successfully!`,
              'success',
              4000
            );
            this.decideNextStep();
            this.cdr.detectChanges();
          },
          (error) => {
            this.toastService.show(
              `Error in fetching portfolio`,
              'error',
              4000
            );
          }
        );
      } else {
        this.toastService.show(
          `User not Authenticated, Please Logged in first`,
          'error',
          4000
        );
      }
    } else {
      this.toastService.show(
        `User not Authenticated, Please Logged in first`,
        'error',
        4000
      );
    }
  }

  createPortfolio() {
    this.portfolioService.createUserPortfolio(this.portfolioObj).subscribe(
      (res: UserPortfolio) => {
        this.getPortfolioDetails();
        this.ngZone.run(() => {
          this.nextStep();
        });
      },
      (error: any) => {
        this.toastService.show(
          `Error creating portfolio: ${error}`,
          'error',
          4000
        );
      }
    );
  }

  createPortfolioAbout() {
    this.aboutObj.portfolioId = this.portfolioDetails.id;
    this.aboutObj.userId = this.portfolioDetails.user.userId;
    this.aboutObj.heading = `Hi I'm ${this.portfolioDetails.user.name}`;

    if (!this.aboutObj.profileImageUrl) {
      // If no URL given, assign default image before saving
      this.aboutObj.profileImageUrl = `images/portfolio_profile_img.png`;
    }

    this.portfolioService.createUpdateAbout(this.aboutObj).subscribe(
      (res: About) => {
        this.ngZone.run(() => {
          this.nextStep();
        });
      },
      (error: any) => {
        this.toastService.show(`Error creating About: ${error}`, 'error', 4000);
      }
    );
  }

  // createPortfolioExperience() {
  //   this.experienceObj.portfolioId = this.portfolioDetails.id;

  //   this.portfolioService.createExperience(this.experienceObj).subscribe(
  //     (res: Experience) => {
  //       console.log('Experience Create successfully: ', res);
  //       this.ngZone.run(() => {
  //         this.nextStep();
  //       });
  //     },
  //     (error: any) => {
  //       console.log('Error creating Experience: ', error);
  //     }
  //   );
  // }

  // createPortfolioCertificate() {
  //   this.certificateObj.portfolioId = this.portfolioDetails.id;

  //   this.portfolioService.createCertificate(this.certificateObj).subscribe(
  //     (res: Certificates) => {
  //       console.log('Certificates Create successfully: ', res);
  //       this.ngZone.run(() => {
  //         this.nextStep();
  //       });
  //     },
  //     (error: any) => {
  //       console.log('Error creating Certificate: ', error);
  //     }
  //   );
  // }

  // createPortfolioSkill() {
  //   this.skillObj.portfolioId = this.portfolioDetails.id;
  //   this.portfolioService.createSkill(this.skillObj).subscribe(
  //     (res: any) => {
  //       console.log('Skill created: ', res);

  //       // Now fetch updated list
  //       this.portfolioService
  //         .getSkillsByPortfolioId(this.portfolioDetails.id)
  //         .subscribe((skills: any) => {
  //           console.log('get skill: ', skills);
  //           this.portfolioDetails.skills = skills;
  //           this.ngZone.run(() => {
  //             this.nextStep();
  //           });
  //         });
  //     },
  //     (error: any) => {
  //       console.log('Error creating Skill: ', error);
  //     }
  //   );
  // }

  // createPortfolioProject() {
  //   this.projectObj.portfolioId = this.portfolioDetails.id;
  //   this.portfolioService.createProject(this.projectObj).subscribe(
  //     (res: any) => {
  //       console.log('Project created: ', res);
  //       this.ngZone.run(() => {
  //         this.nextStep();
  //       });
  //     },
  //     (error: any) => {
  //       console.log('Error creating Skill: ', error);
  //     }
  //   );
  // }

  createPortfolioContact() {
    this.contactObj.portfolioId = this.portfolioDetails.id;
    this.contactObj.userId = this.portfolioDetails.user.userId;
    this.portfolioService.createContact(this.contactObj).subscribe(
      (res: Contact) => {
        this.toastService.show(`Contact saved`, 'success', 4000);
        this.ngZone.run(() => {
          this.nextStep();
        });
      },
      (error: any) => {
        this.toastService.show(`Error saving contact`, 'success', 4000);
      }
    );
  }
  submitPortfolio() {
    this.router.navigate([
      '/services/portfolio/portfolio-details',
      this.portfolioDetails.id,
    ]);
  }

  onCheckboxChange() {
    if (this.experienceObj.isCurrentlyWorking) {
      this.experienceObj.endDate = new Date();
    }
  }

  currentStep = 1;

  nextStep() {
    this.cdr.detectChanges();
    this.currentStep++;
  }

  decideNextStep() {
    if (
      !this.portfolioDetails.about ||
      this.portfolioDetails.about.description === ''
    ) {
      this.currentStep = 2; // About
    } else if (
      !this.portfolioDetails.contact ||
      this.portfolioDetails.contact.address === ''
    ) {
      this.currentStep = 3;
    } else {
      this.currentStep = 4; // All done
    }
  }
}
