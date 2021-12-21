import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyTabComponent } from './study-tab.component';

describe('StudyTabComponent', () => {
  let component: StudyTabComponent;
  let fixture: ComponentFixture<StudyTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudyTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
