import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QAndASummaryComponent } from './q-and-asummary.component';

describe('QAndASummaryComponent', () => {
  let component: QAndASummaryComponent;
  let fixture: ComponentFixture<QAndASummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QAndASummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QAndASummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
