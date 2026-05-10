import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutReservation } from './about-reservation';

describe('AboutReservation', () => {
  let component: AboutReservation;
  let fixture: ComponentFixture<AboutReservation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutReservation],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutReservation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
