import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostAdmissionComponent } from './post-admission.component';

describe('PostAdmissionComponent', () => {
  let component: PostAdmissionComponent;
  let fixture: ComponentFixture<PostAdmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostAdmissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostAdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
