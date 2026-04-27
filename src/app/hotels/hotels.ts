import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hotels.html',
  styleUrl: './hotels.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Hotels implements OnInit {
  hotels: any[] = [];
  cities: any[] = [];
  selectedCity: string | null = null;
  isLoading = true;
  isScrolled = false;

  fallbackHotels = [
    {
      id: 1,
      name: 'The Biltmore Hotel Tbilisi',
      cityName: 'Tbilisi',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop',
    },
    {
      id: 2,
      name: 'Courtyard by Marriott Tbilisi',
      cityName: 'Tbilisi',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop',
    },
    {
      id: 3,
      name: 'Radisson Blu Iveria Tbilisi',
      cityName: 'Tbilisi',
      image:
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&auto=format&fit=crop',
    },
    {
      id: 4,
      name: 'Sheraton Grand Tbilisi Metechi',
      cityName: 'Tbilisi',
      image:
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&auto=format&fit=crop',
    },
    {
      id: 5,
      name: 'Rooms Hotel Tbilisi',
      cityName: 'Tbilisi',
      image:
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop',
    },
    {
      id: 6,
      name: 'Hotel Stamba',
      cityName: 'Tbilisi',
      image:
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop',
    },
  ];

  fallbackCities = ['Tbilisi'];

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 40;
  }

  ngOnInit() {
    this.isScrolled = window.scrollY > 40;

    
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);

   
    fetch('https://hotelbooking.stepprojects.ge/api/Hotels/GetCities', {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          this.cities = data;
        } else if (data.cities) {
          this.cities = data.cities;
        } else {
          this.cities = this.fallbackCities;
        }
      })
      .catch(() => {
        this.cities = this.fallbackCities;
      });

    
    fetch('https://hotelbooking.stepprojects.ge/api/Hotels/GetAll', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        let rawHotels = [];
        if (Array.isArray(data)) {
          rawHotels = data;
        } else if (data.hotels) {
          rawHotels = data.hotels;
        } else if (data.data) {
          rawHotels = data.data;
        }

        this.hotels = rawHotels.length > 0 ? rawHotels : this.fallbackHotels;
        this.isLoading = false;
      })
      .catch(() => {
        this.hotels = this.fallbackHotels;
        this.cities = this.fallbackCities;
        this.isLoading = false;
      });
  }

  getFilteredHotels() {
    if (this.selectedCity === null) {
      return this.hotels;
    }
    const result = [];
    for (let i = 0; i < this.hotels.length; i++) {
      const hotel = this.hotels[i];
      if (hotel.city === this.selectedCity || hotel.cityName === this.selectedCity) {
        result.push(hotel);
      }
    }
    return result;
  }

  onCityClick(city: string) {
    if (this.selectedCity === city) {
      this.selectedCity = null;
    } else {
      this.selectedCity = city;
    }
  }

  getHotelName(hotel: any): string {
    return hotel.name || hotel.hotelName || hotel.title || 'Hotel';
  }

  getHotelCity(hotel: any): string {
    return hotel.city || hotel.cityName || hotel.location || '';
  }

  getHotelImage(hotel: any): string {
    if (hotel.image) return hotel.image;
    if (hotel.imageUrl) return hotel.imageUrl;
    if (hotel.photo) return hotel.photo;

    const fallbacks = [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&auto=format&fit=crop',
    ];
    return fallbacks[hotel.id % fallbacks.length] || fallbacks[0];
  }
}
