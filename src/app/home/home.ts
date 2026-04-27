import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

const BASE_URL = 'https://hotelbooking.stepprojects.ge/api/Rooms/GetRoom';
const ROOM_IDS = [1, 2, 3, 4, 5, 6, 7, 8];

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, HttpClientModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Home implements OnInit {
  isScrolled = false;
  isMenuOpen = false;
  isLoading = true;
  rooms: any[] = [];

  heroStats = [
    { num: '24+', label: 'Properties Worldwide' },
    { num: '98%', label: 'Guest Satisfaction' },
    { num: '2009', label: 'Founded in Tbilisi' },
  ];

  uspItems = [
    {
      icon: 'beverage',
      title: 'Beverages Included',
      desc: 'From morning espresso to evening aperitivo — premium drinks flow freely throughout your stay.',
    },
    {
      icon: 'card',
      title: 'Stay First, Pay Later',
      desc: 'Reserve your room today and settle the bill on departure. No card holds, no surprises.',
    },
    {
      icon: 'restaurant',
      title: '24 Hour Restaurant',
      desc: 'Midnight cravings or early risers — our kitchen never sleeps. World-class cuisine, any hour.',
    },
    {
      icon: 'spa',
      title: 'Spa Included',
      desc: 'Every stay includes full access to our award-winning wellness sanctuary. Unwind completely.',
    },
  ];

  timeline = [
    {
      year: '2009',
      text: "First AirGlo property opens in Tbilisi's historic Abanotubani district — 12 rooms, instant acclaim.",
    },
    {
      year: '2013',
      text: 'Expansion to Batumi and Yerevan. AirGlo wins "Best Boutique Hotel" at the Caucasus Hospitality Awards.',
    },
    {
      year: '2017',
      text: 'International debut. Properties open in Vienna, Lisbon, and Dubai — each designed by local architects.',
    },
    {
      year: '2021',
      text: 'AirGlo Digital launches: seamless online booking, virtual concierge, and personalised stay profiles.',
    },
    {
      year: '2024',
      text: '24 properties worldwide. Ranked in the global top 50 luxury hotel brands for the third consecutive year.',
    },
  ];

  fallbackRooms = [
    {
      id: 1,
      name: 'Grand Deluxe Suite',
      type: 'Suite',
      price: 420,
      amenities: ['King Bed', 'City View', 'Jacuzzi'],
      imgIndex: 0,
    },
    {
      id: 2,
      name: 'Premium Ocean Room',
      type: 'Deluxe',
      price: 290,
      amenities: ['Sea View', 'Balcony', 'Minibar'],
      imgIndex: 1,
    },
    {
      id: 3,
      name: 'Executive Penthouse',
      type: 'Penthouse',
      price: 850,
      amenities: ['Panoramic View', 'Private Pool', 'Butler'],
      imgIndex: 2,
    },
    {
      id: 4,
      name: 'Classic Double Room',
      type: 'Classic',
      price: 195,
      amenities: ['Garden View', 'King Bed', 'Breakfast'],
      imgIndex: 3,
    },
    {
      id: 5,
      name: 'Prestige Junior Suite',
      type: 'Suite',
      price: 380,
      amenities: ['Lounge Area', 'Bathtub', 'Mini Bar'],
      imgIndex: 4,
    },
    {
      id: 6,
      name: 'Signature Sky Room',
      type: 'Deluxe',
      price: 310,
      amenities: ['Sky View', 'Rainfall Shower', 'Desk'],
      imgIndex: 5,
    },
    {
      id: 7,
      name: 'Royal Garden Suite',
      type: 'Suite',
      price: 510,
      amenities: ['Garden Terrace', 'King Bed', 'Butler'],
      imgIndex: 6,
    },
    {
      id: 8,
      name: 'Horizon Loft Room',
      type: 'Deluxe',
      price: 340,
      amenities: ['Panoramic View', 'Open Bathroom', 'Minibar'],
      imgIndex: 7,
    },
  ];

  roomImages = [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&auto=format&fit=crop',
  ];

  constructor(private http: HttpClient) {}

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 40;
  }

  ngOnInit() {
    this.isScrolled = window.scrollY > 40;
    this.loadRoomsById();
  }

  private async loadRoomsById(): Promise<void> {
    try {
      // Fetch all 6 rooms in parallel
      const requests = ROOM_IDS.map((id) =>
        fetch(`${BASE_URL}/${id}`).then((res) => {
          if (!res.ok) throw new Error(`Room ${id} not found`);
          return res.json();
        }),
      );

      // Wait for all — settle individually so one failure doesn't break the rest
      const results = await Promise.allSettled(requests);

      const fetchedRooms = results
        .map((result, index) => {
          if (result.status === 'fulfilled') {
            const room = result.value;
            return {
              id: room.id ?? ROOM_IDS[index],
              name: room.roomName || room.name || room.title || 'Luxury Room',
              type: room.roomTypeName || room.type || 'Deluxe',
              price: room.price || room.pricePerNight || 250,
              amenities: this.getAmenities(room),
              imgIndex: index,
            };
          }
          return null;
        })
        .filter(Boolean);

      this.rooms = fetchedRooms.length > 0 ? fetchedRooms : this.fallbackRooms;
    } catch {
      this.rooms = this.fallbackRooms;
    } finally {
      this.isLoading = false;
    }
  }

  getImage(index: number): string {
    return this.roomImages[index];
  }

  scrollTo(id: string) {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    this.isMenuOpen = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  getAmenities(room: any): string[] {
    let amenityList = [];

    if (room.amenities && room.amenities.length > 0) {
      amenityList = room.amenities;
    } else if (room.features && room.features.length > 0) {
      amenityList = room.features;
    } else {
      return ['Luxury', 'Free WiFi', '24h Service'];
    }

    const result = [];
    for (let i = 0; i < amenityList.length && i < 3; i++) {
      const item = amenityList[i];
      if (typeof item === 'string') {
        result.push(item);
      } else if (item.name) {
        result.push(item.name);
      } else if (item.amenityName) {
        result.push(item.amenityName);
      }
    }

    return result;
  }
}
