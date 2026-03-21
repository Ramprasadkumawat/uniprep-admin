import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoupenleadlistComponent } from './coupenleadlist.component';

describe('CoupenleadlistComponent', () => {
  let component: CoupenleadlistComponent;
  let fixture: ComponentFixture<CoupenleadlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoupenleadlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoupenleadlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
