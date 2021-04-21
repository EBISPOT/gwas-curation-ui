import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionHistoryTabComponent } from './submission-history-tab.component';

describe('SubmissionHistoryTabComponent', () => {
  let component: SubmissionHistoryTabComponent;
  let fixture: ComponentFixture<SubmissionHistoryTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmissionHistoryTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionHistoryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
