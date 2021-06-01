import { TestBed } from '@angular/core/testing';

import { CurationHttpService } from './curation-http.service';

describe('CurationHttpService', () => {
  let service: CurationHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurationHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
