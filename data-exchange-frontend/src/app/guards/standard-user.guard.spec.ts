import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { standardUserGuard } from './standard-user.guard';

describe('standardUserGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => standardUserGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
