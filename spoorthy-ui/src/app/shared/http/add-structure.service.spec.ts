import { TestBed } from '@angular/core/testing';

import { AddStructureService } from './add-structure.service';

describe('AddStructureService', () => {
  let service: AddStructureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddStructureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
