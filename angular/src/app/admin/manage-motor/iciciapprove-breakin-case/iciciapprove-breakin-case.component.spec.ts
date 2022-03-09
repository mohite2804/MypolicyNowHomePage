import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IciciapproveBreakinCaseComponent } from './icici-breakin.component';

describe('IciciapproveBreakinCaseComponent', () => {
  let component: IciciapproveBreakinCaseComponent;
  let fixture: ComponentFixture<IciciapproveBreakinCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IciciapproveBreakinCaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IciciapproveBreakinCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
