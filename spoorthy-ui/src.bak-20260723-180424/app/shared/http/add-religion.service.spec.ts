import { TestBed } from '@angular/core/testing';

import { AddReligionService } from './add-religion.service';

describe('AddReligionService', () => {
  let service: AddReligionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddReligionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
