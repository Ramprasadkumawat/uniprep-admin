import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyCompanyAccountComponent } from './verify-company-account.component';

describe('VerifyCompanyAccountComponent', () => {
  let component: VerifyCompanyAccountComponent;
  let fixture: ComponentFixture<VerifyCompanyAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyCompanyAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyCompanyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
