import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurManagementsComponent } from './our-managements.component';

describe('OurManagementsComponent', () => {
  let component: OurManagementsComponent;
  let fixture: ComponentFixture<OurManagementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OurManagementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurManagementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
