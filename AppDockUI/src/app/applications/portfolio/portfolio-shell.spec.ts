import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortfolioShell } from './portfolio-shell';

describe('PortfolioShell', () => {
  let component: PortfolioShell;
  let fixture: ComponentFixture<PortfolioShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioShell]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PortfolioShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
