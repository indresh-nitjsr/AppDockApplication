import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserPortfolio } from '../models/userPortfolio';
import { Observable } from 'rxjs';

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

  getUserPortfolio(userId: string): Observable<UserPortfolio> {
    console.log('Fetching user portfolio for userId:', userId);
    return this.http.get<UserPortfolio>(`${this.BaseUrl}/${userId}`);
  }
}
