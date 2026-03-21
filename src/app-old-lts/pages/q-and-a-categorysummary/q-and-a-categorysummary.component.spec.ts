import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QAndACategorysummaryComponent } from './q-and-a-categorysummary.component';

describe('QAndACategorysummaryComponent', () => {
  let component: QAndACategorysummaryComponent;
  let fixture: ComponentFixture<QAndACategorysummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QAndACategorysummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QAndACategorysummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
