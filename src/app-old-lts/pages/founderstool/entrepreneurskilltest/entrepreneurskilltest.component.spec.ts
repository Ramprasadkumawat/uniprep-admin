import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepreneurskilltestComponent } from './entrepreneurskilltest.component';

describe('EntrepreneurskilltestComponent', () => {
  let component: EntrepreneurskilltestComponent;
  let fixture: ComponentFixture<EntrepreneurskilltestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntrepreneurskilltestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntrepreneurskilltestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
