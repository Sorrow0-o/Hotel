import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Hotels } from './hotels/hotels';
import { Rooms } from './rooms/rooms';
import { BookRooms } from './book-rooms/book-rooms';
import { RoomDetail } from './room-detail/room-detail';
import { Register } from './register/register';
import { Reviews } from './reviews/reviews';
import { HotelServices } from './hotel-services/hotel-services';
import { HotelRooms } from './hotel-rooms/hotel-rooms';
import { About } from './about/about';
import { AboutReustaurant } from './about-reustaurant/about-reustaurant';
import { AboutReservation } from './about-reservation/about-reservation';
import { AboutPartner } from './about-partner/about-partner';
import { registeredGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'hotels', component: Hotels },
  { path: 'hotels/:id/about', component: About },
  { path: 'hotels/:id/restaurant', component: AboutReustaurant },
  { path: 'hotels/:id/reservation', component: AboutReservation },
  { path: 'hotels/:id/partners', component: AboutPartner },
  { path: 'hotels/:id/rooms', component: HotelRooms,  canActivate: [registeredGuard] },
  { path: 'rooms', component: Rooms,  canActivate: [registeredGuard] },
  { path: 'rooms/:id', component: RoomDetail, canActivate: [registeredGuard] },
  { path: 'book-rooms', component: BookRooms },
  { path: 'register', component: Register },
  { path: 'reviews', component: Reviews },
  { path: 'hotel-services', component: HotelServices },
  { path: '**', redirectTo: '' },
];
