import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hotel-services',
  imports: [CommonModule, RouterLink],
  templateUrl: './hotel-services.html',
  styleUrl: './hotel-services.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HotelServices {
  isScrolled = false;
  isMenuOpen = false;

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 40;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  @HostListener('document:closeMenu')
  onCloseMenu() {
    this.isMenuOpen = false;
  }
}
