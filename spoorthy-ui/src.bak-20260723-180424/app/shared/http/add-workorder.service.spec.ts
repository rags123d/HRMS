import { TestBed } from '@angular/core/testing';

import { AddWorkorderService } from './add-workorder.service';

describe('AddWorkorderService', () => {
  let service: AddWorkorderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddWorkorderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
