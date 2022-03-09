import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdSpecialDiscountComponent } from './od-special-discount.component';

describe('OdSpecialDiscountComponent', () => {
  let component: OdSpecialDiscountComponent;
  let fixture: ComponentFixture<OdSpecialDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdSpecialDiscountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OdSpecialDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
