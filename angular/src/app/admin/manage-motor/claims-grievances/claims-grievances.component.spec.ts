import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsGrievancesComponent } from './claims-grievances.component';

describe('ClaimsGrievancesComponent', () => {
  let component: ClaimsGrievancesComponent;
  let fixture: ComponentFixture<ClaimsGrievancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimsGrievancesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsGrievancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
