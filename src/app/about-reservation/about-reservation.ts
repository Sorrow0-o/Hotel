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

function makeTables(
  occupied: number[],
  raw: Omit<RestaurantTable, 'status' | 'dots'>[],
): RestaurantTable[] {
  const occ = new Set(occupied);
  return raw.map((t) => ({
    ...t,
    status: occ.has(t.id) ? 'occupied' : 'available',
    dots: Array(t.capacity <= 2 ? 2 : t.capacity <= 4 ? 4 : 6).fill(0),
  }));
}

// ── Hotel 1: Window / Main / Centre / Alcove / Private ────────────────────────
function makeTables1(): RestaurantTable[] {
  return makeTables(
    [2, 5, 7, 11],
    [
      { id: 1, label: 'T1', capacity: 2, zone: 'Window', shape: 'round', x: 60, y: 55 },
      { id: 2, label: 'T2', capacity: 2, zone: 'Window', shape: 'round', x: 165, y: 55 },
      { id: 3, label: 'T3', capacity: 2, zone: 'Window', shape: 'round', x: 270, y: 55 },
      { id: 4, label: 'T4', capacity: 4, zone: 'Window', shape: 'round', x: 390, y: 55 },
      { id: 5, label: 'T5', capacity: 4, zone: 'Window', shape: 'round', x: 505, y: 55 },
      { id: 6, label: 'T6', capacity: 4, zone: 'Main', shape: 'square', x: 60, y: 180 },
      { id: 7, label: 'T7', capacity: 4, zone: 'Main', shape: 'square', x: 185, y: 180 },
      { id: 8, label: 'T8', capacity: 4, zone: 'Main', shape: 'square', x: 310, y: 180 },
      { id: 9, label: 'T9', capacity: 4, zone: 'Main', shape: 'square', x: 435, y: 180 },
      { id: 10, label: 'T10', capacity: 5, zone: 'Centre', shape: 'square', x: 60, y: 300 },
      { id: 11, label: 'T11', capacity: 5, zone: 'Centre', shape: 'square', x: 210, y: 300 },
      { id: 12, label: 'T12', capacity: 2, zone: 'Alcove', shape: 'round', x: 390, y: 305 },
      { id: 13, label: 'T13', capacity: 2, zone: 'Alcove', shape: 'round', x: 490, y: 305 },
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
    ],
  );
}

// ── Hotel 2: Terrace / Garden / Bar Lounge / VIP ─────────────────────────────
function makeTables2(): RestaurantTable[] {
  return makeTables(
    [1, 4, 8, 12],
    [
      // Terrace row — round, top
      { id: 1, label: 'T1', capacity: 2, zone: 'Terrace', shape: 'round', x: 55, y: 50 },
      { id: 2, label: 'T2', capacity: 2, zone: 'Terrace', shape: 'round', x: 155, y: 50 },
      { id: 3, label: 'T3', capacity: 4, zone: 'Terrace', shape: 'round', x: 265, y: 50 },
      { id: 4, label: 'T4', capacity: 4, zone: 'Terrace', shape: 'round', x: 375, y: 50 },
      { id: 5, label: 'T5', capacity: 2, zone: 'Terrace', shape: 'round', x: 490, y: 50 },
      // Garden — square middle-left cluster
      { id: 6, label: 'T6', capacity: 4, zone: 'Garden', shape: 'square', x: 55, y: 175 },
      { id: 7, label: 'T7', capacity: 4, zone: 'Garden', shape: 'square', x: 195, y: 175 },
      {
        id: 8,
        label: 'T8',
        capacity: 6,
        zone: 'Garden',
        shape: 'square',
        size: 'large',
        x: 55,
        y: 295,
      },
      { id: 9, label: 'T9', capacity: 4, zone: 'Garden', shape: 'square', x: 245, y: 295 },
      // Bar Lounge — right side round
      { id: 10, label: 'T10', capacity: 2, zone: 'Bar Lounge', shape: 'round', x: 370, y: 175 },
      { id: 11, label: 'T11', capacity: 2, zone: 'Bar Lounge', shape: 'round', x: 480, y: 175 },
      { id: 12, label: 'T12', capacity: 2, zone: 'Bar Lounge', shape: 'round', x: 370, y: 285 },
      { id: 13, label: 'T13', capacity: 2, zone: 'Bar Lounge', shape: 'round', x: 480, y: 285 },
      // VIP — bottom large
      {
        id: 14,
        label: 'T14',
        capacity: 8,
        zone: 'VIP',
        shape: 'square',
        size: 'large',
        x: 55,
        y: 415,
      },
      { id: 15, label: 'T15', capacity: 4, zone: 'VIP', shape: 'square', x: 255, y: 415 },
    ],
  );
}

// ── Hotel 3: Panorama / Classic / Lounge / Suite ──────────────────────────────
function makeTables3(): RestaurantTable[] {
  return makeTables(
    [3, 6, 10, 14],
    [
      // Panorama — curved top row
      { id: 1, label: 'T1', capacity: 2, zone: 'Panorama', shape: 'round', x: 40, y: 45 },
      { id: 2, label: 'T2', capacity: 2, zone: 'Panorama', shape: 'round', x: 140, y: 45 },
      { id: 3, label: 'T3', capacity: 4, zone: 'Panorama', shape: 'round', x: 255, y: 45 },
      { id: 4, label: 'T4', capacity: 4, zone: 'Panorama', shape: 'round', x: 375, y: 45 },
      { id: 5, label: 'T5', capacity: 2, zone: 'Panorama', shape: 'round', x: 495, y: 45 },
      // Classic — square grid
      { id: 6, label: 'T6', capacity: 4, zone: 'Classic', shape: 'square', x: 40, y: 170 },
      { id: 7, label: 'T7', capacity: 4, zone: 'Classic', shape: 'square', x: 170, y: 170 },
      { id: 8, label: 'T8', capacity: 4, zone: 'Classic', shape: 'square', x: 300, y: 170 },
      { id: 9, label: 'T9', capacity: 4, zone: 'Classic', shape: 'square', x: 430, y: 170 },
      {
        id: 10,
        label: 'T10',
        capacity: 6,
        zone: 'Classic',
        shape: 'square',
        size: 'large',
        x: 40,
        y: 290,
      },
      { id: 11, label: 'T11', capacity: 4, zone: 'Classic', shape: 'square', x: 240, y: 290 },
      // Lounge — round bottom-right
      { id: 12, label: 'T12', capacity: 2, zone: 'Lounge', shape: 'round', x: 385, y: 295 },
      { id: 13, label: 'T13', capacity: 2, zone: 'Lounge', shape: 'round', x: 490, y: 295 },
      // Suite — large private bottom
      {
        id: 14,
        label: 'T14',
        capacity: 10,
        zone: 'Suite',
        shape: 'square',
        size: 'large',
        x: 40,
        y: 415,
      },
    ],
  );
}

function makeTablesForHotel(id: string | number): RestaurantTable[] {
  switch (String(id)) {
    case '2':
      return makeTables2();
    case '3':
      return makeTables3();
    default:
      return makeTables1();
  }
}

function getZoneLabels(id: string | number): { label: string; style: string }[] {
  switch (String(id)) {
    case '2':
      return [
        { label: 'TERRACE', style: 'top:18px;left:50%;transform:translateX(-50%)' },
        { label: 'GARDEN', style: 'top:185px;left:38px' },
        { label: 'BAR LOUNGE', style: 'top:185px;right:55px' },
        { label: 'VIP', style: 'top:425px;left:38px' },
      ];
    case '3':
      return [
        { label: 'PANORAMA', style: 'top:18px;left:50%;transform:translateX(-50%)' },
        { label: 'CLASSIC', style: 'top:185px;left:38px' },
        { label: 'LOUNGE', style: 'top:305px;right:38px' },
        { label: 'SUITE', style: 'top:425px;left:38px' },
      ];
    default:
      return [
        { label: 'WINDOW', style: 'top:18px;left:50%;transform:translateX(-50%)' },
        { label: 'MAIN', style: 'top:185px;left:38px' },
        { label: 'CENTRE', style: 'top:310px;left:38px' },
        { label: 'ALCOVE', style: 'top:310px;right:130px' },
        { label: 'PRIVATE', style: 'top:420px;left:38px' },
      ];
  }
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

  tables: RestaurantTable[] = [];
  selectedTable: RestaurantTable | null = null;
  confirmedTable: RestaurantTable | null = null;
  zoneLabels: { label: string; style: string }[] = [];

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
    this.tables = makeTablesForHotel(this.hotelId);
    this.zoneLabels = getZoneLabels(this.hotelId);
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
