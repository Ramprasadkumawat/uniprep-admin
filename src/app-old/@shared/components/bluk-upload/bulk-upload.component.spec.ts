import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlukUploadComponent } from './bulk-upload.component';

describe('BlukUploadComponent', () => {
  let component: BlukUploadComponent;
  let fixture: ComponentFixture<BlukUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlukUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlukUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
