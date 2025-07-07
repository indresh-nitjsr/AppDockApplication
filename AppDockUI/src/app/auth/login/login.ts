import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginModel, User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth-service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  isLogin = true;
  registerObj: User = new User();
  loginObj: LoginModel = new LoginModel();

  //toggle register and login forms
  toggleForm() {
    this.isLogin = !this.isLogin;
  }
  constructor(private authService: AuthService, private router: Router) {}

  //register user
  userRegister() {
    // Logic for registering a user
    this.authService.registerUser(this.registerObj).subscribe({
      next: (response) => {
        this.toggleForm();
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
      },
      error: (error) => {
        alert('Login failed: ' + (error.error.message || 'Unknown error'));
      },
    });
  }
}
