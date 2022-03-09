import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflinePolicyComponent } from './offline-policy.component';

describe('OfflinePolicyComponent', () => {
  let component: OfflinePolicyComponent;
  let fixture: ComponentFixture<OfflinePolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflinePolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflinePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
