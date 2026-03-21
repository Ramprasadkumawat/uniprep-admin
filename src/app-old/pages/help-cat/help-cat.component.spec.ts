import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpCatComponent } from './help-cat.component';

describe('HelpCatComponent', () => {
  let component: HelpCatComponent;
  let fixture: ComponentFixture<HelpCatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpCatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
