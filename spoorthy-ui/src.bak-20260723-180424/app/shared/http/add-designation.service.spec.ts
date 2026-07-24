import { TestBed } from '@angular/core/testing';

import { AddDesignationService } from './add-designation.service';

describe('AddDesignationService', () => {
  let service: AddDesignationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddDesignationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
