import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsticketlistComponent } from './ticketsticketlist.component';

describe('TicketsticketlistComponent', () => {
  let component: TicketsticketlistComponent;
  let fixture: ComponentFixture<TicketsticketlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsticketlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketsticketlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
