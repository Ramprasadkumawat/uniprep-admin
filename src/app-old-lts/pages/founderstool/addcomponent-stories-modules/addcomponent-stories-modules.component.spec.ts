import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcomponentStoriesModulesComponent } from './addcomponent-stories-modules.component';

describe('AddcomponentStoriesModulesComponent', () => {
  let component: AddcomponentStoriesModulesComponent;
  let fixture: ComponentFixture<AddcomponentStoriesModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcomponentStoriesModulesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddcomponentStoriesModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
