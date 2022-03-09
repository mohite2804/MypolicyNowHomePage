import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IciciBreakinComponent } from './icici-breakin.component';

describe('IciciBreakinComponent', () => {
  let component: IciciBreakinComponent;
  let fixture: ComponentFixture<IciciBreakinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IciciBreakinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IciciBreakinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
