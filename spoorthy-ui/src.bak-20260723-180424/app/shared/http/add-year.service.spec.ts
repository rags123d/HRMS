import { TestBed } from '@angular/core/testing';

import { AddYearService } from './add-year.service';

describe('AddYearService', () => {
  let service: AddYearService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddYearService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
