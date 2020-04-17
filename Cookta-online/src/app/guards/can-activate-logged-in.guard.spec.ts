import {TestBed} from '@angular/core/testing';

import {CanActivateLoggedInGuard} from './can-activate-logged-in.guard';

describe('CanActivateLoggedInGuard', () => {
  let guard: CanActivateLoggedInGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanActivateLoggedInGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
