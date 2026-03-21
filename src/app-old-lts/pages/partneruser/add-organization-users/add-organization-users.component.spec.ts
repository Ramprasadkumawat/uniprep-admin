import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrganizationUsersComponent } from './add-organization-users.component';

describe('AddOrganizationUsersComponent', () => {
  let component: AddOrganizationUsersComponent;
  let fixture: ComponentFixture<AddOrganizationUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOrganizationUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOrganizationUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
