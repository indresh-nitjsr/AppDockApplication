import {
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { PortfolioService } from '../../services/portfolioService';
import { UserPortfolio } from '../../models/userPortfolio';
import { PortfolioDetails as PortfolioDetailsModel } from '../../models/portfolioDetails';
import {
  About,
  Certificates,
  Experience,
  Skill,
} from '../../models/portfolio.models';

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

  constructor(
    public portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.getPortfolioDetails();
  }

  getPortfolioDetails() {
    const user = localStorage.getItem('user');
    if (user) {
      const userId = JSON.parse(user).userId;
      if (userId) {
        this.portfolioService.getUserPortfolio(userId).subscribe(
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

    if (!this.aboutObj.profileImageUrl) {
      // If no URL given, assign default image before saving
      this.aboutObj.profileImageUrl = `images/portfolio_profile_img.png`;
    }

    this.portfolioService.createAbout(this.aboutObj).subscribe(
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
    this.experienceObj.portfolioId = this.portfolioDetails.id;

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
      (res: Skill) => {
        console.log('Skill Create successfully: ', res);
        this.ngZone.run(() => {
          this.nextStep();
        });
      },
      (error: any) => {
        console.log('Error creating Skill: ', error);
      }
    );
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
      this.portfolioDetails.about.description == ''
    ) {
      this.currentStep = 2;
    } else if (
      !this.portfolioDetails.experiences ||
      this.portfolioDetails.experiences.length === 0
    ) {
      this.currentStep = 3;
    } else if (
      !this.portfolioDetails.projects ||
      this.portfolioDetails.projects.length === 0
    ) {
      this.currentStep = 4;
    } else if (
      !this.portfolioDetails.certificates ||
      this.portfolioDetails.certificates.length === 0
    ) {
      this.currentStep = 5;
    } else {
      this.currentStep = 6; // All done
    }
  }
}
