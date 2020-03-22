import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageRootComponentComponent } from './storage-root-component.component';

describe('StorageRootComponentComponent', () => {
  let component: StorageRootComponentComponent;
  let fixture: ComponentFixture<StorageRootComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageRootComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageRootComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
