import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

const BOOKING_API = 'https://hotelbooking.stepprojects.ge/api/Booking';
const HOTELS_API = 'https://hotelbooking.stepprojects.ge/api/Hotels/GetAll';
const ROOMS_API = 'https://hotelbooking.stepprojects.ge/api/Rooms/GetRoom';

@Component({
  selector: 'app-book-rooms',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './book-rooms.html',
  styleUrl: './book-rooms.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BookRooms implements OnInit {
  isScrolled = false;
  isMenuOpen = false;
  isLoading = true;

  allBookings: any[] = [];
  displayedBookings: any[] = [];
  cities: string[] = [];
  selectedCity: string | null = null;

  hotelMap: Record<number, any> = {};
  roomMap: Record<number, any> = {};

  confirmCancelId: number | null = null;
  cancellingId: number | null = null;
  cancelSuccess: number | null = null;

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 40;
  }

  ngOnInit() {
    this.isScrolled = window.scrollY > 40;
    this.loadAll();
  }

  private async loadAll() {
    this.isLoading = true;
    try {
      // Load bookings + hotels in parallel
      const [bookingsRes, hotelsRes] = await Promise.all([fetch(BOOKING_API), fetch(HOTELS_API)]);

      let bookings: any[] = [];
      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        bookings = Array.isArray(data) ? data : data.bookings || data.data || [];
      }

      if (hotelsRes.ok) {
        const data = await hotelsRes.json();
        const hotels: any[] = Array.isArray(data) ? data : data.hotels || data.data || [];
        hotels.forEach((h) => {
          const id = h.id || h.hotelId;
          if (id) this.hotelMap[id] = h;
        });
      }

      // Extract unique hotel ids referenced by bookings to pre-load rooms if needed
      // Also gather cities from hotels
      const citySet = new Set<string>();
      Object.values(this.hotelMap).forEach((h: any) => {
        const city = h.city || h.cityName || h.location;
        if (city) citySet.add(city);
      });
      this.cities = Array.from(citySet);

      // Pre-fetch room details referenced by bookings
      const roomIds = [
        ...new Set(bookings.map((b: any) => b.roomId || b.room?.id).filter(Boolean)),
      ];
      await Promise.allSettled(
        roomIds.map((id) =>
          fetch(`${ROOMS_API}/${id}`)
            .then((r) => (r.ok ? r.json() : null))
            .then((r) => {
              if (r) this.roomMap[id] = r;
            }),
        ),
      );

      this.allBookings = bookings;
      this.displayedBookings = [...bookings];
    } catch (e) {
      console.error(e);
      this.allBookings = [];
      this.displayedBookings = [];
    } finally {
      this.isLoading = false;
    }
  }

  filterByCity(city: string | null) {
    this.selectedCity = city;
    if (!city) {
      this.displayedBookings = [...this.allBookings];
      return;
    }
    this.displayedBookings = this.allBookings.filter((b) => {
      const hotel = this.getHotel(b);
      if (!hotel) return false;
      const c = hotel.city || hotel.cityName || hotel.location || '';
      return c.toLowerCase() === city.toLowerCase();
    });
  }

  getHotel(booking: any): any {
    const id = booking.hotelId || booking.hotel?.id;
    return id ? this.hotelMap[id] : null;
  }

  getHotelName(booking: any): string {
    const h = this.getHotel(booking);
    if (h) return h.name || h.hotelName || h.title || `Hotel #${h.id}`;
    return booking.hotelName || booking.hotel?.name || '—';
  }

  getHotelImage(booking: any): string {
    const h = this.getHotel(booking);
    if (h) {
      const img = h.image || h.imageUrl || h.photo;
      if (img) return img;
    }
    const fallbacks = [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=80&auto=format&fit=crop',
    ];
    const id = booking.hotelId || 0;
    return fallbacks[id % fallbacks.length];
  }

  getRoom(booking: any): any {
    const id = booking.roomId || booking.room?.id;
    return id ? this.roomMap[id] : null;
  }

  getRoomName(booking: any): string {
    const r = this.getRoom(booking);
    if (r) return r.roomName || r.name || r.title || `Room #${r.id}`;
    return booking.roomName || booking.room?.name || `Room #${booking.roomId || '—'}`;
  }

  getRoomImage(booking: any): string {
    const r = this.getRoom(booking);
    if (r) {
      const img = r.image || r.imageUrl || r.photo;
      if (img) return img;
    }
    const roomImages = [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=80&auto=format&fit=crop',
    ];
    const id = booking.roomId || 0;
    return roomImages[id % roomImages.length];
  }

  getCustomerName(booking: any): string {
    return (
      booking.customerName ||
      booking.guestName ||
      booking.name ||
      (booking.customer ? booking.customer.name || booking.customer.fullName : null) ||
      '—'
    );
  }

  getCustomerPhone(booking: any): string {
    return (
      booking.phoneNumber ||
      booking.phone ||
      (booking.customer ? booking.customer.phone || booking.customer.phoneNumber : null) ||
      ''
    );
  }

  getStatus(booking: any): string {
    return booking.status || booking.bookingStatus || 'Booked';
  }

  formatDate(date: string): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getTotalPrice(booking: any): string {
    const price = booking.totalPrice ?? booking.price ?? booking.amount;
    if (price == null) return '—';
    return `$${Math.abs(price).toLocaleString()}`;
  }

  requestCancel(id: number) {
    this.confirmCancelId = id;
  }

  dismissCancel() {
    this.confirmCancelId = null;
  }

  async confirmCancel() {
    const id = this.confirmCancelId!;
    this.confirmCancelId = null;
    this.cancellingId = id;

    try {
      const res = await fetch(`${BOOKING_API}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        this.allBookings = this.allBookings.filter((b) => (b.id || b.bookingId) !== id);
        this.displayedBookings = this.displayedBookings.filter((b) => (b.id || b.bookingId) !== id);
        this.cancelSuccess = id;
        setTimeout(() => {
          this.cancelSuccess = null;
        }, 3000);
      }
    } catch (e) {
      console.error('Cancel failed', e);
    } finally {
      this.cancellingId = null;
    }
  }

  getBookingId(booking: any): number {
    return booking.id || booking.bookingId;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
