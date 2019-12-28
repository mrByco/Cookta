import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodCollectionListComponent } from './food-collection-list.component';

describe('FoodCollectionListComponent', () => {
  let component: FoodCollectionListComponent;
  let fixture: ComponentFixture<FoodCollectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodCollectionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodCollectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
