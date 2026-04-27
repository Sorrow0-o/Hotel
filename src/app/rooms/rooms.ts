import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

const BASE_URL = 'https://hotelbooking.stepprojects.ge/api/Rooms/GetRoom';
const TYPES_URL = 'https://hotelbooking.stepprojects.ge/api/Rooms/GetRoomTypes';
const AVAILABLE_URL = 'https://hotelbooking.stepprojects.ge/api/Rooms/GetAvailableRooms';
const FILTERED_URL = 'https://hotelbooking.stepprojects.ge/api/Rooms/GetFiltered';
const ROOM_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Type map populated from API: { 1: 'Single Room', 2: 'Double Room', 3: 'Deluxe Room' }
type RoomTypeMap = Record<number, string>;

@Component({
  selector: 'app-rooms',
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  templateUrl: './rooms.html',
  styleUrl: './rooms.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Rooms implements OnInit {
  isScrolled = false;
  isMenuOpen = false;
  isLoading = true;

  allRooms: any[] = [];
  displayedRooms: any[] = [];
  roomTypes: { id: number; name: string }[] = [];
  typeMap: RoomTypeMap = {};
  activeType = 'All';

  minPrice = 0;
  maxPrice = 1000;
  checkIn = '';
  checkOut = '';
  guests = 1;

  roomImages = [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=700&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=700&auto=format&fit=crop',
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 40;
  }

  ngOnInit() {
    this.isScrolled = window.scrollY > 40;
    // Load types first so rooms get correct names
    this.loadRoomTypes().then(() => this.loadRooms());
  }

  private async loadRooms() {
    this.isLoading = true;
    try {
      const requests = ROOM_IDS.map((id) =>
        fetch(`${BASE_URL}/${id}`).then((res) => {
          if (!res.ok) throw new Error('not found');
          return res.json();
        }),
      );

      const results = await Promise.allSettled(requests);

      const rooms = results
        .map((result, i) => {
          if (result.status === 'fulfilled') {
            const r = result.value;
            // Resolve type name: use typeMap from API, fallback to raw field
            const typeId = r.roomTypeId ?? r.typeId ?? null;
            const typeName =
              typeId && this.typeMap[typeId]
                ? this.typeMap[typeId]
                : r.roomTypeName || r.type || 'Deluxe Room';
            return {
              id: r.id ?? ROOM_IDS[i],
              name: r.roomName || r.name || r.title || 'Luxury Room',
              type: typeName,
              typeId: typeId,
              price: r.price || r.pricePerNight || 250,
              amenities: this.extractAmenities(r),
              image: this.roomImages[i % this.roomImages.length],
              description: r.description || '',
              maxGuests: r.maxGuests || r.guests || 2,
            };
          }
          return null;
        })
        .filter(Boolean);

      this.allRooms = rooms;
      // Only fall back to extracting from rooms if API types weren't loaded
      if (!this.roomTypes.length) this.extractTypes();
      this.displayedRooms = [...this.allRooms];
    } catch {
      this.allRooms = [];
      this.displayedRooms = [];
    } finally {
      this.isLoading = false;
    }
  }

  private async loadRoomTypes(): Promise<void> {
    try {
      const res = await fetch(TYPES_URL);
      if (res.ok) {
        const data: { id: number; name: string }[] = await res.json();
        if (Array.isArray(data) && data.length) {
          // Build lookup map: { 1: 'Single Room', 2: 'Double Room', 3: 'Deluxe Room' }
          data.forEach((t) => {
            this.typeMap[t.id] = t.name;
          });
          // Always show all types in filter, regardless of fetched rooms
          this.roomTypes = data;
        }
      }
    } catch {}
  }

  private extractTypes() {
    const seen = new Set<string>();
    this.allRooms.forEach((r) => seen.add(r.type));
    this.roomTypes = Array.from(seen).map((name, i) => ({ id: i + 1, name }));
  }

  extractAmenities(room: any): string[] {
    const list = room.amenities || room.features || [];
    if (!list.length) return ['Free WiFi', 'Luxury Bedding', '24h Service'];
    return list
      .slice(0, 3)
      .map((a: any) => (typeof a === 'string' ? a : a.name || a.amenityName || 'Amenity'));
  }

  setActiveType(type: string) {
    this.activeType = type;
    this.applyFilter();
  }

  async applyFilter() {
    // If both dates are set → ask the API for available rooms in that window
    if (this.checkIn && this.checkOut) {
      await this.applyDateFilter();
      return;
    }
    // Otherwise filter locally
    this.applyLocalFilter(this.allRooms);
  }

  private async applyDateFilter() {
    this.isLoading = true;
    try {
      // Try POST /GetFiltered first
      const body = {
        checkIn: this.checkIn,
        checkOut: this.checkOut,
        startDate: this.checkIn,
        endDate: this.checkOut,
        guests: this.guests,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
      };

      let availableIds: Set<number> | null = null;

      const postRes = await fetch(FILTERED_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (postRes.ok) {
        const data = await postRes.json();
        const raw: any[] = Array.isArray(data) ? data : data.rooms || data.data || [];
        if (raw.length > 0) {
          availableIds = new Set(raw.map((r: any) => r.id));
        }
      }

      // Fallback: GET /GetAvailableRooms with query params
      if (!availableIds) {
        const params = new URLSearchParams({
          checkIn: this.checkIn,
          checkOut: this.checkOut,
          startDate: this.checkIn,
          endDate: this.checkOut,
        });
        const getRes = await fetch(`${AVAILABLE_URL}?${params}`);
        if (getRes.ok) {
          const data = await getRes.json();
          const raw: any[] = Array.isArray(data) ? data : data.rooms || data.data || [];
          if (raw.length > 0) {
            availableIds = new Set(raw.map((r: any) => r.id));
          }
        }
      }

      // Filter our locally cached rooms by available IDs from API
      const base = availableIds
        ? this.allRooms.filter((r) => availableIds!.has(r.id))
        : this.allRooms; // API gave nothing useful → show all

      this.applyLocalFilter(base);
    } catch {
      // Network error — fall back to local filter silently
      this.applyLocalFilter(this.allRooms);
    } finally {
      this.isLoading = false;
    }
  }

  private applyLocalFilter(base: any[]) {
    let rooms = [...base];
    if (this.activeType !== 'All') {
      rooms = rooms.filter((r) => r.type === this.activeType);
    }
    rooms = rooms.filter((r) => r.price >= this.minPrice && r.price <= this.maxPrice);
    if (this.guests > 1) {
      rooms = rooms.filter((r) => r.maxGuests >= this.guests);
    }
    this.displayedRooms = rooms;
  }

  resetFilter() {
    this.minPrice = 0;
    this.maxPrice = 1000;
    this.checkIn = '';
    this.checkOut = '';
    this.guests = 1;
    this.activeType = 'All';
    this.displayedRooms = [...this.allRooms];
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    this.isMenuOpen = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
