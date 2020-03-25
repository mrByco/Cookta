import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodImageUploadComponent } from './food-image-upload.component';

describe('FoodImageUploadComponent', () => {
  let component: FoodImageUploadComponent;
  let fixture: ComponentFixture<FoodImageUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodImageUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
