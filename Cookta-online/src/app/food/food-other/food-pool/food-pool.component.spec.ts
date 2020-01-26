import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodPoolComponent } from './food-pool.component';

describe('FoodPoolComponent', () => {
  let component: FoodPoolComponent;
  let fixture: ComponentFixture<FoodPoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodPoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
