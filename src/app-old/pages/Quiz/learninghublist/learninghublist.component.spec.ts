import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearninghublistComponent } from './learninghublist.component';

describe('LearninghublistComponent', () => {
  let component: LearninghublistComponent;
  let fixture: ComponentFixture<LearninghublistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearninghublistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearninghublistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
