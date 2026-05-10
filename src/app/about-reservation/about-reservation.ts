import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';

const HOTEL_API = 'https://hotelbooking.stepprojects.ge/api/Hotels/GetAll';

export interface RestaurantTable {
  id: number;
  label: string;
  capacity: number;
  zone: string;
  shape: 'round' | 'square';
  size?: 'large';
  status: 'available' | 'occupied';
  x: number;
  y: number;
  dots: number[];
}

function makeTables(): RestaurantTable[] {
  const occupied = new Set([2, 5, 7, 11]);
  const raw: Omit<RestaurantTable, 'status' | 'dots'>[] = [
    // Window row (round)
    { id: 1, label: 'T1', capacity: 2, zone: 'Window', shape: 'round', x: 60, y: 55 },
    { id: 2, label: 'T2', capacity: 2, zone: 'Window', shape: 'round', x: 165, y: 55 },
    { id: 3, label: 'T3', capacity: 2, zone: 'Window', shape: 'round', x: 270, y: 55 },
    { id: 4, label: 'T4', capacity: 4, zone: 'Window', shape: 'round', x: 390, y: 55 },
    { id: 5, label: 'T5', capacity: 4, zone: 'Window', shape: 'round', x: 505, y: 55 },
    // Main row (square)
    { id: 6, label: 'T6', capacity: 4, zone: 'Main', shape: 'square', x: 60, y: 180 },
    { id: 7, label: 'T7', capacity: 4, zone: 'Main', shape: 'square', x: 185, y: 180 },
    { id: 8, label: 'T8', capacity: 4, zone: 'Main', shape: 'square', x: 310, y: 180 },
    { id: 9, label: 'T9', capacity: 4, zone: 'Main', shape: 'square', x: 435, y: 180 },
    // Centre row
    { id: 10, label: 'T10', capacity: 5, zone: 'Centre', shape: 'square', x: 60, y: 300 },
    { id: 11, label: 'T11', capacity: 5, zone: 'Centre', shape: 'square', x: 210, y: 300 },
    // Alcove (round)
    { id: 12, label: 'T12', capacity: 2, zone: 'Alcove', shape: 'round', x: 390, y: 305 },
    { id: 13, label: 'T13', capacity: 2, zone: 'Alcove', shape: 'round', x: 490, y: 305 },
    // Private (large square)
    {
      id: 14,
      label: 'T14',
      capacity: 8,
      zone: 'Private',
      shape: 'square',
      size: 'large',
      x: 60,
      y: 415,
    },
  ];
  return raw.map((t) => ({
    ...t,
    status: occupied.has(t.id) ? 'occupied' : 'available',
    dots: Array(t.capacity <= 2 ? 2 : t.capacity <= 4 ? 4 : 6).fill(0),
  }));
}

@Component({
  selector: 'app-about-reservation',
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './about-reservation.html',
  styleUrl: './about-reservation.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AboutReservation implements OnInit {
  isMenuOpen = false;
  hotelId: string | number = '';
  hotelName = 'AirGlo Hotel';
  hotelCity = '';

  today = new Date().toISOString().split('T')[0];
  selectedDate = this.today;
  selectedTime = '19:00';
  guests = 2;

  timeSlots = [
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ];

  tables: RestaurantTable[] = makeTables();
  selectedTable: RestaurantTable | null = null;
  confirmedTable: RestaurantTable | null = null;

  form = { name: '', email: '', phone: '', notes: '' };
  formError = '';
  isSubmitting = false;
  bookingSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit() {
    this.hotelId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadHotel();
  }

  selectTable(table: RestaurantTable) {
    if (table.status === 'occupied') return;
    this.selectedTable = this.selectedTable?.id === table.id ? null : table;
    this.formError = '';
    this.cdr.detectChanges();
  }

  clearSelection() {
    this.selectedTable = null;
  }

  async submitReservation() {
    this.formError = '';
    if (!this.form.name.trim()) {
      this.formError = 'Please enter your full name.';
      return;
    }
    if (!this.form.email.trim() || !this.form.email.includes('@')) {
      this.formError = 'Please enter a valid email address.';
      return;
    }
    if (!this.form.phone.trim()) {
      this.formError = 'Please enter your phone number.';
      return;
    }

    this.isSubmitting = true;
    await new Promise((r) => setTimeout(r, 900));

    // Mark the table as occupied
    const t = this.tables.find((t) => t.id === this.selectedTable?.id);
    if (t) t.status = 'occupied';

    this.confirmedTable = this.selectedTable;
    this.selectedTable = null;
    this.bookingSuccess = true;
    this.isSubmitting = false;
    this.cdr.detectChanges();
  }

  resetBooking() {
    this.bookingSuccess = false;
    this.confirmedTable = null;
    this.form = { name: '', email: '', phone: '', notes: '' };
    this.cdr.detectChanges();
  }

  private async loadHotel() {
    try {
      const res = await fetch(HOTEL_API);
      if (res.ok) {
        const data = await res.json();
        const hotels: any[] = Array.isArray(data) ? data : (data.hotels ?? data.data ?? []);
        const hotel = hotels.find((h) => String(h.id ?? h.hotelId) === String(this.hotelId));
        if (hotel) {
          this.hotelName = hotel.name ?? hotel.hotelName ?? 'AirGlo Hotel';
          this.hotelCity = hotel.city ?? hotel.cityName ?? '';
        }
      }
    } catch {
    } finally {
      this.cdr.detectChanges();
    }
  }
}
