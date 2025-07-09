export class PortfolioDetails {
  id: number;
  role: string;
  dob: Date;
  user: User;
  about: About;

  constructor() {
    this.id = 0;
    this.role = '';
    this.dob = new Date();
    this.about = new About();
    this.user = new User();
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
