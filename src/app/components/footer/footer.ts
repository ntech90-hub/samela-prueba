import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bg-gradient-to-b from-[#2E1026] to-[#1A0915] text-white pt-16 pb-12 border-t border-[#F8D8E7]/20 text-left">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          <!-- Brand & Story -->
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <div class="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#F472B6] to-[#C084FC] flex items-center justify-center text-white font-serif-title font-bold text-lg">
                👑
              </div>
              <span class="font-serif-title text-2xl font-bold tracking-tight text-[#FCE7F3]">
                SAMELÁ
              </span>
            </div>
            <p class="text-xs text-[#FCE7F3]/80 leading-relaxed font-light">
              "Pequeños detalles, grandes momentos ♡". Una propuesta enfocada en belleza femenina, cuidado facial y accesorios delicados para consentirte y sorprender a quienes más amas.
            </p>
            <div class="text-[11px] text-[#F472B6] font-semibold">
              Tu brillo, nuestra inspiración ♡
            </div>
          </div>

          <!-- SENA Project Details -->
          <div class="space-y-3">
            <h4 class="font-serif-title text-sm font-bold uppercase tracking-wider text-[#FCE7F3] border-b border-[#F8D8E7]/20 pb-2">
              Proyecto Formativo SENA
            </h4>
            <ul class="text-xs space-y-1.5 text-[#FCE7F3]/80 font-light">
              <li><strong>Programa:</strong> Técnico en Programación de Software</li>
              <li><strong>Ficha:</strong> 3167081 · Grado Once</li>
              <li><strong>Institución:</strong> I.E. Marco Fidel Suárez</li>
              <li><strong>Emprendedoras:</strong> Pamela Cuéllar & Sara Cardozo</li>
              <li><strong>Docente:</strong> Yair Fernando Merchán Lesmes</li>
              <li><strong>Fecha:</strong> 18 de septiembre del 2026</li>
            </ul>
          </div>

          <!-- Customer Service & Payments -->
          <div class="space-y-3">
            <h4 class="font-serif-title text-sm font-bold uppercase tracking-wider text-[#FCE7F3] border-b border-[#F8D8E7]/20 pb-2">
              Atención & Medios de Pago
            </h4>
            <div class="text-xs text-[#FCE7F3]/80 space-y-2 font-light">
              <p>Manejamos exclusivamente pagos seguros:</p>
              <div class="flex flex-wrap gap-1.5">
                <span class="px-2 py-0.5 rounded-full bg-white/10 text-[11px]">Bancolombia</span>
                <span class="px-2 py-0.5 rounded-full bg-white/10 text-[11px]">Nequi</span>
                <span class="px-2 py-0.5 rounded-full bg-white/10 text-[11px]">Daviplata</span>
                <span class="px-2 py-0.5 rounded-full bg-white/10 text-[11px]">Efectivo</span>
              </div>
              <p class="pt-1 text-[11px]">
                Facturación electrónica y órdenes de compra con entrega digital vía WhatsApp o PDF descargable.
              </p>
            </div>
          </div>

          <!-- Contact & WhatsApp Direct -->
          <div class="space-y-3">
            <h4 class="font-serif-title text-sm font-bold uppercase tracking-wider text-[#FCE7F3] border-b border-[#F8D8E7]/20 pb-2">
              Contacto Directo
            </h4>
            <div class="space-y-3">
              <a
                href="https://api.whatsapp.com/send?phone=573145678901&text=Hola%20SAMEL%C3%81,%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20productos%20de%20cuidado%20facial%20y%20accesorios"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md transition-all"
              >
                <span class="text-base">💬</span>
                <span>Chatear por WhatsApp</span>
              </a>
              <div class="text-[11px] text-[#FCE7F3]/70">
                Horario: Lunes a Sábado de 8:00 AM a 7:00 PM<br/>
                Bogotá D.C. y envíos a toda Colombia.
              </div>
            </div>
          </div>

        </div>

        <!-- Copyright -->
        <div class="mt-12 pt-6 border-t border-[#F8D8E7]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FCE7F3]/60 gap-3">
          <div>
            © 2026 SAMELÁ · Belleza, Accesorios y Regalos. Todos los derechos reservados.
          </div>
          <div class="flex items-center gap-4">
            <span class="hover:text-white cursor-pointer">Términos de Compra</span>
            <span>·</span>
            <span class="hover:text-white cursor-pointer">Políticas de Privacidad</span>
            <span>·</span>
            <span class="hover:text-white cursor-pointer">Garantía de Satisfacción</span>
          </div>
        </div>

      </div>
    </footer>
  `
})
export class FooterComponent {}
