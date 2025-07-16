import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from './layouts/header/header'
import { Profile } from './pages/profile/profile';

@Component({
  selector: 'app-portfolio-shell',
  imports: [RouterModule, Header],
  templateUrl: './portfolio-shell.html',
  styleUrl: './portfolio-shell.css'
})
export class PortfolioShell {

}
