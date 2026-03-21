import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageHubSubmoduleComponent } from './language-hub-submodule.component';

describe('LanguageHubSubmoduleComponent', () => {
  let component: LanguageHubSubmoduleComponent;
  let fixture: ComponentFixture<LanguageHubSubmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanguageHubSubmoduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageHubSubmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
