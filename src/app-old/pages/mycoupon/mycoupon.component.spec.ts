import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MycouponComponent } from './mycoupon.component';

describe('MycouponComponent', () => {
  let component: MycouponComponent;
  let fixture: ComponentFixture<MycouponComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MycouponComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MycouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
