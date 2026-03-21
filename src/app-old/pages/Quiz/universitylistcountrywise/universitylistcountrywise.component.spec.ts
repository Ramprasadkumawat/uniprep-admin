import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversitylistcountrywiseComponent } from './universitylistcountrywise.component';

describe('UniversitylistcountrywiseComponent', () => {
  let component: UniversitylistcountrywiseComponent;
  let fixture: ComponentFixture<UniversitylistcountrywiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniversitylistcountrywiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversitylistcountrywiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
