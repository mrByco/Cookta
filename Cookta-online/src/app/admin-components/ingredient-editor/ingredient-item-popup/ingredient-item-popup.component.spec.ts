import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientItemPopupComponent } from './ingredient-item-popup.component';

describe('IngredientItemPopupComponent', () => {
  let component: IngredientItemPopupComponent;
  let fixture: ComponentFixture<IngredientItemPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientItemPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientItemPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
