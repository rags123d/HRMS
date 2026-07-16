import { TestBed } from '@angular/core/testing';

import { RouterprotectionguardService } from './routerprotectionguard.service';

describe('RouterprotectionguardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouterprotectionguardService = TestBed.get(RouterprotectionguardService);
    expect(service).toBeTruthy();
  });
});
