import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutReustaurant } from './about-reustaurant';

describe('AboutReustaurant', () => {
  let component: AboutReustaurant;
  let fixture: ComponentFixture<AboutReustaurant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutReustaurant],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutReustaurant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
