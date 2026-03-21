import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagehblistComponent } from './languagehblist.component';

describe('LanguagehblistComponent', () => {
  let component: LanguagehblistComponent;
  let fixture: ComponentFixture<LanguagehblistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanguagehblistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguagehblistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
