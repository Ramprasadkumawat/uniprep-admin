import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsadminComponent } from './blogsadmin.component';

describe('BlogsadminComponent', () => {
  let component: BlogsadminComponent;
  let fixture: ComponentFixture<BlogsadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogsadminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogsadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
