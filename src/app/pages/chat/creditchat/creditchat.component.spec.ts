import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditchatComponent } from './creditchat.component';

describe('CreditchatComponent', () => {
  let component: CreditchatComponent;
  let fixture: ComponentFixture<CreditchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditchatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
