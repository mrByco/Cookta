import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RowHomeContentComponent } from './row-home-content.component';

describe('RowHomeContentComponent', () => {
  let component: RowHomeContentComponent;
  let fixture: ComponentFixture<RowHomeContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RowHomeContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowHomeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
