import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTrackingComponent } from './event-tracking.component';

describe('EventTrackingComponent', () => {
  let component: EventTrackingComponent;
  let fixture: ComponentFixture<EventTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventTrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
