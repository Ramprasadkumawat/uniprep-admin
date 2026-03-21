import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreappcatComponent } from './preappcat.component';

describe('PreappcatComponent', () => {
  let component: PreappcatComponent;
  let fixture: ComponentFixture<PreappcatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PreappcatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreappcatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
