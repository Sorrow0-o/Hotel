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

const RESTAURANT_API_KEY = '978a628d-2cd0-455c-acbe-161f048b3977';
const AUTH_REGISTER_API =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? '/api/auth/register'
    : 'https://shopapi.stepacademy.ge/api/auth/register';
const AUTH_LOGIN_API =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? '/api/auth/login'
    : 'https://shopapi.stepacademy.ge/api/auth/login';
const AUTH_FORGOT_PASSWORD_API = (email: string) =>
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? `/api/auth/forget-password/${encodeURIComponent(email)}`
    : `https://shopapi.stepacademy.ge/api/auth/forget-password/${encodeURIComponent(email)}`;

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Register implements OnInit {
  isScrolled = false;
  isMenuOpen = false;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  toastVisible = false;
  private toastTimer: any;

  activeTab: 'register' | 'login' | 'forgot' | 'verify' = 'register';

  pendingVerifyEmail = '';
  pendingPassword = '';

  isVerifySubmitting = false;
  verifyError = '';
  verifySuccess = '';

  isResendSubmitting = false;
  resendMessage = '';

  isLoginSubmitting = false;
  loginError = '';
  loginSuccess = '';

  isForgotSubmitting = false;
  forgotError = '';
  forgotSuccess = '';

  readonly form;
  readonly loginForm;
  readonly forgotForm;
  readonly verifyForm;
  readonly profileForm;

  isLoggedIn = false;
  profileFirstName = '';
  profileLastName = '';
  profileEmail = '';
  isProfileSubmitting = false;
  profileError = '';
  profileAvatar = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });

    this.verifyForm = this.fb.group({
      verifyCode: ['', [Validators.required, Validators.minLength(4)]],
    });

    this.forgotForm = this.fb.group({
      forgotEmail: ['', [Validators.required, Validators.email]],
    });

    this.profileForm = this.fb.group({
      profileFirstName: ['', [Validators.required, Validators.minLength(2)]],
      profileLastName: ['', [Validators.required, Validators.minLength(2)]],
      profileEmail: ['', [Validators.required, Validators.email]],
    });

    this.loginForm = this.fb.group({
      loginEmail: ['', [Validators.required, Validators.email]],
      loginPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.checkLoginState();
  }

  checkLoginState() {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.isLoggedIn = true;
      this.profileFirstName = localStorage.getItem('profileFirstName') ?? '';
      this.profileLastName = localStorage.getItem('profileLastName') ?? '';
      this.profileEmail = localStorage.getItem('profileEmail') ?? '';
      this.profileAvatar = localStorage.getItem('profileAvatar') ?? '';
      this.profileForm.patchValue({
        profileFirstName: this.profileFirstName,
        profileLastName: this.profileLastName,
        profileEmail: this.profileEmail,
      });
    } else {
      this.isLoggedIn = false;
    }
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isRegistered');
    this.isLoggedIn = false;
    this.profileAvatar = '';
    this.showToast('You have been logged out.');
  }

  saveProfile() {
    this.profileError = '';
    this.profileForm.markAllAsTouched();
    if (this.profileForm.invalid) return;

    this.isProfileSubmitting = true;
    const fn = this.profileForm.value.profileFirstName?.trim() ?? '';
    const ln = this.profileForm.value.profileLastName?.trim() ?? '';
    const em = this.profileForm.value.profileEmail?.trim() ?? '';

    localStorage.setItem('profileFirstName', fn);
    localStorage.setItem('profileLastName', ln);
    localStorage.setItem('profileEmail', em);
    this.profileFirstName = fn;
    this.profileLastName = ln;
    this.profileEmail = em;
    this.isProfileSubmitting = false;
    this.showToast('Profile updated successfully!');
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.showToast('Please select an image file.', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.showToast('Image must be smaller than 2 MB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.profileAvatar = base64;
      localStorage.setItem('profileAvatar', base64);
      this.showToast('Avatar updated!');
    };
    reader.readAsDataURL(file);
  }

  removeAvatar() {
    this.profileAvatar = '';
    localStorage.removeItem('profileAvatar');
    this.showToast('Avatar removed.');
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    clearTimeout(this.toastTimer);
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    this.toastTimer = setTimeout(() => {
      this.toastVisible = false;
    }, 3500);
  }

  setTab(tab: 'register' | 'login' | 'forgot' | 'verify') {
    this.activeTab = tab;
    this.errorMessage = '';
    this.successMessage = '';
    this.loginError = '';
    this.loginSuccess = '';
    this.forgotError = '';
    this.forgotSuccess = '';
    this.verifyError = '';
    this.verifySuccess = '';
    this.resendMessage = '';
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

      localStorage.setItem('profileFirstName', firstName);
      localStorage.setItem('profileLastName', lastName);
      localStorage.setItem('profileEmail', email);
      this.pendingVerifyEmail = email;
      this.pendingPassword = this.form.value.password ?? '';
      this.form.reset();
      this.setTab('verify');
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
        const loginEmail = this.loginForm.value.loginEmail?.trim() ?? '';
        const storedEmail = localStorage.getItem('profileEmail') ?? '';

        if (storedEmail !== loginEmail) {
          localStorage.removeItem('profileFirstName');
          localStorage.removeItem('profileLastName');
          localStorage.removeItem('profileAvatar');
          localStorage.setItem('profileEmail', loginEmail);
        }

        if (!storedEmail) {
          localStorage.setItem('profileEmail', loginEmail);
        }
      }

      this.loginForm.reset();
      this.checkLoginState();
      this.showToast('Logged in successfully!');
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

  async autoLogin(email: string, password: string) {
    try {
      const loginUrl =
        window.location.hostname === 'localhost'
          ? '/api/auth/login'
          : 'https://shopapi.stepacademy.ge/api/auth/login';

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': RESTAURANT_API_KEY,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      const token =
        data?.accessToken || data?.token || data?.data?.accessToken || data?.result?.accessToken;

      if (token) {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('isRegistered', 'true');
      }

      this.pendingPassword = '';
      this.checkLoginState();
      this.showToast('Welcome to AirGlo!');
    } catch {
      this.pendingPassword = '';
      this.setTab('login');
    }
  }

  async submitVerify() {
    this.verifyError = '';
    this.verifySuccess = '';

    this.verifyForm.markAllAsTouched();
    if (this.verifyForm.invalid) return;

    this.isVerifySubmitting = true;
    const code = this.verifyForm.value.verifyCode?.trim() ?? '';

    try {
      const verifyUrl =
        window.location.hostname === 'localhost'
          ? '/api/auth/verify-email'
          : 'https://shopapi.stepacademy.ge/api/auth/verify-email';

      const response = await fetch(verifyUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': RESTAURANT_API_KEY,
        },
        body: JSON.stringify({ email: this.pendingVerifyEmail, code }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        this.verifyError =
          data?.message || data?.title || data?.detail || 'Verification failed. Please try again.';
        return;
      }

      this.verifyForm.reset();
      this.showToast('Email verified! Logging you in...');
      await this.autoLogin(this.pendingVerifyEmail, this.pendingPassword);
    } catch {
      this.verifyError = 'Network error. Please check your connection and retry.';
    } finally {
      this.isVerifySubmitting = false;
    }
  }

  async resendVerification() {
    if (!this.pendingVerifyEmail) return;
    this.resendMessage = '';
    this.isResendSubmitting = true;

    try {
      const resendUrl =
        window.location.hostname === 'localhost'
          ? `/api/auth/resend-email-verification/${encodeURIComponent(this.pendingVerifyEmail)}`
          : `https://shopapi.stepacademy.ge/api/auth/resend-email-verification/${encodeURIComponent(this.pendingVerifyEmail)}`;

      const response = await fetch(resendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': RESTAURANT_API_KEY,
        },
      });

      this.resendMessage = response.ok
        ? 'A new code has been sent to your email.'
        : 'Could not resend. Please try again.';
    } catch {
      this.resendMessage = 'Network error. Please try again.';
    } finally {
      this.isResendSubmitting = false;
    }
  }
}
