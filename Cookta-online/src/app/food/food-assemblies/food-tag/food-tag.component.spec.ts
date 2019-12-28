import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodTagComponent } from './food-tag.component';

describe('FoodTagComponent', () => {
  let component: FoodTagComponent;
  let fixture: ComponentFixture<FoodTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
