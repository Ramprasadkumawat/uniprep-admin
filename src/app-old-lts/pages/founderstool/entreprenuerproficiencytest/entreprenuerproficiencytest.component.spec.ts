import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntreprenuerproficiencytestComponent } from './entreprenuerproficiencytest.component';

describe('EntreprenuerproficiencytestComponent', () => {
  let component: EntreprenuerproficiencytestComponent;
  let fixture: ComponentFixture<EntreprenuerproficiencytestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntreprenuerproficiencytestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntreprenuerproficiencytestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
