import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const isInsideNav =
      target.closest('.nav-links') ||
      target.closest('.hs-nav') ||
      target.closest('.hamburger') ||
      target.closest('.hs-hamburger');

    if (isInsideNav) return;

    
    document.dispatchEvent(new CustomEvent('closeMenu'));
  }
}
