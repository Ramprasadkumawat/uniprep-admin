import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseSubscriptionComponent } from './enterprise-subscription.component';

describe('EnterpriseSubscriptionComponent', () => {
  let component: EnterpriseSubscriptionComponent;
  let fixture: ComponentFixture<EnterpriseSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterpriseSubscriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterpriseSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
