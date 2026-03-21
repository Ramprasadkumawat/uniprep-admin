import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageHubSubcategoryComponent } from './language-hub-subcategory.component';

describe('LanguageHubSubcategoryComponent', () => {
  let component: LanguageHubSubcategoryComponent;
  let fixture: ComponentFixture<LanguageHubSubcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanguageHubSubcategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageHubSubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
