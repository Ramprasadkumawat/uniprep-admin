import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditsheetComponent } from './creditsheet.component';

describe('CreditsheetComponent', () => {
  let component: CreditsheetComponent;
  let fixture: ComponentFixture<CreditsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditsheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
