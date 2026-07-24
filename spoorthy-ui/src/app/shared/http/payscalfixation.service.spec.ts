import { TestBed } from '@angular/core/testing';

import { PayscalfixationService } from './payscalfixation.service';

describe('PayscalfixationService', () => {
  let service: PayscalfixationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayscalfixationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
