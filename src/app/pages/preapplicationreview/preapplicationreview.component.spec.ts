import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreapplicationreviewComponent } from './preapplicationreview.component';

describe('PreapplicationreviewComponent', () => {
  let component: PreapplicationreviewComponent;
  let fixture: ComponentFixture<PreapplicationreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PreapplicationreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreapplicationreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
