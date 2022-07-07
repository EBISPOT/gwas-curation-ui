import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleTabComponent } from './sample-tab.component';

describe('SampleTabComponent', () => {
  let component: SampleTabComponent;
  let fixture: ComponentFixture<SampleTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
