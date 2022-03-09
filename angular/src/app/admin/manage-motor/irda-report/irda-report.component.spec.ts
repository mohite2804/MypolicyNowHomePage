import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrdaReportComponent } from './irda-report.component';

describe('IrdaReportComponent', () => {
  let component: IrdaReportComponent;
  let fixture: ComponentFixture<IrdaReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IrdaReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IrdaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
