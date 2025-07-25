import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginModel, User } from '../models/user.model';
import { Login } from '../../auth/login/login';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  BaseUrl = 'http://localhost:5064/api/auth';

  loginUser(obj: LoginModel) {
    return this.http.post(`${this.BaseUrl}/login`, obj, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  registerUser(obj: User) {
    return this.http.post(`${this.BaseUrl}/register`, obj);
  }

  verifyEmail(userId: string, token: string): Observable<any> {
    const params = new HttpParams().set('userId', userId).set('token', token);

    return this.http.get(`${this.BaseUrl}/verify-email`, {
      params,
      responseType: 'text' as 'json', // ✅ force Angular to treat it correctly
    });
  }
}
