import { TestBed } from '@angular/core/testing';

import { AddLanguagesService } from './add-languages.service';

describe('AddLanguagesService', () => {
  let service: AddLanguagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddLanguagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
