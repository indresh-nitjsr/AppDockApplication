export class PortfolioDetails {
  id: number;
  role: string;
  dob: Date;
  user: User;
  about: About;
  projects?: Projects[];
  certificates?: Certificates[];

  constructor() {
    this.id = 0;
    this.role = '';
    this.dob = new Date();
    this.about = new About();
    this.user = new User();
    this.projects = [];
    this.certificates = [];
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
    return obj;
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

  constructor() {
    this.id = '';
    this.portfolioId = '';
    this.title = '';
    this.description = '';
    this.issueDate = new Date();
    this.expiryDate = undefined;
    this.issuer = '';
    this.certificateUrl = '';
  }
}
