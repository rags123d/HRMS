import { TestBed } from '@angular/core/testing';

import { OrderDashboardService } from './order-dashboard.service';

describe('OrderDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrderDashboardService = TestBed.get(OrderDashboardService);
    expect(service).toBeTruthy();
  });
});
