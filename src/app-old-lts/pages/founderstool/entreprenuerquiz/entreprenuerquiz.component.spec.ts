import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntreprenuerquizComponent } from './entreprenuerquiz.component';

describe('EntreprenuerquizComponent', () => {
  let component: EntreprenuerquizComponent;
  let fixture: ComponentFixture<EntreprenuerquizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntreprenuerquizComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntreprenuerquizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
