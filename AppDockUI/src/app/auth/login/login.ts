import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { LoginModel, User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth-service';
import { FormsModule } from '@angular/forms';
import { RedirectCommand, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  isLogin: boolean = true; // true for login, false for register
  registerObj: User = new User();
  loginObj: LoginModel = new LoginModel();

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  //toggle register and login forms
  toggleForm() {
    this.isLogin = !this.isLogin;
  }

  //register user
  userRegister() {
    // Logic for registering a user
    this.authService.registerUser(this.registerObj).subscribe({
      next: (response) => {
        this.toggleForm();
        this.cdr.detectChanges();
      },
      error: (error) => {
        alert(
          'Registration failed: ' + (error.error.message || 'Unknown error')
        );
      },
    });
  }

  userLogin() {
    this.authService.loginUser(this.loginObj).subscribe({
      next: (response: any) => {
        // Store token and user information in local storage
        if (
          !response.results ||
          !response.results.token ||
          !response.results.user
        ) {
          alert('Login failed: Invalid response');
          return;
        }
        const token = response.results.token;
        const user = response.results.user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        //set current endpoint to local storage to navigate after login
        const returnUrl = localStorage.getItem('returnUrl') || '/';
        localStorage.removeItem('returnUrl');
        this.router.navigate([returnUrl]);
        this.cdr.detectChanges();
      },
      error: (error) => {
        alert('Login failed: ' + (error.error.message || 'Unknown error'));
      },
    });
  }
}
