import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqCatComponent } from './faq-cat.component';

describe('FaqCatComponent', () => {
  let component: FaqCatComponent;
  let fixture: ComponentFixture<FaqCatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqCatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
