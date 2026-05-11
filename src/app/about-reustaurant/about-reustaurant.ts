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

interface Dish {
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
  badges: string[];
  tag?: string;
}

const MENU_1: Dish[] = [
  {
    name: 'Khachapuri Royale',
    category: 'Starters',
    price: '₾28',
    description:
      "Our signature take on Georgia's most beloved bread — baked to order with aged Sulguni cheese, a slow-poached egg, and a finish of Adzharian butter and fresh herbs.",
    image:
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop',
    badges: ['Georgian Classic', 'Vegetarian'],
    tag: "Chef's Favourite",
  },
  {
    name: 'Beef Carpaccio',
    category: 'Starters',
    price: '₾42',
    description:
      'Paper-thin slices of dry-aged Wagyu beef, dressed with cold-pressed olive oil, capers, shaved Parmesan, and a walnut gremolata. Finished tableside with freshly cracked pepper.',
    image:
      'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=600&auto=format&fit=crop',
    badges: ['Gluten-Free'],
  },
  {
    name: 'Wild Mushroom Velouté',
    category: 'Starters',
    price: '₾34',
    description:
      'A silken soup of Svaneti forest mushrooms, slow-simmered with shallots and thyme, finished with truffle cream and a crisp porcini crouton.',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop',
    badges: ['Vegetarian', 'Seasonal'],
    tag: 'Seasonal',
  },
  {
    name: 'Grass-Fed Ribeye',
    category: 'Mains',
    price: '₾98',
    description:
      'A 300g dry-aged Georgian ribeye, charcoal-grilled and served with bone marrow butter, pomme purée, and a red wine Saperavi reduction.',
    image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=600&auto=format&fit=crop',
    badges: ['Gluten-Free', 'Signature'],
    tag: 'Signature',
  },
  {
    name: 'Pan-Seared Black Sea Bass',
    category: 'Mains',
    price: '₾76',
    description:
      'Fresh Black Sea bass, seared skin-side crisp on a bed of saffron-poached fennel, with dill beurre blanc and roe garnish.',
    image:
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop',
    badges: ['Gluten-Free'],
  },
  {
    name: 'Rack of Lamb Tbilisi',
    category: 'Mains',
    price: '₾88',
    description:
      'Frenched lamb rack marinated in pomegranate and Georgian spices, roasted pink with walnut tarator, roasted aubergine, and pomegranate seeds.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop',
    badges: ["Chef's Choice"],
    tag: "Chef's Choice",
  },
  {
    name: 'Wild Mushroom Risotto',
    category: 'Mains',
    price: '₾58',
    description:
      'Carnaroli rice slow-cooked with Svaneti wild mushrooms, white wine, and aged Parmesan. Finished with truffle oil and fresh thyme.',
    image:
      'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&auto=format&fit=crop',
    badges: ['Vegetarian', 'Gluten-Free'],
  },
  {
    name: 'Lobiani with Black Truffle',
    category: 'Mains',
    price: '₾52',
    description:
      'A refined Georgian bean bread — slow-baked flatbread filled with spiced kidney beans and shaved black truffle, served with chilled matsoni.',
    image:
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop',
    badges: ['Vegetarian', 'Georgian Classic'],
  },
  {
    name: 'Chocolate Fondant',
    category: 'Desserts',
    price: '₾26',
    description:
      'Warm Valrhona dark chocolate fondant with molten centre, salted caramel ice cream, cocoa tuile, and gold leaf.',
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop',
    badges: ['Gluten-Free available'],
    tag: 'Most Loved',
  },
  {
    name: 'Churchkhela Crème Brûlée',
    category: 'Desserts',
    price: '₾22',
    description:
      'Vanilla custard infused with Kakhetian walnut churchkhela, topped with caramelised sugar crust and candied walnuts.',
    image:
      'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&auto=format&fit=crop',
    badges: ['Georgian Inspired', 'Gluten-Free'],
  },
];

const MENU_2: Dish[] = [
  {
    name: 'Burrata & Heirloom Tomato',
    category: 'Starters',
    price: '₾36',
    description:
      'Creamy Italian burrata served with slow-roasted Georgian heirloom tomatoes, basil oil, aged balsamic, and a sprinkle of Maldon sea salt.',
    image:
      'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&auto=format&fit=crop',
    badges: ['Vegetarian', 'Gluten-Free'],
    tag: "Chef's Favourite",
  },
  {
    name: 'Satsivi Chicken Terrine',
    category: 'Starters',
    price: '₾38',
    description:
      'A refined terrine of poached free-range chicken bound in classic Georgian walnut satsivi sauce, set overnight and served with pomegranate jelly and herb salad.',
    image:
      'https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?w=600&auto=format&fit=crop',
    badges: ['Georgian Classic', 'Gluten-Free'],
  },
  {
    name: 'Smoked Salmon Tartare',
    category: 'Starters',
    price: '₾44',
    description:
      'Hand-cut wild Atlantic salmon with capers, shallots, dill crème fraîche, and a cucumber ribbon. Served with crisp rye blinis.',
    image:
      'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=600&auto=format&fit=crop',
    badges: ['Seasonal'],
    tag: 'Seasonal',
  },
  {
    name: 'Slow-Braised Lamb Shank',
    category: 'Mains',
    price: '₾84',
    description:
      'Georgian mountain lamb shank braised for 6 hours in Rkatsiteli wine with root vegetables, finished with gremolata and served on creamy polenta.',
    image:
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&auto=format&fit=crop',
    badges: ['Signature', 'Gluten-Free'],
    tag: 'Signature',
  },
  {
    name: 'Grilled Swordfish Steak',
    category: 'Mains',
    price: '₾72',
    description:
      'Thick-cut swordfish, marinated in lemon and Georgian adjika, grilled over charcoal. Served with roasted pepper ratatouille and olive tapenade.',
    image:
      'https://images.unsplash.com/photo-1485704686097-ed47f7263ca4?w=600&auto=format&fit=crop',
    badges: ['Gluten-Free'],
  },
  {
    name: 'Stuffed Aubergine Rolls',
    category: 'Mains',
    price: '₾48',
    description:
      'Classic Badrijani Nigvzit — flame-grilled aubergine rolls filled with spiced walnut paste and fresh garlic, garnished with pomegranate and fresh coriander.',
    image:
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop',
    badges: ['Vegetarian', 'Vegan', 'Georgian Classic'],
    tag: "Chef's Choice",
  },
  {
    name: 'Duck Confit',
    category: 'Mains',
    price: '₾82',
    description:
      'Slow-confit duck leg, skin crisped to order, served on white bean cassoulet with pickled red cabbage and a cherry and Kindzmarauli reduction.',
    image:
      'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=600&auto=format&fit=crop',
    badges: ['Gluten-Free'],
  },
  {
    name: 'Tagliatelle al Tartufo',
    category: 'Mains',
    price: '₾64',
    description:
      'Hand-rolled egg tagliatelle tossed in brown butter with shaved black truffle, aged Pecorino Romano, and a sprinkle of crispy pancetta.',
    image:
      'https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=600&auto=format&fit=crop',
    badges: [],
  },
  {
    name: 'Tiramisu Georgiano',
    category: 'Desserts',
    price: '₾24',
    description:
      'Our signature tiramisu layered with espresso-soaked savoiardi, Chacha-spiked mascarpone cream, and topped with freshly grated dark chocolate.',
    image:
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop',
    badges: ['Georgian Twist'],
    tag: 'Most Loved',
  },
  {
    name: 'Pear & Almond Tart',
    category: 'Desserts',
    price: '₾20',
    description:
      'Buttery shortcrust tart filled with frangipane and topped with thinly sliced Anjou pear, served warm with vanilla bean ice cream and a honey drizzle.',
    image:
      'https://images.unsplash.com/photo-1464219551459-ac14ae01fbe0?w=600&auto=format&fit=crop',
    badges: ['Vegetarian'],
  },
];

const MENU_3: Dish[] = [
  {
    name: 'Tuna Tataki',
    category: 'Starters',
    price: '₾46',
    description:
      'Sashimi-grade yellowfin tuna lightly seared, sliced thin, and served with a ponzu dressing, pickled ginger, micro shiso, and sesame tuile.',
    image: 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&auto=format&fit=crop',
    badges: ['Gluten-Free'],
    tag: "Chef's Favourite",
  },
  {
    name: 'Foie Gras Parfait',
    category: 'Starters',
    price: '₾54',
    description:
      'Silky duck foie gras parfait with a Sauternes jelly, served alongside toasted brioche and a fig and Chacha compote.',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop',
    badges: ['Signature'],
    tag: 'Signature',
  },
  {
    name: 'Lobster Bisque',
    category: 'Starters',
    price: '₾48',
    description:
      'A rich, deeply flavoured bisque of Atlantic lobster shells, finished with cognac cream, lobster medallions, and fresh chervil.',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop',
    badges: ['Gluten-Free', 'Seasonal'],
    tag: 'Seasonal',
  },
  {
    name: 'Wagyu Beef Tenderloin',
    category: 'Mains',
    price: '₾120',
    description:
      'A6 Wagyu beef tenderloin, rested to perfection, served with Jerusalem artichoke purée, roasted baby leeks, and a black garlic and red wine jus.',
    image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=600&auto=format&fit=crop',
    badges: ['Gluten-Free'],
    tag: "Chef's Choice",
  },
  {
    name: 'Lobster Thermidor',
    category: 'Mains',
    price: '₾115',
    description:
      'Half Atlantic lobster baked in a rich mustard and Cognac cream sauce, glazed with Gruyère and served with hand-cut pommes frites and watercress.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop',
    badges: ['Signature'],
  },
  {
    name: 'Miso-Glazed Cod',
    category: 'Mains',
    price: '₾78',
    description:
      'Black cod marinated for 48 hours in white miso and sake, slow-roasted and served with dashi broth, bok choy, and crispy lotus root chips.',
    image:
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop',
    badges: ['Gluten-Free'],
  },
  {
    name: 'Truffle Gnocchi',
    category: 'Mains',
    price: '₾68',
    description:
      'Hand-rolled potato gnocchi, pan-fried in brown butter until golden, tossed with black truffle cream, aged Parmesan snow, and crispy sage.',
    image:
      'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&auto=format&fit=crop',
    badges: ['Vegetarian'],
  },
  {
    name: "Duck Breast à l'Orange",
    category: 'Mains',
    price: '₾86',
    description:
      'Magret duck breast scored and roasted pink, served with a blood orange and Grand Marnier sauce, dauphinoise potato, and wilted spinach.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop',
    badges: ['Gluten-Free'],
  },
  {
    name: 'Soufflé au Chocolat Noir',
    category: 'Desserts',
    price: '₾30',
    description:
      'A perfectly risen dark chocolate soufflé, ordered at the start of your meal. Served with a quenelle of Tahitian vanilla ice cream and warm chocolate sauce.',
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop',
    badges: ['Must Order'],
    tag: 'Most Loved',
  },
  {
    name: 'Mango & Passion Fruit Vacherin',
    category: 'Desserts',
    price: '₾26',
    description:
      'Crisp Italian meringue shells filled with mango sorbet and passion fruit curd, finished with fresh mango salsa and a coconut tuile.',
    image:
      'https://images.unsplash.com/photo-1464219551459-ac14ae01fbe0?w=600&auto=format&fit=crop',
    badges: ['Gluten-Free', 'Vegan available'],
  },
];

const MENUS: Record<string, Dish[]> = {
  '1': MENU_1,
  '2': MENU_2,
  '3': MENU_3,
};

function getMenuForHotel(id: string | number): Dish[] {
  const key = String(id);
  return MENUS[key] ?? MENU_1;
}

@Component({
  selector: 'app-about-reustaurant',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './about-reustaurant.html',
  styleUrl: './about-reustaurant.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AboutReustaurant implements OnInit {
  isMenuOpen = false;
  hotelId: string | number = '';
  hotelName = 'AirGlo Hotel';
  hotelCity = '';

  menuCategories = ['All', 'Starters', 'Mains', 'Desserts'];
  activeCategory = 'All';
  allDishes: Dish[] = [];
  filteredDishes: Dish[] = [];

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
    this.allDishes = getMenuForHotel(this.hotelId);
    this.filteredDishes = [...this.allDishes];
    this.loadHotel();
  }

  setCategory(cat: string) {
    this.activeCategory = cat;
    this.filteredDishes =
      cat === 'All' ? [...this.allDishes] : this.allDishes.filter((d) => d.category === cat);
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
