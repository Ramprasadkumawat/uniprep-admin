import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreApplicationComponent } from './pre-application.component';

describe('PreApplicationComponent', () => {
  let component: PreApplicationComponent;
  let fixture: ComponentFixture<PreApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreApplicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
