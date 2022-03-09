import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPrivilegeComponent } from './menu-privilege.component';

describe('MenuPrivilegeComponent', () => {
  let component: MenuPrivilegeComponent;
  let fixture: ComponentFixture<MenuPrivilegeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuPrivilegeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPrivilegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
