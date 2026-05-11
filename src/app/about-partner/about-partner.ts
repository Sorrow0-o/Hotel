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

interface HotelStory {
  year: string;
  lead: string;
  p1: string;
  p2: string;
  p3: string;
}

const STORIES: Record<string, HotelStory> = {
  '1': {
    year: '2009',
    lead: 'From a shared belief in exceptional hospitality to a partnership that has redefined luxury in Tbilisi.',
    p1: "When AirGlo's founders first visited The Biltmore Hotel Tbilisi in 2009, they saw the same thing our team had always believed in — that a hotel should feel like the finest home you have ever stayed in. Two architects with a deep respect for Georgian heritage sat across from our management team and described a vision that was, word for word, our own.",
    p2: 'The decision to join the AirGlo Luxury Collection was not a business arrangement — it was a recognition of shared values. AirGlo gave us access to a global guest network, world-class operational support, and the credibility of one of the most respected names in boutique hospitality. In return, we brought our intimate knowledge of Tbilisi, our loyal guests, and a property that had already earned its reputation without compromise.',
    p3: 'Today, after more than a decade of collaboration, every standard has been raised and every ambition exceeded. The partnership remains, as it began, a matter of mutual respect and shared excellence.',
  },
  '2': {
    year: '2013',
    lead: 'A partnership built on the belief that comfort and character can coexist — and that Tbilisi deserved both.',
    p1: "The Courtyard by Marriott Tbilisi joined the AirGlo Luxury Collection in 2013, following three years of quiet conversations between two teams who saw the hospitality industry differently. AirGlo's founders had been watching our property grow — not just in occupancy, but in reputation — and reached out with a proposition that surprised us with its simplicity: join us, and we will build something together that neither of us could achieve alone.",
    p2: 'What followed was a year of careful alignment. Our service philosophy, our approach to guest relationships, our investment in local culture — all of it was examined, respected, and woven into the AirGlo framework without compromise. The collection did not ask us to become something we were not. It asked us to become more fully what we already were.',
    p3: 'More than a decade on, the partnership continues to evolve. New initiatives, new amenities, and a shared commitment to raising the bar for what modern luxury hospitality can look like in the Caucasus region.',
  },
  '3': {
    year: '2017',
    lead: 'When a landmark property meets a collection that values legacy — the result is something truly lasting.',
    p1: 'The Radisson Blu Iveria Hotel Tbilisi carries a history that stretches back to the Soviet era, when it stood as the most prestigious address in the city. When AirGlo approached us in 2016, they were drawn not only to the property itself, but to the weight of that history — and to our commitment to honouring it while transforming the guest experience for a new generation of travellers.',
    p2: 'The partnership was formalised in 2017 after an extensive collaborative process. AirGlo worked alongside our heritage consultants, our architectural team, and our longtime staff to ensure that the renovation and repositioning of the hotel remained true to its origins. The result was a property that felt both timeless and entirely contemporary — a balance that the AirGlo collection understood instinctively.',
    p3: 'Since joining the collection, the Iveria has welcomed guests from over 80 countries, hosted state dinners, and been recognised repeatedly as one of the finest addresses in the South Caucasus. We credit this in equal measure to our own team and to the platform that AirGlo has provided.',
  },
};

const DEFAULT_STORY: HotelStory = STORIES['1'];

@Component({
  selector: 'app-about-partner',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './about-partner.html',
  styleUrl: './about-partner.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AboutPartner implements OnInit {
  isMenuOpen = false;
  hotelId: string | number = '';
  hotelName = 'AirGlo Hotel';
  hotelCity = '';
  story: HotelStory = DEFAULT_STORY;

  partners = [
    {
      icon: '🚗',
      category: 'Transport',
      name: 'Mercedes-Benz Georgia',
      desc: 'Exclusive airport transfers and city tours in a premium Mercedes-Benz fleet with professional drivers.',
    },
    {
      icon: '🍷',
      category: 'Wine & Spirits',
      name: 'Château Mukhrani',
      desc: "Georgia's oldest royal winery, supplying our cellar with exclusive labels unavailable elsewhere in Tbilisi.",
    },
    {
      icon: '🧖',
      category: 'Wellness',
      name: 'Sulphur Spring Spa',
      desc: "Tbilisi's legendary natural sulphur springs, private sessions bookable exclusively through our concierge.",
    },
    {
      icon: '🎭',
      category: 'Culture',
      name: 'Tbilisi Opera & Ballet',
      desc: "Priority access and private box reservations at Georgia's most celebrated performance venue.",
    },
    {
      icon: '🌿',
      category: 'Farm & Produce',
      name: 'Kindzmarauli Estate',
      desc: 'Heritage-breed meats, organic vegetables, and aged cheeses sourced directly from this family-run estate.',
    },
    {
      icon: '💎',
      category: 'Luxury Retail',
      name: 'Fabrika Concept Store',
      desc: 'Curated Georgian design, jewellery, and fashion — delivered to your room or available for in-store private appointments.',
    },
  ];

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
    this.story = STORIES[String(this.hotelId)] ?? DEFAULT_STORY;
    this.loadHotel();
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
