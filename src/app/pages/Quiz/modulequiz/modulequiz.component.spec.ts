import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulequizComponent } from './modulequiz.component';

describe('ModulequizComponent', () => {
  let component: ModulequizComponent;
  let fixture: ComponentFixture<ModulequizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModulequizComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModulequizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
