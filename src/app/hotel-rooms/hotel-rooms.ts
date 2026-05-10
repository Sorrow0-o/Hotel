import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

const HOTEL_API_BASE = 'https://hotelbooking.stepprojects.ge/api';

const ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=700&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=700&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=700&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=700&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=700&auto=format&fit=crop',
];

@Component({
  selector: 'app-hotel-rooms',
  imports: [CommonModule, RouterLink],
  templateUrl: './hotel-rooms.html',
  styleUrl: './hotel-rooms.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HotelRooms implements OnInit {
  isScrolled = false;
  isMenuOpen = false;
  isLoading = true;

  hotelId: string | number = '';
  hotelName = 'Hotel Rooms';
  hotelCity = '';
  hotelImage = '';
  rooms: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 40;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit() {
    this.hotelId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadHotelAndRooms();
  }

  private async loadHotelAndRooms() {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 3000);

    try {
      const hotelsRes = await fetch(`${HOTEL_API_BASE}/Hotels/GetAll`, {
        signal: controller.signal,
      });
      const hotelsData = await hotelsRes.json();
      const allHotels: any[] = Array.isArray(hotelsData)
        ? hotelsData
        : (hotelsData.hotels ?? hotelsData.data ?? []);

      const hotel = allHotels.find((h) => String(h.id ?? h.hotelId) === String(this.hotelId));

      if (hotel) {
        this.hotelName = hotel.name ?? hotel.hotelName ?? hotel.title ?? 'Hotel';
        this.hotelCity = hotel.city ?? hotel.cityName ?? hotel.location ?? '';
        this.hotelImage =
          hotel.image ??
          hotel.imageUrl ??
          hotel.photo ??
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop';
      }
    } catch {}

    try {
      const hotelNum = Number(this.hotelId) || 1;
      const startId = (hotelNum - 1) * 3 + 1;
      const roomIds = [startId, startId + 1, startId + 2];

      const results = await Promise.allSettled(
        roomIds.map((id) =>
          fetch(`${HOTEL_API_BASE}/Rooms/GetRoom/${id}`, { signal: controller.signal }).then(
            (res) => (res.ok ? res.json() : null),
          ),
        ),
      );

      const fetched = results
        .filter((r) => r.status === 'fulfilled' && r.value !== null)
        .map((r) => (r as PromiseFulfilledResult<any>).value);

      if (fetched.length > 0) {
        this.rooms = fetched;
        this.isLoading = false;
        this.cdr.detectChanges();
        return;
      }
    } catch {}

    this.rooms = this.getMockRooms();
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  private getMockRooms(): any[] {
    const hotelNum = Number(this.hotelId) || 1;

    const allRoomSets: any[][] = [
      [
        {
          id: 1,
          name: 'Classic Room',
          hotelId: 1,
          pricePerNight: 180,
          maximumGuests: 2,
          available: true,
          images: [{ source: ROOM_IMAGES[0] }],
        },
        {
          id: 2,
          name: 'Deluxe King Room',
          hotelId: 1,
          pricePerNight: 280,
          maximumGuests: 2,
          available: true,
          images: [{ source: ROOM_IMAGES[1] }],
        },
        {
          id: 3,
          name: 'Junior Suite',
          hotelId: 1,
          pricePerNight: 420,
          maximumGuests: 3,
          available: true,
          images: [{ source: ROOM_IMAGES[2] }],
        },
      ],

      [
        {
          id: 4,
          name: 'Standard Room',
          hotelId: 2,
          pricePerNight: 120,
          maximumGuests: 2,
          available: true,
          images: [{ source: ROOM_IMAGES[3] }],
        },
        {
          id: 5,
          name: 'Garden View Room',
          hotelId: 2,
          pricePerNight: 240,
          maximumGuests: 2,
          available: true,
          images: [{ source: ROOM_IMAGES[4] }],
        },
        {
          id: 6,
          name: 'Executive Suite',
          hotelId: 2,
          pricePerNight: 580,
          maximumGuests: 4,
          available: true,
          images: [{ source: ROOM_IMAGES[1] }],
        },
      ],

      [
        {
          id: 7,
          name: 'Executive Room',
          hotelId: 3,
          pricePerNight: 350,
          maximumGuests: 2,
          available: true,
          images: [{ source: ROOM_IMAGES[1] }],
        },
        {
          id: 8,
          name: 'Deluxe Twin Room',
          hotelId: 3,
          pricePerNight: 260,
          maximumGuests: 3,
          available: true,
          images: [{ source: ROOM_IMAGES[0] }],
        },
        {
          id: 9,
          name: 'Presidential Suite',
          hotelId: 3,
          pricePerNight: 1200,
          maximumGuests: 6,
          available: true,
          images: [{ source: ROOM_IMAGES[5] }],
        },
      ],
    ];

    const index = (hotelNum - 1) % allRoomSets.length;
    return allRoomSets[index];
  }

  getRoomId(room: any): number | string {
    return room.id ?? room.roomId ?? 0;
  }

  getRoomName(room: any): string {
    return room.name ?? room.roomName ?? room.title ?? 'Room';
  }

  getRoomType(room: any): string {
    return room.type ?? room.roomType ?? room.category ?? 'Standard';
  }

  getRoomPrice(room: any): number {
    return room.pricePerNight ?? room.price ?? room.rate ?? 0;
  }

  getRoomGuests(room: any): number {
    return room.maximumGuests ?? room.maxGuests ?? room.capacity ?? 2;
  }

  getRoomAmenities(room: any): string[] {
    if (room.amenities && Array.isArray(room.amenities)) return room.amenities.slice(0, 4);
    if (room.features && Array.isArray(room.features)) return room.features.slice(0, 4);

    const tags: string[] = [];
    if (room.available !== false) tags.push('Available');
    if (room.maximumGuests) tags.push(`Up to ${room.maximumGuests} guests`);
    return tags;
  }

  getRoomImage(room: any): string {
    if (room.images && room.images.length > 0 && room.images[0].source)
      return room.images[0].source;
    if (room.image) return room.image;
    if (room.imageUrl) return room.imageUrl;
    if (room.photo) return room.photo;
    const idx = Number(room.id ?? 0) % ROOM_IMAGES.length;
    return ROOM_IMAGES[idx];
  }
}
