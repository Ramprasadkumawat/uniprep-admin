import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentSupportComponent } from './talent-support.component';

describe('TalentSupportComponent', () => {
  let component: TalentSupportComponent;
  let fixture: ComponentFixture<TalentSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalentSupportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalentSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
