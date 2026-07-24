import { TestBed } from '@angular/core/testing';

import { AddRelationshipService } from './add-relationship.service';

describe('AddRelationshipService', () => {
  let service: AddRelationshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddRelationshipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
