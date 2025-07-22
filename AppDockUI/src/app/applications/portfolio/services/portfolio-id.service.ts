// portfolio-id.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PortfolioIdService {
  private portfolioId: string | null = localStorage.getItem('portfolioId');

  setPortfolioId(id: string) {
    this.portfolioId = id;
    localStorage.setItem('portfolioId', id);
  }

  getPortfolioId(): string | null {
    return this.portfolioId;
  }
}
