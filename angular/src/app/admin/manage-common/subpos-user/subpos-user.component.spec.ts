import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdpUserComponent } from './subdp-user.component';

describe('SubdpUserComponent', () => {
  let component: SubdpUserComponent;
  let fixture: ComponentFixture<SubdpUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubdpUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubdpUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
