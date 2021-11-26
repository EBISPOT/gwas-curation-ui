import { TestBed } from '@angular/core/testing';

import { EfoTraitService } from './efo-trait.service';

describe('EfoTraitService', () => {
  let service: EfoTraitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EfoTraitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
