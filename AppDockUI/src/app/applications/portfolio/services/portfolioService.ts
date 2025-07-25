import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserPortfolio } from '../models/userPortfolio';
import { Observable } from 'rxjs';
import {
  About,
  Certificates,
  Contact,
  Experience,
  PortfolioDetails,
  Projects,
  Skill,
} from '../models/portfolio.models';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  constructor(private http: HttpClient) {}
  BaseUrl = 'http://localhost:5297/api';

  // portfolio operations
  createUserPortfolio(obj: UserPortfolio): Observable<UserPortfolio> {
    return this.http.post<UserPortfolio>(`${this.BaseUrl}/portfolio`, obj);
  }

  getUserPortfolioByPortfolioId(
    portfolioId: string
  ): Observable<PortfolioDetails> {
    return this.http.get<PortfolioDetails>(
      `${this.BaseUrl}/portfolio/${portfolioId}`
    );
  }

  getUserPortfolioByUserId(userId: string): Observable<PortfolioDetails> {
    return this.http.get<PortfolioDetails>(
      `${this.BaseUrl}/portfolio/user/${userId}`
    );
  }

  //About operations
  createUpdateAbout(obj: About): Observable<About> {
    return this.http.post<About>(`${this.BaseUrl}/about`, obj);
  }

  //Experience operation
  createExperience(obj: Experience): Observable<Experience> {
    console.log('sending exp to backend: ', obj);

    return this.http.post<Experience>(`${this.BaseUrl}/experience`, obj);
  }

  updateExperience(obj: Experience): Observable<Experience> {
    return this.http.put<Experience>(`${this.BaseUrl}/experience`, obj);
  }

  //Certificates Operation
  createCertificate(obj: Certificates): Observable<Certificates> {
    return this.http.post<Certificates>(`${this.BaseUrl}/certificates`, obj);
  }

  updateCertificate(
    certificateId: string,
    obj: Certificates
  ): Observable<Certificates> {
    return this.http.put<Certificates>(
      `${this.BaseUrl}/certificates/${certificateId}`,
      obj
    );
  }

  //Skill Operation
  createSkill(obj: Skill): Observable<Skill> {
    return this.http.post<Skill>(`${this.BaseUrl}/skill`, obj);
  }

  getSkillsByPortfolioId(portfolioId: string): Observable<string> {
    return this.http.get<string>(
      `${this.BaseUrl}/skill/portfolio/${portfolioId}`
    );
  }

  updateSkill(obj: Skill): Observable<Skill> {
    return this.http.put<Skill>(`${this.BaseUrl}/skill`, obj);
  }

  //Project operations
  createProject(obj: Projects): Observable<Projects> {
    return this.http.post<Projects>(`${this.BaseUrl}/project`, obj);
  }

  updateProject(obj: Projects): Observable<Projects> {
    return this.http.put<Projects>(`${this.BaseUrl}/project`, obj);
  }

  //Contact Operations
  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(`${this.BaseUrl}/contact`, contact);
  }

  updateContact(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.BaseUrl}/contact`, contact);
  }
}
