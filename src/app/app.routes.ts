import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Hotels } from './hotels/hotels';
import { Rooms } from './rooms/rooms';
import { BookRooms } from './book-rooms/book-rooms';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'hotels', component: Hotels },
  { path: 'rooms', component: Rooms },
  { path: 'book-rooms', component: BookRooms },
  { path: '**', redirectTo: '' },
];
