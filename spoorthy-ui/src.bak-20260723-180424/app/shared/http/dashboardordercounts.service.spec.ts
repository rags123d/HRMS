import { TestBed } from '@angular/core/testing';

import { DashboardordercountsService } from './dashboardordercounts.service';

describe('DashboardordercountsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardordercountsService = TestBed.get(DashboardordercountsService);
    expect(service).toBeTruthy();
  });
});
