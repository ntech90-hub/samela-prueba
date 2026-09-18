import { Injectable, signal, computed } from '@angular/core';
import { UserProfile } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'samela_current_user_v1';
  private readonly USERS_STORAGE_KEY = 'samela_registered_users_v1';

  // Seed default registered users for instant testing in production simulation
  private registeredUsers: UserProfile[] = [
    {
      id: 'usr-001',
      fullName: 'Camila Andrea Mendoza',
      email: 'camila.mendoza@gmail.com',
      phone: '3145678901',
      documentId: '1023948572',
      address: 'Carrera 15 # 93-40, Apto 402',
      city: 'Bogotá D.C.',
      neighborhood: 'Chicó Norte',
      additionalNotes: 'Conjunto cerrado con portería 24h, dejar en recepción.',
      createdAt: '2026-09-01'
    },
    {
      id: 'usr-002',
      fullName: 'Valentina Restrepo Gil',
      email: 'valentina.restrepo@hotmail.com',
      phone: '3209876543',
      documentId: '1037629481',
      address: 'Calle 10A # 43B-25, Interior 3',
      city: 'Medellín',
      neighborhood: 'El Poblado',
      additionalNotes: 'Timbrar al citófono 301.',
      createdAt: '2026-09-10'
    }
  ];

  readonly currentUser = signal<UserProfile | null>(null);
  readonly isAuthModalOpen = signal<boolean>(false);
  readonly authModalMode = signal<'login' | 'register'>('login');
  readonly authNoticeMessage = signal<string | null>(null);
  readonly adminMode = signal<boolean>(false); // Store management mode for Pamela & Sara

  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  constructor() {
    this.initFromStorage();
  }

  private initFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const storedUsers = localStorage.getItem(this.USERS_STORAGE_KEY);
      if (storedUsers) {
        this.registeredUsers = JSON.parse(storedUsers);
      } else {
        localStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(this.registeredUsers));
      }

      const activeUser = localStorage.getItem(this.STORAGE_KEY);
      if (activeUser) {
        this.currentUser.set(JSON.parse(activeUser));
      } else {
        // Log in default user Camila so the app is instantly ready, but let user switch or logout
        this.currentUser.set(this.registeredUsers[0]);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.registeredUsers[0]));
      }
    } catch {
      this.currentUser.set(this.registeredUsers[0]);
    }
  }

  openAuthModal(mode: 'login' | 'register' = 'login', notice?: string): void {
    this.authModalMode.set(mode);
    this.authNoticeMessage.set(notice || null);
    this.isAuthModalOpen.set(true);
  }

  closeAuthModal(): void {
    this.isAuthModalOpen.set(false);
    this.authNoticeMessage.set(null);
  }

  register(userData: Omit<UserProfile, 'id' | 'createdAt'>): UserProfile {
    const newUser: UserProfile = {
      ...userData,
      id: 'usr-' + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.registeredUsers.push(newUser);
    this.saveUsers();
    this.setCurrentUser(newUser);
    this.closeAuthModal();
    return newUser;
  }

  login(emailOrPhone: string): boolean {
    const cleanSearch = emailOrPhone.trim().toLowerCase();
    const found = this.registeredUsers.find(
      u => u.email.toLowerCase() === cleanSearch || u.phone.includes(cleanSearch)
    );

    if (found) {
      this.setCurrentUser(found);
      this.closeAuthModal();
      return true;
    }

    // Auto-create if testing with a new email to give smooth experience
    if (cleanSearch.includes('@')) {
      const generatedName = cleanSearch.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName = generatedName.charAt(0).toUpperCase() + generatedName.slice(1);
      const autoUser: UserProfile = {
        id: 'usr-' + Date.now().toString().slice(-6),
        fullName: formattedName,
        email: cleanSearch,
        phone: '310' + Math.floor(1000000 + Math.random() * 9000000),
        documentId: Math.floor(1000000000 + Math.random() * 900000000).toString(),
        address: 'Calle 100 # 15-20, Piso 3',
        city: 'Bogotá D.C.',
        neighborhood: 'Usaquén',
        createdAt: new Date().toISOString().split('T')[0]
      };
      this.registeredUsers.push(autoUser);
      this.saveUsers();
      this.setCurrentUser(autoUser);
      this.closeAuthModal();
      return true;
    }

    return false;
  }

  logout(): void {
    this.currentUser.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  setCurrentUser(user: UserProfile): void {
    this.currentUser.set(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    }
  }

  updateProfile(data: Partial<UserProfile>): void {
    const current = this.currentUser();
    if (!current) return;
    const updated = { ...current, ...data };
    this.setCurrentUser(updated);

    const idx = this.registeredUsers.findIndex(u => u.id === current.id);
    if (idx !== -1) {
      this.registeredUsers[idx] = updated;
      this.saveUsers();
    }
  }

  toggleAdminMode(): void {
    this.adminMode.update(val => !val);
  }

  private saveUsers(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(this.registeredUsers));
    }
  }
}
