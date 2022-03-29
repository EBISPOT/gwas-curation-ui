import { TestBed } from '@angular/core/testing';

import { ReportedTraitService } from './reported-trait.service';

describe('ReportedTraitService', () => {
  let service: ReportedTraitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportedTraitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
