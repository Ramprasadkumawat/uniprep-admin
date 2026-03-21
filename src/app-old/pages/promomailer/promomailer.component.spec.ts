import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromomailerComponent } from './promomailer.component';

describe('PromomailerComponent', () => {
  let component: PromomailerComponent;
  let fixture: ComponentFixture<PromomailerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromomailerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromomailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
