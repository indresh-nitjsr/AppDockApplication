import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  onAuthButtonClick() {
    localStorage.setItem('returnUrl', this.router.url); // Clear returnUrl on logout
    console.log('returnUrl: ', this.router.url);
    if (this.isLoggedIn()) {
      localStorage.clear();
      this.router.navigate(['/auth/login']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
