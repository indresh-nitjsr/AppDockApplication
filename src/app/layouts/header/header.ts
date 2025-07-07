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
    const currentUrl = this.router.url; // 👈 capture current URL
    localStorage.setItem('returnUrl', currentUrl);

    if (this.isLoggedIn()) {
      localStorage.removeItem('token');
      this.router.navigate(['/auth/login']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
