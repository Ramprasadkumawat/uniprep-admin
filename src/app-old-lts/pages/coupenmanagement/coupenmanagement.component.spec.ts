import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoupenmanagementComponent } from './coupenmanagement.component';

describe('CoupenmanagementComponent', () => {
  let component: CoupenmanagementComponent;
  let fixture: ComponentFixture<CoupenmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoupenmanagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoupenmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
