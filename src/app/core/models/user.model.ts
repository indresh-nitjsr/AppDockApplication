export class User {
  userName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string = 'User'; // Default role

  constructor() {
    this.userName = '';
    this.email = '';
    this.password = '';
    this.phoneNumber = '';
  }
}

export class LoginModel {
  email: string;
  password: string;

  constructor() {
    this.email = '';
    this.password = '';
  }
}
