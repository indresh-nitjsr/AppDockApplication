import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  imports: [CommonModule],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmail {
  message = 'Verifying your email...';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const userId = params['userId'];
      const token = params['token'];

      if (userId && token) {
        this.verifyEmail(userId, token);
      } else {
        this.loading = false;
        this.message = 'Invalid verification link.';
      }
    });
  }

  verifyEmail(userId: string, token: string): void {
    this.loading = true;
    this.authService.verifyEmail(userId, token).subscribe({
      next: (res) => {
        this.message = res || 'Email verified successfully!';
        this.loading = false;
        this.autoHideMessage();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.message = err.error || 'Verification failed.';
        this.loading = false;
        this.autoHideMessage();
        this.cdr.detectChanges();
      },
    });
  }

  retry(): void {
    // Reload current route params and re-trigger verification
    this.ngOnInit();
  }

  autoHideMessage(): void {
    setTimeout(() => {
      this.message = '';
    }, 15000); // Clear message after 15 seconds
  }

  isSuccess(): boolean {
    return this.message?.toLowerCase().includes('success') ?? false;
  }

  isError(): boolean {
    const msg = this.message?.toLowerCase();
    return (msg?.includes('invalid') || msg?.includes('failed')) ?? false;
  }

  isInfo(): boolean {
    const msg = this.message?.toLowerCase();
    return msg?.includes('already verified') ?? false;
  }
}
