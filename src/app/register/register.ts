import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

const RESTAURANT_API_KEY = '95eb2d55-6818-4bae-b8e1-c9d768c50633';
const AUTH_REGISTER_API =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? '/api/auth/register'
    : 'https://restaurantapi.stepacademy.ge/api/auth/register';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Register {
  isScrolled = false;
  isMenuOpen = false;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  readonly form;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{9,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 40;
  }

  get passwordMismatch(): boolean {
    const password = this.form.get('password')?.value ?? '';
    const confirmPassword = this.form.get('confirmPassword')?.value ?? '';
    return !!password && !!confirmPassword && password !== confirmPassword;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  async submit() {
    this.successMessage = '';
    this.errorMessage = '';

    this.form.markAllAsTouched();
    if (this.form.invalid || this.passwordMismatch) {
      return;
    }

    const email = this.form.value.email?.trim() ?? '';
    const firstName = this.form.value.firstName?.trim() ?? '';
    const lastName = this.form.value.lastName?.trim() ?? '';

    const payload = {
      firstName,
      lastName,
      email,
      password: this.form.value.password ?? '',
    };

    this.isSubmitting = true;

    try {
      console.log('Registering with payload:', payload);
      const response = await fetch(AUTH_REGISTER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': RESTAURANT_API_KEY,
          'X-Codeme-Token': RESTAURANT_API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      console.log('Registration response:', { status: response.status, data: responseData });

      if (!response.ok) {
        let message = 'Registration failed. Please try again.';
        message =
          responseData?.message ||
          responseData?.title ||
          responseData?.detail ||
          (Array.isArray(responseData?.errors)
            ? responseData.errors.join(', ')
            : Object.values(responseData?.errors || {})
                .flat()
                .join(', ')) ||
          JSON.stringify(responseData) ||
          message;
        this.errorMessage = message;
        console.error('Registration error:', { status: response.status, data: responseData });
        return;
      }

      
      const token =
        responseData?.accessToken ||
        responseData?.token ||
        responseData?.data?.accessToken ||
        responseData?.result?.accessToken;

      if (token) {
        localStorage.setItem('accessToken', token);
        console.log('Token saved successfully');
      } else {
        console.warn('No token found in registration response:', responseData);
      }

      this.successMessage = 'Account created successfully.';
      localStorage.setItem('isRegistered', 'true');
      this.form.reset();
    } catch {
      this.errorMessage = 'Network error. Please check your connection and retry.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
