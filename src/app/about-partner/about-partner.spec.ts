import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutPartner } from './about-partner';

describe('AboutPartner', () => {
  let component: AboutPartner;
  let fixture: ComponentFixture<AboutPartner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutPartner],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutPartner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
