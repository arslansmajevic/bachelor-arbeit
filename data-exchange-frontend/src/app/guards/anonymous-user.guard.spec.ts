import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { anonymousUserGuard } from './anonymous-user.guard';

describe('anonymousUserGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => anonymousUserGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
