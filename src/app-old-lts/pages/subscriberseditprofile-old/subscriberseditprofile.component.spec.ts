import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberseditprofileComponent } from './subscriberseditprofile.component';

describe('SubscriberseditprofileComponent', () => {
  let component: SubscriberseditprofileComponent;
  let fixture: ComponentFixture<SubscriberseditprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriberseditprofileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriberseditprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
