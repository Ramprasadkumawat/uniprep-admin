import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationuserlistComponent } from './certificationuserlist.component';

describe('CertificationuserlistComponent', () => {
  let component: CertificationuserlistComponent;
  let fixture: ComponentFixture<CertificationuserlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificationuserlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificationuserlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
