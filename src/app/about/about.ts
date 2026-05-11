import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
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

interface HotelContent {
  stats: { num: string; label: string }[];
  overview: { lead: string; body1: string; body2: string };
  amenities: { emoji: string; name: string }[];
  policies: { title: string; value: string }[];
  galleryImages: string[];
}

const HOTEL_CONTENT: Record<string, HotelContent> = {
  '1': {
    stats: [
      { num: '★ 5.0', label: 'Guest Rating' },
      { num: '24h', label: 'Concierge' },
      { num: '1,200m²', label: 'Wellness Spa' },
      { num: '2009', label: 'Est. Tbilisi' },
    ],
    overview: {
      lead: 'A landmark of Georgian luxury hospitality, built for those who expect the extraordinary.',
      body1:
        'Every detail of this property has been considered with precision — from the hand-selected artwork adorning the corridors to the locally sourced materials used throughout the interiors. Our architecture team worked closely with heritage preservation experts to ensure the building honours its surroundings while delivering a wholly contemporary experience.',
      body2:
        'Guests are welcomed by a dedicated team of hospitality professionals whose sole focus is your comfort. Whether you require a private transfer, a curated dinner reservation, or simply a perfectly made coffee at 3am, the team is at your service around the clock.',
    },
    amenities: [
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
    ],
    policies: [
      { title: 'Check-in', value: 'From 15:00' },
      { title: 'Check-out', value: 'Until 12:00' },
      { title: 'Cancellation', value: 'Free cancellation up to 48h before arrival' },
      { title: 'Payment', value: 'All major cards accepted — pay at checkout' },
      { title: 'Pets', value: 'Small pets welcome (under 10kg)' },
      { title: 'Smoking', value: 'Non-smoking property throughout' },
      { title: 'Children', value: 'All ages welcome, cots available' },
      { title: 'Minimum stay', value: 'No minimum stay required' },
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&auto=format&fit=crop',
    ],
  },

  '2': {
    stats: [
      { num: '★ 4.8', label: 'Guest Rating' },
      { num: '340', label: 'Rooms & Suites' },
      { num: '3', label: 'Dining Venues' },
      { num: '2013', label: 'Est. Tbilisi' },
    ],
    overview: {
      lead: 'Where modern comfort meets Georgian warmth — a hotel designed for the way people travel today.',
      body1:
        'The Courtyard by Marriott Tbilisi was conceived as a different kind of hotel: one that removes every friction from the guest experience without sacrificing character. Every room is designed to feel like a considered space rather than a transient one — with natural light, local materials, and the kind of thoughtful details that make a long stay feel like home.',
      body2:
        'Our team has built a culture around anticipating needs before they are expressed. From the moment of arrival to the final checkout, every interaction is handled with quiet efficiency and genuine warmth — the hallmark of Georgian hospitality, elevated to an international standard.',
    },
    amenities: [
      { emoji: '🏋️', name: 'State-of-Art Gym' },
      { emoji: '🛁', name: 'Deep Soak Bathtubs' },
      { emoji: '🍽️', name: 'Three Dining Venues' },
      { emoji: '☕', name: 'In-Room Coffee Bar' },
      { emoji: '💳', name: 'Stay First, Pay Later' },
      { emoji: '🚿', name: 'Rain Shower Suites' },
      { emoji: '🌿', name: 'Garden Terrace' },
      { emoji: '🛎️', name: '24h Concierge' },
      { emoji: '🌐', name: 'High-Speed Wi-Fi' },
      { emoji: '🧴', name: 'Premium Toiletries' },
      { emoji: '🧹', name: 'Daily Housekeeping' },
      { emoji: '🍳', name: 'Full Breakfast' },
    ],
    policies: [
      { title: 'Check-in', value: 'From 14:00' },
      { title: 'Check-out', value: 'Until 12:00' },
      { title: 'Cancellation', value: 'Free cancellation up to 24h before arrival' },
      { title: 'Payment', value: 'All major cards, bank transfer & crypto' },
      { title: 'Pets', value: 'Not permitted (guide dogs welcome)' },
      { title: 'Smoking', value: 'Dedicated outdoor smoking areas only' },
      { title: 'Children', value: 'Children under 12 stay free with parents' },
      { title: 'Minimum stay', value: 'No minimum stay required' },
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?w=600&auto=format&fit=crop',
    ],
  },

  '3': {
    stats: [
      { num: '★ 4.9', label: 'Guest Rating' },
      { num: '27F', label: 'Floors of Views' },
      { num: '1967', label: 'Originally Built' },
      { num: '2017', label: 'Fully Reimagined' },
    ],
    overview: {
      lead: 'A Soviet-era icon, completely reimagined — where the history of Tbilisi meets the future of luxury.',
      body1:
        "The Radisson Blu Iveria Hotel stands on a site that has defined Tbilisi's skyline since 1967. Originally built as the most prestigious address in the Soviet Caucasus, the Iveria was reimagined from the ground up in 2017 — restoring its architectural grandeur while equipping it with every amenity a contemporary traveller demands. The result is a hotel that carries the weight of history without being burdened by it.",
      body2:
        "From the upper floors, every room commands an unobstructed view of the old town, the Narikala fortress, and the sweeping curve of the Mtkvari river. The hotel's position at the centre of Tbilisi's cultural and commercial life makes it the natural choice for those who want to be immersed in the city — not insulated from it.",
    },
    amenities: [
      { emoji: '🌆', name: 'Panoramic City Views' },
      { emoji: '🏊', name: 'Rooftop Pool' },
      { emoji: '🧖', name: 'Award-Winning Spa' },
      { emoji: '🍽️', name: 'Signature Restaurant' },
      { emoji: '🍸', name: 'Sky Bar & Lounge' },
      { emoji: '💳', name: 'Stay First, Pay Later' },
      { emoji: '🏛️', name: 'Heritage Architecture' },
      { emoji: '🛎️', name: '24h Butler Service' },
      { emoji: '🌐', name: 'High-Speed Wi-Fi' },
      { emoji: '✈️', name: 'Private Airport Transfer' },
      { emoji: '🧹', name: 'Twice-Daily Housekeeping' },
      { emoji: '🎭', name: 'Cultural Concierge' },
    ],
    policies: [
      { title: 'Check-in', value: 'From 15:00 (early check-in from 12:00)' },
      { title: 'Check-out', value: 'Until 12:00 (late check-out until 15:00)' },
      { title: 'Cancellation', value: 'Free cancellation up to 72h before arrival' },
      { title: 'Payment', value: 'All major cards — invoice available for corporates' },
      { title: 'Pets', value: 'Not permitted' },
      { title: 'Smoking', value: 'Strictly non-smoking throughout' },
      { title: 'Children', value: 'Children of all ages welcome' },
      { title: 'Minimum stay', value: '2 nights minimum on weekends & holidays' },
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop',
    ],
  },
};

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

  stats: HotelContent['stats'] = [];
  overview: HotelContent['overview'] = { lead: '', body1: '', body2: '' };
  amenities: HotelContent['amenities'] = [];
  policies: HotelContent['policies'] = [];
  galleryImages: string[] = [];

  private loadContent() {
    const content = HOTEL_CONTENT[String(this.hotelId)] ?? HOTEL_CONTENT['1'];
    this.stats = content.stats;
    this.overview = { ...content.overview };
    this.amenities = content.amenities;
    this.policies = content.policies;
    this.galleryImages = content.galleryImages;
  }

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:closeMenu')
  onCloseMenu() {
    this.isMenuOpen = false;
  }

  ngOnInit() {
    this.hotelId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadContent();
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
        }
      }
    } catch {
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}
