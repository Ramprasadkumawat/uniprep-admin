import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesmanagementComponent } from './rolesmanagement.component';

describe('RolesmanagementComponent', () => {
  let component: RolesmanagementComponent;
  let fixture: ComponentFixture<RolesmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesmanagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
