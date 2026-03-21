import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageHubComponent } from './language-hub.component';

describe('LanguageHubComponent', () => {
  let component: LanguageHubComponent;
  let fixture: ComponentFixture<LanguageHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanguageHubComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
