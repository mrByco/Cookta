import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodFeedComponent } from './food-feed.component';

describe('FoodFeedComponent', () => {
  let component: FoodFeedComponent;
  let fixture: ComponentFixture<FoodFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
