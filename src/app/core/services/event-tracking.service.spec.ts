import { TestBed } from '@angular/core/testing';

import { EventTrackingService } from './event-tracking.service';

describe('EventTrackingService', () => {
  let service: EventTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
