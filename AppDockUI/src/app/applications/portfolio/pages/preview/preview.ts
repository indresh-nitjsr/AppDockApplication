import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preview',
  imports: [],
  templateUrl: './preview.html',
  styleUrl: './preview.css',
})
export class Preview {
  constructor(private router: Router) {}

  handleGetStarted() {
    console.log('localstorage: ', localStorage);
    const token = localStorage.getItem('token');

    if (token) {
      this.router.navigate(['services/portfolio/create']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
