import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteIngredientPupopComponent } from './delete-ingredient-pupop.component';

describe('DeleteIngredientPupopComponent', () => {
  let component: DeleteIngredientPupopComponent;
  let fixture: ComponentFixture<DeleteIngredientPupopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteIngredientPupopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteIngredientPupopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
