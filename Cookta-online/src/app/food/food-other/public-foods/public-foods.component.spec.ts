import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PublicFoodsComponent} from './public-foods.component';

describe('PublicFoodsComponent', () => {
  let component: PublicFoodsComponent;
  let fixture: ComponentFixture<PublicFoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PublicFoodsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicFoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
