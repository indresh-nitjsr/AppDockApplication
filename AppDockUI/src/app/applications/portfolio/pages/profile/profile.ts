import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { Header } from '../../layouts/header/header';
import { PortfolioDetails as PortfolioDetailsModel } from '../../models/portfolioDetails';
import { PortfolioService } from '../../services/portfolioService';

@Component({
  selector: 'app-profile',
  imports: [Header],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  portfolioDetails: PortfolioDetailsModel = new PortfolioDetailsModel();

  constructor(
    private portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) { }


}
