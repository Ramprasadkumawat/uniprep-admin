import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutManagerComponent } from './payout-manager.component';

describe('PayoutManagerComponent', () => {
  let component: PayoutManagerComponent;
  let fixture: ComponentFixture<PayoutManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayoutManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayoutManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
