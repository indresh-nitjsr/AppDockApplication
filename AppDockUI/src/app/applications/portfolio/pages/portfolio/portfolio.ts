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
    private router: Router
  ) { }

  ngOnInit() {
    this.getPortfolioDetails();
  }

  getPortfolioDetails() {
    const user = localStorage.getItem('user');
    console.log("user: ", user)
    if (user) {
      const userId = JSON.parse(user).userId;
      if (userId) {
        this.portfolioService.getUserPortfolioByUserId(userId).subscribe(
          (portfolio) => {
            this.portfolioDetails = PortfolioDetailsModel.fromJson(portfolio);
            console.log('Portfolio Details: ', this.portfolioDetails);

            this.decideNextStep();
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

  createPortfolio() {
    this.portfolioService.createUserPortfolio(this.portfolioObj).subscribe(
      (res: UserPortfolio) => {
        console.log('Portfolio created successfully:', res);
        this.getPortfolioDetails();
        this.ngZone.run(() => {
          this.nextStep();
        });
      },
      (error: any) => {
        console.error('Error creating portfolio:', error);
      }
    );
  }

  createPortfolioAbout() {
    this.aboutObj.portfolioId = this.portfolioDetails.id;
    this.aboutObj.userId = this.portfolioDetails.user.userId;
    this.aboutObj.heading = `Hi I'm ${this.portfolioDetails.user.name}`;
    console.log('aboutObj: ', this.aboutObj);

    if (!this.aboutObj.profileImageUrl) {
      // If no URL given, assign default image before saving
      this.aboutObj.profileImageUrl = `images/portfolio_profile_img.png`;
    }

    this.portfolioService.createUpdateAbout(this.aboutObj).subscribe(
      (res: About) => {
        console.log('About Create successfully: ', res);
        this.ngZone.run(() => {
          this.nextStep();
        });
      },
      (error: any) => {
        console.log('Error creating About: ', error);
      }
    );
  }

  createPortfolioExperience() {
    this.experienceObj.portfolioId = this.portfolioDetails.id;

    this.portfolioService.createExperience(this.experienceObj).subscribe(
      (res: Experience) => {
        console.log('Experience Create successfully: ', res);
        this.ngZone.run(() => {
          this.nextStep();
        });
      },
      (error: any) => {
        console.log('Error creating Experience: ', error);
      }
    );
  }

  createPortfolioCertificate() {
    this.certificateObj.portfolioId = this.portfolioDetails.id;

    this.portfolioService.createCertificate(this.certificateObj).subscribe(
      (res: Certificates) => {
        console.log('Certificates Create successfully: ', res);
        this.ngZone.run(() => {
          this.nextStep();
        });
      },
      (error: any) => {
        console.log('Error creating Certificate: ', error);
      }
    );
  }

  createPortfolioSkill() {
    this.skillObj.portfolioId = this.portfolioDetails.id;
    this.portfolioService.createSkill(this.skillObj).subscribe(
      (res: any) => {
        console.log('Skill created: ', res);

        // Now fetch updated list
        this.portfolioService
          .getSkillsByPortfolioId(this.portfolioDetails.id)
          .subscribe((skills: any) => {
            console.log('get skill: ', skills);
            this.portfolioDetails.skills = skills;
            this.ngZone.run(() => {
              this.nextStep();
            });
          });
      },
      (error: any) => {
        console.log('Error creating Skill: ', error);
      }
    );
  }

  createPortfolioProject() {
    this.projectObj.portfolioId = this.portfolioDetails.id;
    this.portfolioService.createProject(this.projectObj).subscribe(
      (res: any) => {
        console.log('Project created: ', res);
        this.ngZone.run(() => {
          this.nextStep();
        });
      },
      (error: any) => {
        console.log('Error creating Skill: ', error);
      }
    );
  }

  createPortfolioContact() {

    this.contactObj.portfolioId = this.portfolioDetails.id;
    this.contactObj.userId = this.portfolioDetails.user.userId;
    this.portfolioService.createContact(this.contactObj).subscribe(
      (res: Contact) => {
        console.log('Contact saved:', res);
        this.ngZone.run(() => {
          this.nextStep();
        });
      },
      (error: any) => {
        console.log('Error saving contact:', error);
      }
    );
  }
  submitPortfolio() {
    this.router.navigate(['/services/portfolio', 'portfolio-details']);
  }

  onCheckboxChange() {
    if (this.experienceObj.isCurrentlyWorking) {
      this.experienceObj.endDate = new Date();
    }
  }

  currentStep = 1;

  nextStep() {
    console.log('before steps: ', this.currentStep);
    this.currentStep++;
    this.cdr.detectChanges();
    console.log('after steps: ', this.currentStep);
  }

  prevStep() {
    this.currentStep--;
  }

  decideNextStep() {
    if (
      !this.portfolioDetails.about ||
      this.portfolioDetails.about.description === ''
    ) {
      this.currentStep = 2; // About
    } else if (
      !this.portfolioDetails.experiences ||
      this.portfolioDetails.experiences.length === 0
    ) {
      this.currentStep = 3; // Experience
    } else if (
      !this.portfolioDetails.skills ||
      this.portfolioDetails.skills.length === 0
    ) {
      this.currentStep = 4; // Skills
    } else if (
      !this.portfolioDetails.projects ||
      this.portfolioDetails.projects.length === 0
    ) {
      this.currentStep = 5; // Projects
    } else if (
      !this.portfolioDetails.certificates ||
      this.portfolioDetails.certificates.length === 0
    ) {
      this.currentStep = 6; // Certificates
    } else if (!this.portfolioDetails.contact ||
      this.portfolioDetails.contact.address === '') {
      this.currentStep = 7;
    } else {
      this.currentStep = 8; // All done
    }
  }
}
