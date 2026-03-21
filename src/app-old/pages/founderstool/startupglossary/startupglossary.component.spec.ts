import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartupglossaryComponent } from './startupglossary.component';

describe('StartupglossaryComponent', () => {
  let component: StartupglossaryComponent;
  let fixture: ComponentFixture<StartupglossaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartupglossaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartupglossaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
