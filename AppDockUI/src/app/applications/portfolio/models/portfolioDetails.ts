export class PortfolioDetails {
  id: string;
  role: string;
  dob: Date;
  user: User;
  about: About;
  projects: Projects[];
  certificates: Certificates[];
  skills: Skills[];
  experiences: Experience[];
  contact: Contact;

  constructor() {
    this.id = '';
    this.role = '';
    this.dob = new Date();
    this.about = new About();
    this.user = new User();
    this.projects = [];
    this.certificates = [];
    this.skills = [];
    this.experiences = [];
    this.contact = new Contact();
  }

  static fromJson(json: any): PortfolioDetails {
    const obj = new PortfolioDetails();
    obj.id = json.id;
    obj.role = json.role;
    obj.dob = new Date(json.dob);
    obj.user = Object.assign(new User(), json.user);
    obj.about = json.about
      ? Object.assign(new About(), json.about)
      : new About();
    obj.projects = json.projects
      ? json.projects.map((project: any) =>
          Object.assign(new Projects(), project)
        )
      : [];
    obj.certificates = json.certificates
      ? json.certificates.map((certificate: any) =>
          Object.assign(new Certificates(), certificate)
        )
      : [];
    obj.skills = json.skills
      ? json.skills.map((skill: any) => Object.assign(new Skills(), skill))
      : [];
    obj.experiences = json.experiences
      ? json.experiences.map((experience: any) =>
          Object.assign(new Experience(), experience)
        )
      : [];
    obj.contact = json.contact
      ? Object.assign(new Contact(), json.contact)
      : new Contact();
    return obj;
  }
}

export class About {
  heading: string;
  profileImageUrl: string;
  description: string;
  facts?: string[];

  constructor() {
    this.description = '';
    this.heading = '';
    this.profileImageUrl = '';
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
  id: string;
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
    this.id = '';
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

export class Skills {
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
