import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportPublicationComponent } from './import-publication.component';

describe('ImportPublicationComponent', () => {
  let component: ImportPublicationComponent;
  let fixture: ComponentFixture<ImportPublicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportPublicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportPublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
