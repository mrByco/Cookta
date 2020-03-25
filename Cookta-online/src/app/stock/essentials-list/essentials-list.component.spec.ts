import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EssentialsListComponent } from './essentials-list.component';

describe('EssentialsListComponent', () => {
  let component: EssentialsListComponent;
  let fixture: ComponentFixture<EssentialsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EssentialsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssentialsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
