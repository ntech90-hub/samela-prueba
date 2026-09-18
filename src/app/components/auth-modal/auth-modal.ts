import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-modal',
  imports: [ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (authService.isAuthModalOpen()) {
      <div
        class="fixed inset-0 z-50 bg-[#2E1026]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        (click)="closeModal()"
      >
        <div
          class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#F8D8E7] overflow-hidden my-6 text-left"
          (click)="$event.stopPropagation()"
        >
          <!-- Header Banner -->
          <div class="bg-gradient-to-r from-[#FCE7F3] via-[#FAF5FF] to-[#FFF0F6] px-6 py-5 border-b border-[#F8D8E7] relative">
            <button
              type="button"
              (click)="closeModal()"
              class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#831843] flex items-center justify-center shadow-xs cursor-pointer"
              aria-label="Cerrar ventana"
            >
              <mat-icon class="text-base">close</mat-icon>
            </button>

            <div class="flex items-center gap-2 mb-1">
              <span class="text-xl">🌸</span>
              <span class="font-serif-title text-xl font-bold text-[#831843]">SAMELÁ</span>
            </div>

            <p class="text-xs text-[#701A75] font-medium">
              {{ authService.authModalMode() === 'login' ? 'Bienvenida de nuevo a tu tienda favorita' : 'Crea tu cuenta de cliente para realizar tu pedido' }}
            </p>
          </div>

          <!-- Notice banner if redirected from checkout -->
          @if (authService.authNoticeMessage(); as msg) {
            <div class="m-5 mb-0 p-3 rounded-2xl bg-[#FFF0F6] border border-[#F472B6]/40 text-[#BE185D] text-xs font-semibold flex items-center gap-2">
              <mat-icon class="text-base text-[#BE185D] shrink-0">lock</mat-icon>
              <span>{{ msg }}</span>
            </div>
          }

          <div class="p-6 space-y-5">
            
            <!-- Mode Switch Tabs -->
            <div class="flex rounded-xl p-1 bg-[#FAF0F8] border border-[#F8D8E7]">
              <button
                type="button"
                (click)="switchMode('login')"
                class="flex-1 py-2 text-xs font-bold rounded-lg transition-all"
                [class.bg-white]="authService.authModalMode() === 'login'"
                [class.text-[#BE185D]]="authService.authModalMode() === 'login'"
                [class.shadow-2xs]="authService.authModalMode() === 'login'"
                [class.text-stone-500]="authService.authModalMode() !== 'login'"
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                (click)="switchMode('register')"
                class="flex-1 py-2 text-xs font-bold rounded-lg transition-all"
                [class.bg-white]="authService.authModalMode() === 'register'"
                [class.text-[#BE185D]]="authService.authModalMode() === 'register'"
                [class.shadow-2xs]="authService.authModalMode() === 'register'"
                [class.text-stone-500]="authService.authModalMode() !== 'register'"
              >
                Crear Cuenta Nueva
              </button>
            </div>

            <!-- Login Form -->
            @if (authService.authModalMode() === 'login') {
              <form [formGroup]="loginForm" (ngSubmit)="onLoginSubmit()" class="space-y-4">
                <div>
                  <label for="login-email" class="block text-xs font-bold text-[#701A75] mb-1">
                    Correo Electrónico o Celular:
                  </label>
                  <input
                    id="login-email"
                    type="text"
                    formControlName="emailOrPhone"
                    placeholder="ej: camila.mendoza@gmail.com o 3145678901"
                    class="w-full text-xs p-3 rounded-xl border border-[#F8D8E7] focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] outline-none bg-[#FFF9FC]"
                  />
                  @if (loginForm.get('emailOrPhone')?.touched && loginForm.get('emailOrPhone')?.invalid) {
                    <span class="text-[11px] text-rose-600 mt-0.5 block">Ingresa tu correo o teléfono registrado.</span>
                  }
                </div>

                <div>
                  <label for="login-pass" class="block text-xs font-bold text-[#701A75] mb-1">
                    Contraseña / PIN de acceso:
                  </label>
                  <input
                    id="login-pass"
                    type="password"
                    formControlName="password"
                    placeholder="••••••••"
                    class="w-full text-xs p-3 rounded-xl border border-[#F8D8E7] focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] outline-none bg-[#FFF9FC]"
                  />
                </div>

                <div class="text-[11px] text-stone-500 bg-[#FAF5FF] p-2.5 rounded-xl border border-[#E9D5FF]">
                  💡 <strong>Tip para pruebas de entorno:</strong> Puedes usar la cuenta pre-registrada de Camila (o ingresar cualquier correo) para iniciar sesión al instante.
                </div>

                <button
                  type="submit"
                  [disabled]="loginForm.invalid"
                  class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#BE185D] to-[#9D174D] text-white font-bold text-xs shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
                >
                  Entrar a mi Cuenta
                </button>
              </form>
            }

            <!-- Register Form -->
            @if (authService.authModalMode() === 'register') {
              <form [formGroup]="registerForm" (ngSubmit)="onRegisterSubmit()" class="space-y-3.5">
                <div>
                  <label for="reg-name" class="block text-xs font-bold text-[#701A75] mb-1">
                    Nombre Completo:
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    formControlName="fullName"
                    placeholder="ej: Pamela Sofía Cardozo"
                    class="w-full text-xs p-2.5 rounded-xl border border-[#F8D8E7] focus:border-[#BE185D] outline-none bg-[#FFF9FC]"
                  />
                </div>

                <div class="grid grid-cols-2 gap-2.5">
                  <div>
                    <label for="reg-email" class="block text-xs font-bold text-[#701A75] mb-1">
                      Correo Electrónico:
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      formControlName="email"
                      placeholder="nombre@gmail.com"
                      class="w-full text-xs p-2.5 rounded-xl border border-[#F8D8E7] focus:border-[#BE185D] outline-none bg-[#FFF9FC]"
                    />
                  </div>
                  <div>
                    <label for="reg-phone" class="block text-xs font-bold text-[#701A75] mb-1">
                      WhatsApp / Teléfono:
                    </label>
                    <input
                      id="reg-phone"
                      type="tel"
                      formControlName="phone"
                      placeholder="300 123 4567"
                      class="w-full text-xs p-2.5 rounded-xl border border-[#F8D8E7] focus:border-[#BE185D] outline-none bg-[#FFF9FC]"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2.5">
                  <div>
                    <label for="reg-doc" class="block text-xs font-bold text-[#701A75] mb-1">
                      Cédula / Documento (Factura):
                    </label>
                    <input
                      id="reg-doc"
                      type="text"
                      formControlName="documentId"
                      placeholder="ej: 1024859632"
                      class="w-full text-xs p-2.5 rounded-xl border border-[#F8D8E7] focus:border-[#BE185D] outline-none bg-[#FFF9FC]"
                    />
                  </div>
                  <div>
                    <label for="reg-city" class="block text-xs font-bold text-[#701A75] mb-1">
                      Ciudad:
                    </label>
                    <input
                      id="reg-city"
                      type="text"
                      formControlName="city"
                      placeholder="ej: Bogotá / Medellín"
                      class="w-full text-xs p-2.5 rounded-xl border border-[#F8D8E7] focus:border-[#BE185D] outline-none bg-[#FFF9FC]"
                    />
                  </div>
                </div>

                <div>
                  <label for="reg-address" class="block text-xs font-bold text-[#701A75] mb-1">
                    Dirección de Entrega:
                  </label>
                  <input
                    id="reg-address"
                    type="text"
                    formControlName="address"
                    placeholder="Calle, Carrera, N° Apto / Casa"
                    class="w-full text-xs p-2.5 rounded-xl border border-[#F8D8E7] focus:border-[#BE185D] outline-none bg-[#FFF9FC]"
                  />
                </div>

                <div>
                  <label for="reg-neighborhood" class="block text-xs font-bold text-[#701A75] mb-1">
                    Barrio / Sector:
                  </label>
                  <input
                    id="reg-neighborhood"
                    type="text"
                    formControlName="neighborhood"
                    placeholder="ej: Chapinero, Poblado, etc."
                    class="w-full text-xs p-2.5 rounded-xl border border-[#F8D8E7] focus:border-[#BE185D] outline-none bg-[#FFF9FC]"
                  />
                </div>

                <button
                  type="submit"
                  [disabled]="registerForm.invalid"
                  class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#BE185D] to-[#9D174D] text-white font-bold text-xs shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer mt-2"
                >
                  Completar Registro y Guardar
                </button>
              </form>
            }

          </div>

        </div>
      </div>
    }
  `
})
export class AuthModalComponent {
  readonly authService = inject(AuthService);

  readonly loginForm = new FormGroup({
    emailOrPhone: new FormControl('camila.mendoza@gmail.com', [Validators.required]),
    password: new FormControl('123456', [Validators.required, Validators.minLength(4)])
  });

  readonly registerForm = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.minLength(7)]),
    documentId: new FormControl('', [Validators.required, Validators.minLength(6)]),
    city: new FormControl('Bogotá D.C.', [Validators.required]),
    address: new FormControl('', [Validators.required, Validators.minLength(5)]),
    neighborhood: new FormControl('', [Validators.required])
  });

  closeModal(): void {
    this.authService.closeAuthModal();
  }

  switchMode(mode: 'login' | 'register'): void {
    this.authService.openAuthModal(mode);
  }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) return;
    const value = this.loginForm.get('emailOrPhone')?.value || '';
    this.authService.login(value);
  }

  onRegisterSubmit(): void {
    if (this.registerForm.invalid) return;
    const formVal = this.registerForm.value;
    this.authService.register({
      fullName: formVal.fullName || '',
      email: formVal.email || '',
      phone: formVal.phone || '',
      documentId: formVal.documentId || '',
      city: formVal.city || 'Bogotá',
      address: formVal.address || '',
      neighborhood: formVal.neighborhood || ''
    });
  }
}
