import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Review {
  id: string;
  name: string;
  initials: string;
  stay: string;
  rating: number;
  title: string;
  body: string;
  category: string;
  date: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: 'mock-1',
    name: 'Sophia Laurent',
    initials: 'SL',
    stay: 'Penthouse Suite',
    rating: 5,
    title: 'An absolutely unforgettable experience',
    body: 'From the moment we arrived, every detail was perfect. The penthouse suite offered breathtaking views and the concierge team went above and beyond to make our anniversary truly special.',
    category: 'Rooms',
    date: 'March 2025',
  },
  {
    id: 'mock-2',
    name: 'James Whitfield',
    initials: 'JW',
    stay: 'Deluxe King Room',
    rating: 5,
    title: 'World-class service, every single time',
    body: 'This was our third stay at AirGlo and the standard has only risen. The staff remember your preferences, the linens are impeccable, and the breakfast is extraordinary.',
    category: 'Service',
    date: 'February 2025',
  },
  {
    id: 'mock-3',
    name: 'Nino Beridze',
    initials: 'NB',
    stay: 'Garden View Suite',
    rating: 5,
    title: 'Pure luxury in every corner',
    body: 'The spa facilities are unrivalled. I spent two full days simply relaxing and the therapists were exceptionally skilled. The room itself was a serene sanctuary.',
    category: 'Spa',
    date: 'January 2025',
  },
  {
    id: 'mock-4',
    name: 'Marco Ferretti',
    initials: 'MF',
    stay: 'Classic Double',
    rating: 4,
    title: 'Exceptional dining, great atmosphere',
    body: 'The in-house restaurant exceeded all expectations. The tasting menu was a culinary journey and the wine pairing was thoughtfully curated. A minor wait at check-in aside, everything was superb.',
    category: 'Dining',
    date: 'December 2024',
  },
  {
    id: 'mock-5',
    name: 'Amara Osei',
    initials: 'AO',
    stay: 'Junior Suite',
    rating: 5,
    title: 'Perfectly located, perfectly executed',
    body: 'The central location made exploring effortless while the hotel itself felt like a quiet escape from the city. Staff were warm and genuinely attentive — never intrusive.',
    category: 'Location',
    date: 'November 2024',
  },
  {
    id: 'mock-6',
    name: 'Elena Petrov',
    initials: 'EP',
    stay: 'Premier Room',
    rating: 5,
    title: 'The gold standard for luxury stays',
    body: 'I travel frequently for work and AirGlo has become my non-negotiable choice. Reliable, refined, and genuinely luxurious. The evening turndown service is a lovely touch.',
    category: 'Service',
    date: 'October 2024',
  },
];

@Component({
  selector: 'app-reviews',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Reviews implements OnInit {
  isScrolled = false;
  isMenuOpen = false;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  selectedRating = 0;
  hoverRating = 0;

  filters = ['All', 'Rooms', 'Service', 'Dining', 'Spa', 'Location'];
  activeFilter = 'All';

  allReviews: Review[] = [...MOCK_REVIEWS];
  filteredReviews: Review[] = [...MOCK_REVIEWS];
  userReviewIds = new Set<string>();

  readonly form;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      stay: ['', [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(4)]],
      body: ['', [Validators.required, Validators.minLength(20)]],
      category: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadFromStorage();
    this.filteredReviews = [...this.allReviews];
  }

  private saveToStorage() {
    const userReviews = this.allReviews.filter((r) => this.userReviewIds.has(r.id));
    localStorage.setItem('airglo_user_reviews', JSON.stringify(userReviews));
    localStorage.setItem('airglo_user_review_ids', JSON.stringify([...this.userReviewIds]));
  }

  private loadFromStorage() {
    try {
      const savedIds: string[] = JSON.parse(localStorage.getItem('airglo_user_review_ids') ?? '[]');
      const savedReviews: Review[] = JSON.parse(
        localStorage.getItem('airglo_user_reviews') ?? '[]',
      );
      if (savedReviews.length > 0) {
        this.allReviews = [...savedReviews, ...MOCK_REVIEWS];
        this.userReviewIds = new Set(savedIds);
      }
    } catch {
      
    }
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 40;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.filteredReviews =
      filter === 'All'
        ? [...this.allReviews]
        : this.allReviews.filter((r) => r.category === filter);
  }

  setRating(value: number) {
    this.selectedRating = value;
  }

  getStars(rating: number): boolean[] {
    return [1, 2, 3, 4, 5].map((i) => i <= rating);
  }

  async submit() {
    this.successMessage = '';
    this.errorMessage = '';

    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }
    if (this.selectedRating === 0) {
      this.errorMessage = 'Please select a star rating.';
      return;
    }

    this.isSubmitting = true;

    await new Promise((r) => setTimeout(r, 800));

    const { name, stay, title, body, category } = this.form.value;

    const newId = 'user-' + Date.now();

    const newReview: Review = {
      id: newId,
      name: name?.trim() ?? '',
      initials: (name?.trim() ?? '')
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      stay: stay?.trim() ?? '',
      rating: this.selectedRating,
      title: title?.trim() ?? '',
      body: body?.trim() ?? '',
      category: category ?? '',
      date: new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
    };

    this.allReviews = [newReview, ...this.allReviews];
    this.userReviewIds.add(newId);
    this.saveToStorage();
    this.setFilter(this.activeFilter);

    this.successMessage = 'Thank you! Your review has been published.';
    this.form.reset();
    this.selectedRating = 0;
    this.isSubmitting = false;
  }

  deleteReview(id: string) {
    this.allReviews = this.allReviews.filter((r) => r.id !== id);
    this.userReviewIds.delete(id);
    this.saveToStorage();
    this.setFilter(this.activeFilter);
  }
}
