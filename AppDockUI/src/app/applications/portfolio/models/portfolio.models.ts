export class PortfolioDetails {
  id: string;
  role: string;
  dob: Date;
  user: User;
  about: About;
  projects?: Projects[];
  certificates?: Certificates[];
  experiences: Experience[];
  skills: Skill[];

  constructor() {
    this.id = '';
    this.role = '';
    this.dob = new Date();
    this.about = new About();
    this.user = new User();
    this.projects = [];
    this.certificates = [];
    this.experiences = [];
    this.skills = [];
  }
}

export class About {
  heading: string;
  description: string;
  profileImageUrl: string;
  userId: string;
  portfolioId: string;

  constructor() {
    this.description = '';
    this.heading = '';
    this.profileImageUrl = '';
    this.userId = '';
    this.portfolioId = '';
  }
}

export class User {
  userId: string;
  email: string;
  name: string;
  phoneNumber: string;

  constructor() {
    this.userId = '';
    this.email = '';
    this.name = '';
    this.phoneNumber = '';
  }
}

export class Projects {
  projectId: string;
  portfolioId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  techStack: string[];
  role: string;
  liveLink: string;
  repoLink: string;

  constructor() {
    this.projectId = '';
    this.title = '';
    this.portfolioId = '';
    this.description = '';
    this.startDate = new Date();
    this.endDate = new Date();
    this.techStack = [];
    this.role = '';
    this.liveLink = '';
    this.repoLink = '';
  }
}

export class Certificates {
  id: string;
  portfolioId: string;
  title: string;
  description: string;
  issueDate: Date;
  expiryDate?: Date;
  issuer: string;
  certificateUrl: string;
  type: string;

  constructor() {
    this.id = '';
    this.portfolioId = '';
    this.title = '';
    this.description = '';
    this.issueDate = new Date();
    this.expiryDate = undefined;
    this.issuer = '';
    this.certificateUrl = '';
    this.type = '';
  }
}

export class Experience {
  id: string;
  portfolioId: string;
  title: string;
  employementType: string;
  companyName: string;
  isCurrentlyWorking: boolean;
  startDate: Date;
  endDate?: Date | undefined;
  description: string;

  constructor() {
    this.id = '';
    this.portfolioId = '';
    this.title = '';
    this.employementType = '';
    this.companyName = '';
    this.isCurrentlyWorking = false;
    this.startDate = new Date();
    this.endDate = new Date();
    this.description = '';
  }
}

export class Skill {
  skillId: string;
  portfolioId: string;
  skills: string;

  constructor() {
    this.skillId = '';
    this.portfolioId = '';
    this.skills = '';
  }
}
