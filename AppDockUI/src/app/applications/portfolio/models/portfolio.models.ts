export class PortfolioDetails {
  id: string;
  role: string;
  dob: Date;
  user: User;
  about: About;
  projects: Projects[];
  certificates: Certificates[];
  experiences: Experience[];
  skills: Skill[];
  contact: Contact;

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
    this.contact = new Contact();
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
  startDate?: Date | null;
  endDate?: Date | null;
  techStack: string[];
  role: string;
  liveLink: string;
  repoLink: string;

  constructor() {
    this.projectId = '';
    this.title = '';
    this.portfolioId = '';
    this.description = '';
    this.startDate = null;
    this.endDate = null;
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
  issueDate?: Date | null;
  expiryDate?: Date | null;
  issuer: string;
  certificateUrl: string;
  type: string;

  constructor() {
    this.id = '';
    this.portfolioId = '';
    this.title = '';
    this.description = '';
    this.issueDate = null;
    this.expiryDate = null;
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
  startDate?: Date | null;
  endDate?: Date | null;
  description: string;

  constructor() {
    this.id = '';
    this.portfolioId = '';
    this.title = '';
    this.employementType = '';
    this.companyName = '';
    this.isCurrentlyWorking = false;
    this.startDate = null;
    this.endDate = null;
    this.description = '';
  }
}

export class Skill {
  skillId: string;
  portfolioId: string;
  skills: string;
  proficiency: number;

  constructor() {
    this.skillId = '';
    this.portfolioId = '';
    this.skills = '';
    this.proficiency = 0;
  }
}

export class Contact {
  id: string;
  portfolioId: string;
  userId: string;
  address: string;
  linkedInUrl: string;
  gitHubUrl: string;
  twitterUrl: string;

  constructor() {
    this.id = '';
    this.portfolioId = '';
    this.userId = '';
    this.address = '';
    this.linkedInUrl = '';
    this.gitHubUrl = '';
    this.twitterUrl = '';
  }
}
