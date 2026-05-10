import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';

const HOTEL_API = 'https://hotelbooking.stepprojects.ge/api/Hotels/GetAll';

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&auto=format&fit=crop',
];

@Component({
  selector: 'app-about',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  encapsulation: ViewEncapsulation.None,
})
export class About implements OnInit {
  isLoading = true;
  isMenuOpen = false;
  hotelId: string | number = '';
  hotelName = 'AirGlo Hotel';
  hotelCity = '';
  heroImage = '';
  overviewImage = GALLERY_IMAGES[1];

  stats = [
    { num: '★ 5.0', label: 'Guest Rating' },
    { num: '24h', label: 'Concierge' },
    { num: '1,200m²', label: 'Wellness Spa' },
    { num: '2009', label: 'Est. Tbilisi' },
  ];

  overview = {
    lead: 'A landmark of luxury hospitality, built for those who expect the extraordinary.',
    body1:
      'Every detail of this property has been considered with precision — from the hand-selected artwork adorning the corridors to the locally sourced materials used throughout the interiors. Our architecture team worked closely with heritage preservation experts to ensure the building honours its surroundings while delivering a wholly contemporary experience.',
    body2:
      'Guests are welcomed by a dedicated team of hospitality professionals whose sole focus is your comfort. Whether you require a private transfer, a curated dinner reservation, or simply a perfectly made coffee at 3am, the team is at your service around the clock.',
  };

  amenities = [
    { emoji: '🏊', name: 'Heated Indoor Pool' },
    { emoji: '🧖', name: 'Full Spa & Wellness' },
    { emoji: '🍽️', name: '24h Restaurant' },
    { emoji: '🍷', name: 'Beverages Included' },
    { emoji: '💳', name: 'Stay First, Pay Later' },
    { emoji: '🚗', name: 'Valet Parking' },
    { emoji: '💪', name: 'Fitness Centre' },
    { emoji: '🛎️', name: '24h Concierge' },
    { emoji: '🌐', name: 'High-Speed Wi-Fi' },
    { emoji: '✈️', name: 'Airport Transfer' },
    { emoji: '🧹', name: 'Daily Housekeeping' },
    { emoji: '🍳', name: 'Breakfast Included' },
  ];

  policies = [
    { title: 'Check-in', value: 'From 15:00' },
    { title: 'Check-out', value: 'Until 12:00' },
    { title: 'Cancellation', value: 'Free cancellation up to 48h before arrival' },
    { title: 'Payment', value: 'All major cards accepted — pay at checkout' },
    { title: 'Pets', value: 'Small pets welcome (under 10kg)' },
    { title: 'Smoking', value: 'Non-smoking property throughout' },
    { title: 'Children', value: 'All ages welcome, cots available' },
    { title: 'Minimum stay', value: 'No minimum stay required' },
  ];

  galleryImages = GALLERY_IMAGES;

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

  private async loadHotel() {
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 5000);
      const res = await fetch(HOTEL_API, { signal: controller.signal });
      if (res.ok) {
        const data = await res.json();
        const hotels: any[] = Array.isArray(data) ? data : (data.hotels ?? data.data ?? []);
        const hotel = hotels.find((h) => String(h.id ?? h.hotelId) === String(this.hotelId));
        if (hotel) {
          this.hotelName = hotel.name ?? hotel.hotelName ?? hotel.title ?? 'AirGlo Hotel';
          this.hotelCity = hotel.city ?? hotel.cityName ?? hotel.location ?? '';
          this.heroImage = hotel.image ?? hotel.imageUrl ?? hotel.photo ?? '';
          this.overviewImage = this.heroImage || GALLERY_IMAGES[1];
          this.overview.lead = `${this.hotelName} — a landmark of luxury hospitality, built for those who expect the extraordinary.`;
        }
      }
    } catch {
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}
