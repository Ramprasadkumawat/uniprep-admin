import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagequizlistComponent } from './languagequizlist.component';

describe('LanguagequizlistComponent', () => {
  let component: LanguagequizlistComponent;
  let fixture: ComponentFixture<LanguagequizlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanguagequizlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguagequizlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
