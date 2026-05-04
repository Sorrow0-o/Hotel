import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
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

  constructor(private route: ActivatedRoute) {}

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
    setTimeout(() => controller.abort(), 6000);

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
    } catch {
    
    }


    try {
      const roomsRes = await fetch(`${HOTEL_API_BASE}/Rooms/GetByHotelId/${this.hotelId}`, {
        signal: controller.signal,
      });
      if (roomsRes.ok) {
        const data = await roomsRes.json();
        const raw: any[] = Array.isArray(data) ? data : (data.rooms ?? data.data ?? []);
        if (raw.length > 0) {
          this.rooms = raw;
          this.isLoading = false;
          return;
        }
      }
    } catch {
     
    }

   
    try {
      const allRes = await fetch(`${HOTEL_API_BASE}/Rooms/GetAll`);
      if (allRes.ok) {
        const data = await allRes.json();
        const raw: any[] = Array.isArray(data) ? data : (data.rooms ?? data.data ?? []);
        const filtered = raw.filter(
          (r) => String(r.hotelId ?? r.hotel_id ?? r.hotel?.id) === String(this.hotelId),
        );
        if (filtered.length > 0) {
          this.rooms = filtered;
          this.isLoading = false;
          return;
        }
      }
    } catch {
    
    }

   
    this.rooms = this.getMockRooms();
    this.isLoading = false;
  }

  private getMockRooms(): any[] {
    return [
      {
        id: 101,
        name: 'Classic Room',
        type: 'Classic',
        price: 180,
        maxGuests: 2,
        amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar'],
        image: ROOM_IMAGES[0],
      },
      {
        id: 102,
        name: 'Deluxe King Room',
        type: 'Deluxe',
        price: 280,
        maxGuests: 2,
        amenities: ['Sea View', 'King Bed', 'Jacuzzi', 'Balcony'],
        image: ROOM_IMAGES[1],
      },
      {
        id: 103,
        name: 'Junior Suite',
        type: 'Suite',
        price: 420,
        maxGuests: 3,
        amenities: ['Living Area', 'Rain Shower', 'Premium Minibar', 'Butler'],
        image: ROOM_IMAGES[2],
      },
      {
        id: 104,
        name: 'Executive Suite',
        type: 'Suite',
        price: 580,
        maxGuests: 4,
        amenities: ['Panoramic View', 'Private Terrace', 'Dining Area', 'Spa Access'],
        image: ROOM_IMAGES[3],
      },
      {
        id: 105,
        name: 'Garden View Room',
        type: 'Deluxe',
        price: 240,
        maxGuests: 2,
        amenities: ['Garden View', 'Queen Bed', 'Free Breakfast', 'Lounge Access'],
        image: ROOM_IMAGES[4],
      },
      {
        id: 106,
        name: 'Penthouse Suite',
        type: 'Penthouse',
        price: 980,
        maxGuests: 6,
        amenities: ['Private Pool', 'Chef Service', 'City View', '24h Concierge'],
        image: ROOM_IMAGES[5],
      },
    ];
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
    return room.price ?? room.pricePerNight ?? room.rate ?? 0;
  }

  getRoomGuests(room: any): number {
    return room.maxGuests ?? room.capacity ?? room.guests ?? 2;
  }

  getRoomAmenities(room: any): string[] {
    const a = room.amenities ?? room.features ?? [];
    return Array.isArray(a) ? a.slice(0, 4) : [];
  }

  getRoomImage(room: any): string {
    if (room.image) return room.image;
    if (room.imageUrl) return room.imageUrl;
    if (room.photo) return room.photo;
    const idx = Number(room.id ?? 0) % ROOM_IMAGES.length;
    return ROOM_IMAGES[idx];
  }
}
