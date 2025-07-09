import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserPortfolio } from '../models/userPortfolio';
import { Observable } from 'rxjs';
import { PortfolioDetails } from '../models/portfolioDetails';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  constructor(private http: HttpClient) {}
  BaseUrl = 'http://localhost:5297/api/portfolio';

  createUserPortfolio(obj: UserPortfolio): Observable<UserPortfolio> {
    console.log('Creating user portfolio:', obj);
    return this.http.post<UserPortfolio>(`${this.BaseUrl}`, obj);
  }

  getUserPortfolio(userId: string): Observable<PortfolioDetails> {
    console.log('Fetching portfolio for user ID:', userId);
    return this.http.get<PortfolioDetails>(`${this.BaseUrl}/${userId}`);
  }
}
