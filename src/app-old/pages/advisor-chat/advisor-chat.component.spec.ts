import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisorChatComponent } from './advisor-chat.component';

describe('AdvisorChatComponent', () => {
  let component: AdvisorChatComponent;
  let fixture: ComponentFixture<AdvisorChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvisorChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvisorChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
