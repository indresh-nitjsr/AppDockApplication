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
    console.log('Creating user portfolio:', obj);
    return this.http.post<UserPortfolio>(`${this.BaseUrl}/portfolio`, obj);
  }

  getUserPortfolioByPortfolioId(
    portfolioId: string
  ): Observable<PortfolioDetails> {
    console.log('Fetching portfolio for user ID:', portfolioId);
    return this.http.get<PortfolioDetails>(
      `${this.BaseUrl}/portfolio/${portfolioId}`
    );
  }

  getUserPortfolioByUserId(userId: string): Observable<PortfolioDetails> {
    console.log('Fetching portfolio for user ID:', userId);
    return this.http.get<PortfolioDetails>(
      `${this.BaseUrl}/portfolio/user/${userId}`
    );
  }

  //About operations
  createUpdateAbout(obj: About): Observable<About> {
    console.log('Creating About portfolio: ', obj);
    return this.http.post<About>(`${this.BaseUrl}/about`, obj);
  }

  //Experience operation
  createExperience(obj: Experience): Observable<Experience> {
    console.log('Creating Experience portfolio: ', obj);
    return this.http.post<Experience>(`${this.BaseUrl}/experience`, obj);
  }

  updateExperience(obj: Experience): Observable<Experience> {
    console.log('updating Experience portfolio: ', obj);
    return this.http.put<Experience>(`${this.BaseUrl}/experience`, obj);
  }

  //Certificates Operation
  createCertificate(obj: Certificates): Observable<Certificates> {
    console.log('Creating Certificates portfolio: ', obj);
    return this.http.post<Certificates>(`${this.BaseUrl}/certificates`, obj);
  }

  updateCertificate(
    certificateId: string,
    obj: Certificates
  ): Observable<Certificates> {
    console.log('updating Certificates portfolio: ', obj);
    return this.http.put<Certificates>(
      `${this.BaseUrl}/certificates/${certificateId}`,
      obj
    );
  }

  //Skill Operation
  createSkill(obj: Skill): Observable<Skill> {
    console.log('Creating Skill portfolio: ', obj);
    return this.http.post<Skill>(`${this.BaseUrl}/skill`, obj);
  }

  getSkillsByPortfolioId(portfolioId: string): Observable<string> {
    console.log('Fetching portfolio for user ID:', portfolioId);
    return this.http.get<string>(
      `${this.BaseUrl}/skill/portfolio/${portfolioId}`
    );
  }

  updateSkill(obj: Skill): Observable<Skill> {
    console.log('updating Skill portfolio: ', obj);
    return this.http.put<Skill>(`${this.BaseUrl}/skill`, obj);
  }

  //Project operations
  createProject(obj: Projects): Observable<Projects> {
    console.log('Creating Project portfolio::', obj);
    return this.http.post<Projects>(`${this.BaseUrl}/project`, obj);
  }

  updateProject(obj: Projects): Observable<Projects> {
    console.log('updating Project portfolio::', obj);
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
