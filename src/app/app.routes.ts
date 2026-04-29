import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Hotels } from './hotels/hotels';
import { Rooms } from './rooms/rooms';
import { BookRooms } from './book-rooms/book-rooms';
import { RoomDetail } from './room-detail/room-detail';
import { Register } from './register/register';
import { registeredGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'hotels', component: Hotels },
  { path: 'rooms', component: Rooms, canActivate: [registeredGuard] },
  { path: 'rooms/:id', component: RoomDetail, canActivate: [registeredGuard] },
  { path: 'book-rooms', component: BookRooms },
  { path: 'register', component: Register },
  { path: '**', redirectTo: '' },
];
