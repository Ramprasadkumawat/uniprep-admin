import { ComponentFixture, TestBed } from '@angular/core/testing';

import { K12ChapterComponent } from './k12-chapter.component';

describe('K12ChapterComponent', () => {
  let component: K12ChapterComponent;
  let fixture: ComponentFixture<K12ChapterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ K12ChapterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(K12ChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
