import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpnComissionSummaryComponent } from './mpn-comission-summary.component';

describe('MpnComissionSummaryComponent', () => {
  let component: MpnComissionSummaryComponent;
  let fixture: ComponentFixture<MpnComissionSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MpnComissionSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MpnComissionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
