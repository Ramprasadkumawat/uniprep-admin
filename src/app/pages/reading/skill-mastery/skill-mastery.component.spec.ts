import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillMasteryComponent } from './skill-mastery.component';

describe('SkillMasteryComponent', () => {
  let component: SkillMasteryComponent;
  let fixture: ComponentFixture<SkillMasteryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillMasteryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillMasteryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
