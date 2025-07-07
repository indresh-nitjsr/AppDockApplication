import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginModel, User } from '../models/user.model';
import { Login } from '../../auth/login/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  BaseUrl = 'http://localhost:5064/api/auth';

  loginUser(obj: LoginModel) {
    return this.http.post(`${this.BaseUrl}/login`, obj);
  }

  registerUser(obj: User) {
    console.log('Payload sent to backend:', obj); // Debugging line
    return this.http.post(`${this.BaseUrl}/register`, obj);
  }
}
