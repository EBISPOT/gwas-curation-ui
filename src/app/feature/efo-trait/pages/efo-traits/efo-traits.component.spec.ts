import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EfoTraitsComponent } from './efo-traits.component';

describe('EfoTraitsComponent', () => {
  let component: EfoTraitsComponent;
  let fixture: ComponentFixture<EfoTraitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EfoTraitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EfoTraitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
