import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsysetemchatComponent } from './reportsysetemchat.component';

describe('ReportsysetemchatComponent', () => {
  let component: ReportsysetemchatComponent;
  let fixture: ComponentFixture<ReportsysetemchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsysetemchatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsysetemchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
