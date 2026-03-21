import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringSupportComponent } from './hiring-support.component';

describe('HiringSupportComponent', () => {
  let component: HiringSupportComponent;
  let fixture: ComponentFixture<HiringSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiringSupportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiringSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
