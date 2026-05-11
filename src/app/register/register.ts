import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

const RESTAURANT_API_KEY = '95eb2d55-6818-4bae-b8e1-c9d768c50633';
const AUTH_REGISTER_API =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? '/api/auth/register'
    : 'https://restaurantapi.stepacademy.ge/api/auth/register';
const AUTH_LOGIN_API =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? '/api/auth/login'
    : 'https://restaurantapi.stepacademy.ge/api/auth/login';
const AUTH_FORGOT_PASSWORD_API = (email: string) =>
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? `/api/auth/forgot-password/${encodeURIComponent(email)}`
    : `https://restaurantapi.stepacademy.ge/api/auth/forgot-password/${encodeURIComponent(email)}`;

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

  activeTab: 'register' | 'login' | 'forgot' = 'register';

  isLoginSubmitting = false;
  loginError = '';
  loginSuccess = '';

  isForgotSubmitting = false;
  forgotError = '';
  forgotSuccess = '';

  readonly form;
  readonly loginForm;
  readonly forgotForm;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{9,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });

    this.forgotForm = this.fb.group({
      forgotEmail: ['', [Validators.required, Validators.email]],
    });

    this.loginForm = this.fb.group({
      loginEmail: ['', [Validators.required, Validators.email]],
      loginPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  setTab(tab: 'register' | 'login' | 'forgot') {
    this.activeTab = tab;
    this.errorMessage = '';
    this.successMessage = '';
    this.loginError = '';
    this.loginSuccess = '';
    this.forgotError = '';
    this.forgotSuccess = '';
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
  @HostListener('document:closeMenu')
  onCloseMenu() {
    this.isMenuOpen = false;
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
    const phoneNumber = this.form.value.phoneNumber?.trim() ?? '';

    const payload = {
      firstName,
      lastName,
      email,
      phoneNumber,
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

  async submitLogin() {
    this.loginError = '';
    this.loginSuccess = '';

    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    this.isLoginSubmitting = true;

    try {
      const response = await fetch(AUTH_LOGIN_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': RESTAURANT_API_KEY,
        },
        body: JSON.stringify({
          email: this.loginForm.value.loginEmail?.trim() ?? '',
          password: this.loginForm.value.loginPassword ?? '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        this.loginError =
          data?.message || data?.title || data?.detail || 'Login failed. Please try again.';
        return;
      }

      const token =
        data?.accessToken || data?.token || data?.data?.accessToken || data?.result?.accessToken;

      if (token) {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('isRegistered', 'true');
      }

      this.loginSuccess = 'Logged in successfully!';
      this.loginForm.reset();
    } catch {
      this.loginError = 'Network error. Please check your connection and retry.';
    } finally {
      this.isLoginSubmitting = false;
    }
  }

  async submitForgot() {
    this.forgotError = '';
    this.forgotSuccess = '';

    this.forgotForm.markAllAsTouched();
    if (this.forgotForm.invalid) return;

    this.isForgotSubmitting = true;
    const email = this.forgotForm.value.forgotEmail?.trim() ?? '';

    try {
      const response = await fetch(AUTH_FORGOT_PASSWORD_API(email), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': RESTAURANT_API_KEY,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        this.forgotError =
          data?.message || data?.title || data?.detail || 'Request failed. Please try again.';
        return;
      }

      this.forgotSuccess = 'A recovery email has been sent. Please check your inbox.';
      this.forgotForm.reset();
    } catch {
      this.forgotError = 'Network error. Please check your connection and retry.';
    } finally {
      this.isForgotSubmitting = false;
    }
  }
}
