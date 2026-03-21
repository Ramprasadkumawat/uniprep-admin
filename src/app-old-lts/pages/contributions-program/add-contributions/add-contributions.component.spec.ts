import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContributionsComponent } from './add-contributions.component';

describe('ContributionsListComponent', () => {
  let component: AddContributionsComponent;
  let fixture: ComponentFixture<AddContributionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddContributionsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddContributionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
