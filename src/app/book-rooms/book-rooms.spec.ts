import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookRooms } from './book-rooms';

describe('BookRooms', () => {
  let component: BookRooms;
  let fixture: ComponentFixture<BookRooms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookRooms],
    }).compileComponents();

    fixture = TestBed.createComponent(BookRooms);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
