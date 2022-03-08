import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationHealthComponent } from './cancellation-health.component';

describe('CancellationHealthComponent', () => {
  let component: CancellationHealthComponent;
  let fixture: ComponentFixture<CancellationHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancellationHealthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancellationHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
