import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

const BASE_URL = 'https://hotelbooking.stepprojects.ge/api/Rooms/GetRoom';
const BOOKING_URL = 'https://hotelbooking.stepprojects.ge/api/Booking';

const GUEST_MAP: Record<number, number> = {
  1: 1,
  2: 1,
  3: 2,
  4: 2,
  5: 2,
  6: 3,
  7: 3,
  8: 3,
  9: 4,
  10: 4,
  11: 2,
  12: 3,
};

const ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&auto=format&fit=crop',
];

// Extra carousel images per room slot
const EXTRA_IMAGES = [
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=900&auto=format&fit=crop',
];

@Component({
  selector: 'app-room-detail',
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  templateUrl: './room-detail.html',
  styleUrl: './room-detail.scss',
  encapsulation: ViewEncapsulation.None,
})
export class RoomDetail implements OnInit {
  isScrolled = false;
  isMenuOpen = false;
  isLoading = true;

  room: any = null;
  otherRooms: any[] = [];
  carouselImages: string[] = [];
  activeSlide = 0;

  // Reservation form
  checkIn = '';
  checkOut = '';
  customerName = '';
  customerPhone = '';
  bookingStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  bookingMessage = '';

  // Overview tabs
  activeTab: 'overview' | 'facilities' | 'extra' = 'overview';

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 40;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.isScrolled = window.scrollY > 40;
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) this.loadRoom(id);
    });
  }

  private async loadRoom(id: number) {
    this.isLoading = true;
    window.scrollTo(0, 0);
    try {
      const res = await fetch(`${BASE_URL}/${id}`);
      if (!res.ok) throw new Error('not found');
      const r = await res.json();

      const imgIndex = (id - 1) % ROOM_IMAGES.length;
      this.room = {
        id: r.id ?? id,
        name: r.roomName || r.name || r.title || 'Luxury Room',
        type: r.roomTypeName || r.type || 'Deluxe',
        price: r.price || r.pricePerNight || 250,
        amenities: this.extractAmenities(r),
        maxGuests: GUEST_MAP[id] ?? r.maxGuests ?? 2,
        description:
          r.description ||
          'Experience the pinnacle of luxury in this beautifully appointed room. Every detail has been considered to ensure your stay is nothing short of extraordinary.',
        image: ROOM_IMAGES[imgIndex],
      };

      // Build carousel: main image + 2 extras
      this.carouselImages = [
        ROOM_IMAGES[imgIndex],
        EXTRA_IMAGES[imgIndex % EXTRA_IMAGES.length],
        EXTRA_IMAGES[(imgIndex + 1) % EXTRA_IMAGES.length],
        EXTRA_IMAGES[(imgIndex + 2) % EXTRA_IMAGES.length],
      ];

      // Load 3 other rooms (neighbouring IDs, skip current)
      const otherIds = [1, 2, 3, 4, 5, 6, 7, 8].filter((i) => i !== id).slice(0, 3);

      const others = await Promise.allSettled(
        otherIds.map((oid) => fetch(`${BASE_URL}/${oid}`).then((r) => (r.ok ? r.json() : null))),
      );

      this.otherRooms = others
        .map((res, i) => {
          if (res.status === 'fulfilled' && res.value) {
            const r = res.value;
            const idx = (otherIds[i] - 1) % ROOM_IMAGES.length;
            return {
              id: r.id ?? otherIds[i],
              name: r.roomName || r.name || 'Luxury Room',
              price: r.price || r.pricePerNight || 250,
              image: ROOM_IMAGES[idx],
            };
          }
          return null;
        })
        .filter(Boolean);
    } catch {
      this.room = null;
    } finally {
      this.isLoading = false;
    }
  }

  extractAmenities(room: any): string[] {
    const list = room.amenities || room.features || [];
    if (!list.length)
      return [
        'Free WiFi',
        'Luxury Bedding',
        '24h Service',
        'Room Service',
        'Mini Bar',
        'Flat Screen TV',
      ];
    return list
      .slice(0, 6)
      .map((a: any) => (typeof a === 'string' ? a : a.name || a.amenityName || 'Amenity'));
  }

  prevSlide() {
    this.activeSlide =
      this.activeSlide === 0 ? this.carouselImages.length - 1 : this.activeSlide - 1;
  }

  nextSlide() {
    this.activeSlide = (this.activeSlide + 1) % this.carouselImages.length;
  }

  goToSlide(i: number) {
    this.activeSlide = i;
  }

  async bookNow() {
    if (!this.checkIn || !this.checkOut || !this.customerName || !this.customerPhone) {
      this.bookingStatus = 'error';
      this.bookingMessage = 'Please fill in all fields before booking.';
      return;
    }

    this.bookingStatus = 'loading';
    try {
      const payload = {
        roomId: this.room.id,
        checkIn: this.checkIn,
        checkOut: this.checkOut,
        startDate: this.checkIn,
        endDate: this.checkOut,
        customerName: this.customerName,
        customerPhone: this.customerPhone,
        guestName: this.customerName,
        phoneNumber: this.customerPhone,
      };

      const res = await fetch(BOOKING_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        this.bookingStatus = 'success';
        this.bookingMessage = 'Booking confirmed! We look forward to welcoming you.';
        this.checkIn = '';
        this.checkOut = '';
        this.customerName = '';
        this.customerPhone = '';
      } else {
        const err = await res.json().catch(() => ({}));
        this.bookingStatus = 'error';
        this.bookingMessage = err.message || err.title || 'Booking failed. Please try again.';
      }
    } catch {
      this.bookingStatus = 'error';
      this.bookingMessage = 'Network error. Please check your connection and try again.';
    }
  }

  navigateToRoom(id: number) {
    this.router.navigate(['/rooms', id]);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
