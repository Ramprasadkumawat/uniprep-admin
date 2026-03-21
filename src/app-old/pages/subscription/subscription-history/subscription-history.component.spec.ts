import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsriptionHistoryComponent } from './subscription-history.component';

describe('SubsriptionHistoryComponent', () => {
  let component: SubsriptionHistoryComponent;
  let fixture: ComponentFixture<SubsriptionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SubsriptionHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubsriptionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
