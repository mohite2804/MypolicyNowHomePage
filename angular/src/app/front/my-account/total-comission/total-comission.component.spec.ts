import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalComissionComponent } from './total-comission.component';

describe('TotalComissionComponent', () => {
  let component: TotalComissionComponent;
  let fixture: ComponentFixture<TotalComissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalComissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalComissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
