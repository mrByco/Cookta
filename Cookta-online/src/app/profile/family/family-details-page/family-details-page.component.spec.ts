import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyDetailsPageComponent } from './family-details-page.component';

describe('FamilyDetailsPageComponent', () => {
  let component: FamilyDetailsPageComponent;
  let fixture: ComponentFixture<FamilyDetailsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyDetailsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
