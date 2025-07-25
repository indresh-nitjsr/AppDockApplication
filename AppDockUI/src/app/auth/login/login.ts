import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { LoginModel, User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth-service';
import { FormsModule } from '@angular/forms';
import { RedirectCommand, Router } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';

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
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
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
        this.toastService.show(
          'Registration Successful, Verification link sent. Please verify your email',
          'success',
          4000
        );
        this.toggleForm();
        this.cdr.detectChanges();
      },
      error: (error) => {
        const message =
          error?.error?.message || 'Registration failed. Please try again.';
        this.toastService.show(message, 'error', 4000);
      },
    });
  }

  userLogin() {
    this.authService.loginUser(this.loginObj).subscribe({
      next: (response: any) => {
        const token = response.results?.token;
        const user = response.results?.user;

        if (!token || !user) {
          return;
        }
        if (!user.isEmailVerified) {
          this.toastService.show(
            'Email Not verified, Please Verify you email',
            'warning',
            3000
          );
          return;
        }
        this.toastService.show('Logged in Successfully', 'success', 3000);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        const returnUrl = localStorage.getItem('returnUrl') || '/';
        localStorage.removeItem('returnUrl');
        this.router.navigate([returnUrl]);
        this.cdr.detectChanges();
      },
      error: (error) => {
        const backendMsg =
          error?.error?.message || error?.error || 'Login failed. Try again.';
        this.toastService.show(backendMsg, 'error', 4000);
      },
    });
  }
}
