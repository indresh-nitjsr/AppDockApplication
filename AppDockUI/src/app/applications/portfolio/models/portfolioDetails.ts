import { UserPortfolio } from './userPortfolio';

export class PortfolioDetails {
  userId: string;
  portfolioId: string;
  portfolio: UserPortfolio;
  about: About;

  constructor() {
    this.userId = '';
    this.portfolioId = '';
    this.portfolio = new UserPortfolio();
    this.about = new About();
  }
}

export class About {
  heading: string;
  profilePicture: string;
  aboutMe: string;

  constructor() {
    this.aboutMe = '';
    this.heading = '';
    this.profilePicture = '';
  }
}
