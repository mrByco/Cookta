import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagAdderComponent } from './tag-adder.component';

describe('TagAdderComponent', () => {
  let component: TagAdderComponent;
  let fixture: ComponentFixture<TagAdderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagAdderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagAdderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
