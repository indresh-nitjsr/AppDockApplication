export class PortfolioDetails {
  id: string;
  role: string;
  dob: Date;
  user: User;
  about: About;
  projects?: Projects[];
  certificates?: Certificates[];
  skills: Skills[];
  experiences: Experience[];

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
    return obj;
  }
}

export class About {
  heading: string;
  profileImageUrl: string;
  description: string;

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
  startDate: Date;
  endDate: Date;
  techStack: string[];
  role: string;
  liveLink: string;
  repoLink: string;

  constructor() {
    this.id = '';
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

export class Skills {
  skillId: string;
  portfolioId: string;
  skills: string;

  constructor() {
    this.skillId = '';
    this.portfolioId = '';
    this.skills = '';
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
  endDate?: Date;
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
