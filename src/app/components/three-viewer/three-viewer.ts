import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
  AfterViewInit,
  OnDestroy,
  inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import * as THREE from 'three';

@Component({
  selector: 'app-three-viewer',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full h-[380px] md:h-[460px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#FFF5F9] via-[#FAF0F8] to-[#F3E8FF] border border-[#F8D8E7] shadow-inner select-none flex flex-col justify-between">
      <!-- Top Bar: Model title and Lighting Controls -->
      <div class="relative z-10 flex items-center justify-between p-4 bg-white/70 backdrop-blur-md border-b border-[#F8D8E7]/60">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-[#EC4899] animate-pulse"></span>
          <span class="text-xs font-bold uppercase tracking-wider text-[#9D174D]">
            Visor 3D Interactivo
          </span>
          <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FCE7F3] text-[#BE185D] border border-[#F472B6]/40">
            WebGL 360°
          </span>
        </div>

        <!-- Controls: Auto-spin, Reset, Light Theme -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="toggleAutoRotate()"
            class="px-2.5 py-1 text-xs rounded-full flex items-center gap-1 font-medium transition-all"
            [class.bg-[#BE185D]]="autoRotate()"
            [class.text-white]="autoRotate()"
            [class.bg-white]="!autoRotate()"
            [class.text-[#831843]]="!autoRotate()"
            [class.border]="!autoRotate()"
            [class.border-[#F8D8E7]]="!autoRotate()"
            title="Pausar / Activar rotación continua"
          >
            <mat-icon class="text-sm scale-75">autorenew</mat-icon>
            <span>{{ autoRotate() ? 'Girando' : 'Pausado' }}</span>
          </button>

          <button
            type="button"
            (click)="resetView()"
            class="p-1.5 rounded-full bg-white hover:bg-[#FDF2F7] text-[#9D174D] border border-[#F8D8E7] transition-all"
            title="Centrar vista"
          >
            <mat-icon class="text-sm scale-75">center_focus_strong</mat-icon>
          </button>
        </div>
      </div>

      <!-- Canvas Container -->
      <div #canvasContainer class="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing"></div>

      <!-- Bottom Hint Bar -->
      <div class="relative z-10 flex items-center justify-between px-4 py-2.5 bg-white/70 backdrop-blur-md border-t border-[#F8D8E7]/60 text-xs text-[#831843]">
        <div class="flex items-center gap-1.5">
          <mat-icon class="text-sm scale-75 text-[#EC4899]">touch_app</mat-icon>
          <span>Arrastra para rotar en 360° · Rueda o pellizca para hacer zoom</span>
        </div>

        <div class="flex items-center gap-1 font-medium text-[11px] text-[#A21CAF]">
          <span>SAMELÁ Signature 3D</span>
          <span class="text-[#EC4899]">♡</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class ThreeViewerComponent implements AfterViewInit, OnDestroy {
  modelType = input<'jar' | 'serum' | 'mirror' | 'box' | 'jewelry'>('serum');
  productName = input<string>('Producto SAMELÁ');

  readonly canvasContainer = viewChild<ElementRef<HTMLDivElement>>('canvasContainer');
  readonly autoRotate = signal<boolean>(true);

  private platformId = inject(PLATFORM_ID);
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private renderer?: THREE.WebGLRenderer;
  private animFrameId?: number;
  private modelGroup?: THREE.Group;
  private resizeObserver?: ResizeObserver;

  // Interaction variables
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  private targetRotation = { x: 0.15, y: 0 };
  private currentRotation = { x: 0.15, y: 0 };
  private cameraDistance = 4.2;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initThree();
  }

  ngOnDestroy(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  toggleAutoRotate(): void {
    this.autoRotate.update(v => !v);
  }

  resetView(): void {
    this.targetRotation = { x: 0.15, y: 0 };
    this.cameraDistance = 4.2;
    if (this.camera) {
      this.camera.position.set(0, 0, this.cameraDistance);
    }
  }

  private initThree(): void {
    const container = this.canvasContainer()?.nativeElement;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 350;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, this.cameraDistance);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // Lighting
    this.setupLighting();

    // Create 3D Model depending on type
    this.createModel();

    // Event Listeners for Touch and Mouse Drag
    this.setupInteractions(container);

    // Resize Observer
    this.resizeObserver = new ResizeObserver(() => {
      if (!container || !this.renderer || !this.camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
    this.resizeObserver.observe(container);

    // Animation Loop
    this.animate();
  }

  private setupLighting(): void {
    if (!this.scene) return;

    // Ambient light with soft warm rose tint
    const ambientLight = new THREE.AmbientLight(0xfff5fa, 1.4);
    this.scene.add(ambientLight);

    // Key light (soft golden white)
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    this.scene.add(keyLight);

    // Fill light (delicate rose/pink bounce)
    const fillLight = new THREE.DirectionalLight(0xfce7f3, 1.6);
    fillLight.position.set(-6, -2, 4);
    this.scene.add(fillLight);

    // Rim light for luxury glossy outline
    const rimLight = new THREE.DirectionalLight(0xfdf2f8, 1.8);
    rimLight.position.set(0, 6, -6);
    this.scene.add(rimLight);

    // Underlight soft purple glow
    const underLight = new THREE.PointLight(0xe9d5ff, 1.2, 10);
    underLight.position.set(0, -3, 2);
    this.scene.add(underLight);
  }

  private createModel(): void {
    if (!this.scene) return;

    this.modelGroup = new THREE.Group();

    const type = this.modelType();

    switch (type) {
      case 'serum':
        this.buildSerumBottle(this.modelGroup);
        break;
      case 'jar':
        this.buildCosmeticJar(this.modelGroup);
        break;
      case 'mirror':
        this.buildCompactMirror(this.modelGroup);
        break;
      case 'box':
        this.buildGiftBox(this.modelGroup);
        break;
      case 'jewelry':
        this.buildJewelryPiece(this.modelGroup);
        break;
      default:
        this.buildSerumBottle(this.modelGroup);
    }

    // Add a circular delicate pedestal with shadow receiver
    const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.7, 0.08, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.1
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.45;
    pedestal.receiveShadow = true;
    this.modelGroup.add(pedestal);

    // Delicate ring around pedestal in gold
    const ringGeo = new THREE.TorusGeometry(1.65, 0.02, 16, 100);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.2
    });
    const ring = new THREE.Mesh(ringGeo, goldMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.41;
    this.modelGroup.add(ring);

    this.scene.add(this.modelGroup);
  }

  /**
   * 3D Serum Dropper Bottle with glass transparency, liquid core, golden collar, and rubber bulb
   */
  private buildSerumBottle(group: THREE.Group): void {
    // 1. Glass Body (Cylinder with rounded bevels)
    const bodyGeo = new THREE.CylinderGeometry(0.72, 0.72, 1.7, 48);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xfbcfe8,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      ior: 1.5,
      reflectivity: 0.8
    });
    const body = new THREE.Mesh(bodyGeo, glassMat);
    body.position.y = -0.3;
    body.castShadow = true;
    group.add(body);

    // 2. Liquid inside (Concentrated Glow Serum)
    const liquidGeo = new THREE.CylinderGeometry(0.66, 0.66, 1.4, 36);
    const liquidMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.2,
      metalness: 0.2,
      emissive: 0xdb2777,
      emissiveIntensity: 0.15
    });
    const liquid = new THREE.Mesh(liquidGeo, liquidMat);
    liquid.position.y = -0.42;
    group.add(liquid);

    // 3. Label on bottle
    const labelGeo = new THREE.CylinderGeometry(0.73, 0.73, 0.95, 48, 1, true, -Math.PI / 2.2, Math.PI * 0.9);
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 512;
    labelCanvas.height = 256;
    const ctx = labelCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFF5F9';
      ctx.fillRect(0, 0, 512, 256);
      ctx.strokeStyle = '#F472B6';
      ctx.lineWidth = 6;
      ctx.strokeRect(16, 16, 480, 224);

      ctx.fillStyle = '#9D174D';
      ctx.font = 'bold 36px "Playfair Display", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('SAMELÁ', 256, 80);

      ctx.fillStyle = '#BE185D';
      ctx.font = 'italic 18px "DM Sans", sans-serif';
      ctx.fillText('GLOW FACIAL SERUM', 256, 120);

      ctx.fillStyle = '#4A044E';
      ctx.font = '14px "DM Sans", sans-serif';
      ctx.fillText('Vitamina C + Ácido Hialurónico · 30ml', 256, 160);

      ctx.fillStyle = '#BE185D';
      ctx.font = '12px "DM Sans", sans-serif';
      ctx.fillText('♡ Tu brillo, nuestra inspiración ♡', 256, 195);
    }
    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.4,
      metalness: 0.05
    });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.y = -0.3;
    group.add(label);

    // 4. Bottle Shoulder / Neck
    const neckGeo = new THREE.CylinderGeometry(0.38, 0.65, 0.4, 32);
    const neck = new THREE.Mesh(neckGeo, glassMat);
    neck.position.y = 0.7;
    group.add(neck);

    // 5. Metallic Gold Collar
    const collarGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.45, 32);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.15
    });
    const collar = new THREE.Mesh(collarGeo, goldMat);
    collar.position.y = 1.0;
    collar.castShadow = true;
    group.add(collar);

    // 6. White/Soft-Pink Rubber Dropper Bulb
    const bulbGeo = new THREE.SphereGeometry(0.35, 32, 24);
    bulbGeo.scale(1, 1.4, 1);
    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0xffe4e6,
      roughness: 0.6,
      metalness: 0.05
    });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.y = 1.45;
    bulb.castShadow = true;
    group.add(bulb);

    // 7. Glass pipette inside
    const pipetteGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.9, 16);
    const pipetteMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      transmission: 0.8
    });
    const pipette = new THREE.Mesh(pipetteGeo, pipetteMat);
    pipette.position.y = 0.2;
    group.add(pipette);
  }

  /**
   * 3D Luxury Cosmetic Jar (Cream / Pink Clay Mask)
   */
  private buildCosmeticJar(group: THREE.Group): void {
    // 1. Frosted Jar Base
    const jarBaseGeo = new THREE.CylinderGeometry(1.1, 1.05, 1.1, 48);
    const jarMat = new THREE.MeshPhysicalMaterial({
      color: 0xfdf2f8,
      transparent: true,
      opacity: 0.92,
      roughness: 0.2,
      transmission: 0.4
    });
    const jar = new THREE.Mesh(jarBaseGeo, jarMat);
    jar.position.y = -0.6;
    jar.castShadow = true;
    group.add(jar);

    // Inner Cream
    const creamGeo = new THREE.CylinderGeometry(0.98, 0.95, 0.9, 32);
    const creamMat = new THREE.MeshStandardMaterial({
      color: 0xfce7f3,
      roughness: 0.35
    });
    const cream = new THREE.Mesh(creamGeo, creamMat);
    cream.position.y = -0.65;
    group.add(cream);

    // 2. Metallic Rose Gold / Gold Lid
    const lidGeo = new THREE.CylinderGeometry(1.14, 1.14, 0.5, 48);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.88,
      roughness: 0.15
    });
    const lid = new THREE.Mesh(lidGeo, goldMat);
    lid.position.y = 0.1;
    lid.castShadow = true;
    group.add(lid);

    // Engraved Logo on top of lid
    const lidTopGeo = new THREE.CircleGeometry(1.1, 32);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#E89828';
      ctx.fillRect(0, 0, 512, 512);

      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(256, 256, 230, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 54px "Playfair Display", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('SAMELÁ', 256, 240);

      ctx.font = '24px "DM Sans", sans-serif';
      ctx.fillText('👑 CUIDADO FACIAL 👑', 256, 290);
    }
    const texture = new THREE.CanvasTexture(canvas);
    const lidTopMat = new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.8,
      roughness: 0.25
    });
    const lidTop = new THREE.Mesh(lidTopGeo, lidTopMat);
    lidTop.rotation.x = -Math.PI / 2;
    lidTop.position.y = 0.355;
    group.add(lidTop);

    // Front label on jar
    const labelGeo = new THREE.CylinderGeometry(1.11, 1.06, 0.7, 36, 1, true, -Math.PI / 2.5, Math.PI * 0.8);
    const jarLabelCanvas = document.createElement('canvas');
    jarLabelCanvas.width = 512;
    jarLabelCanvas.height = 256;
    const ctx2 = jarLabelCanvas.getContext('2d');
    if (ctx2) {
      ctx2.fillStyle = '#FFFFFF';
      ctx2.fillRect(0, 0, 512, 256);
      ctx2.strokeStyle = '#F472B6';
      ctx2.lineWidth = 4;
      ctx2.strokeRect(10, 10, 492, 236);

      ctx2.fillStyle = '#9D174D';
      ctx2.font = 'bold 36px "Playfair Display", Georgia';
      ctx2.textAlign = 'center';
      ctx2.fillText('SAMELÁ SPA', 256, 90);

      ctx2.fillStyle = '#BE185D';
      ctx2.font = '18px "DM Sans"';
      ctx2.fillText('Mascarilla Facial Purificante', 256, 140);
      ctx2.fillText('Arcilla Rosa & Cuarzo · 60g', 256, 180);
    }
    const jarLabelMat = new THREE.MeshStandardMaterial({
      map: new THREE.CanvasTexture(jarLabelCanvas),
      roughness: 0.3
    });
    const jarLabel = new THREE.Mesh(labelGeo, jarLabelMat);
    jarLabel.position.y = -0.6;
    group.add(jarLabel);
  }

  /**
   * 3D Golden Compact Mirror ("Espejo Compacto Grabado SAMELÁ Dorado", page 8 of PDF)
   */
  private buildCompactMirror(group: THREE.Group): void {
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.92,
      roughness: 0.12
    });

    // 1. Lower shell (base)
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.15, 0.15, 48);
    const base = new THREE.Mesh(baseGeo, goldMat);
    base.position.y = -0.7;
    base.castShadow = true;
    group.add(base);

    // Real mirror glass in lower shell
    const mirrorGeo = new THREE.CircleGeometry(1.05, 36);
    const mirrorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.05
    });
    const mirror = new THREE.Mesh(mirrorGeo, mirrorMat);
    mirror.rotation.x = -Math.PI / 2;
    mirror.position.y = -0.62;
    group.add(mirror);

    // 2. Hinge mechanism
    const hingeGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 16);
    const hinge = new THREE.Mesh(hingeGeo, goldMat);
    hinge.rotation.z = Math.PI / 2;
    hinge.position.set(0, -0.6, -1.2);
    group.add(hinge);

    // 3. Top lid opened at an elegant 60-degree angle
    const topLidGroup = new THREE.Group();
    topLidGroup.position.set(0, -0.6, -1.2);

    const lidGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.12, 48);
    const lidMesh = new THREE.Mesh(lidGeo, goldMat);
    lidMesh.position.set(0, 0, 1.2);
    topLidGroup.add(lidMesh);

    // Top face engraved with SAMELÁ emblem (from PDF: crown, stars, SAMELÁ, "Pequeños detalles, grandes momentos")
    const emblemCanvas = document.createElement('canvas');
    emblemCanvas.width = 512;
    emblemCanvas.height = 512;
    const ctx = emblemCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#E69E2E';
      ctx.fillRect(0, 0, 512, 512);

      ctx.strokeStyle = '#854D0E';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(256, 256, 230, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '50px Georgia';
      ctx.textAlign = 'center';
      ctx.fillText('👑', 256, 160);

      ctx.font = 'bold 52px "Playfair Display", Georgia';
      ctx.fillText('SAMELÁ', 256, 240);

      ctx.font = 'italic 20px "DM Sans"';
      ctx.fillText('Belleza · Accesorios · Regalos', 256, 285);

      ctx.font = '16px "DM Sans"';
      ctx.fillText('✨ Pequeños detalles, grandes momentos ♡', 256, 340);
    }
    const emblemMat = new THREE.MeshStandardMaterial({
      map: new THREE.CanvasTexture(emblemCanvas),
      metalness: 0.85,
      roughness: 0.2
    });
    const emblem = new THREE.Mesh(new THREE.CircleGeometry(1.15, 36), emblemMat);
    emblem.rotation.x = Math.PI / 2;
    emblem.position.set(0, -0.065, 1.2);
    topLidGroup.add(emblem);

    // Inner magnifying mirror
    const innerMirror = new THREE.Mesh(mirrorGeo, mirrorMat);
    innerMirror.rotation.x = -Math.PI / 2;
    innerMirror.position.set(0, 0.065, 1.2);
    topLidGroup.add(innerMirror);

    // Tilt lid back by 70 degrees
    topLidGroup.rotation.x = -Math.PI * 0.42;
    group.add(topLidGroup);
  }

  /**
   * 3D Signature Gift Box ("Caja de Regalo SAMELÁ", page 2 of PDF)
   */
  private buildGiftBox(group: THREE.Group): void {
    // 1. Pink Box Base
    const boxGeo = new THREE.BoxGeometry(2.0, 1.2, 1.6);
    const boxCanvas = document.createElement('canvas');
    boxCanvas.width = 512;
    boxCanvas.height = 512;
    const ctx = boxCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FCE7F3';
      ctx.fillRect(0, 0, 512, 512);

      ctx.fillStyle = '#9D174D';
      ctx.font = 'bold 64px "Playfair Display", Georgia';
      ctx.textAlign = 'center';
      ctx.fillText('SAMELÁ', 256, 220);

      ctx.font = 'italic 24px "DM Sans"';
      ctx.fillText('Tu brillo, nuestra inspiración ♡', 256, 280);
      ctx.fillText('Pequeños detalles, grandes momentos', 256, 320);
    }
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0xfbcfe8,
      map: new THREE.CanvasTexture(boxCanvas),
      roughness: 0.4,
      metalness: 0.1
    });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.y = -0.5;
    box.castShadow = true;
    group.add(box);

    // 2. Satin Pink Ribbons wrapping the box
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xdb2777,
      roughness: 0.25,
      metalness: 0.2
    });
    // Vertical ribbon
    const vRibbonGeo = new THREE.BoxGeometry(0.3, 1.22, 1.62);
    const vRibbon = new THREE.Mesh(vRibbonGeo, ribbonMat);
    vRibbon.position.y = -0.5;
    group.add(vRibbon);

    // Horizontal ribbon
    const hRibbonGeo = new THREE.BoxGeometry(2.02, 1.22, 0.3);
    const hRibbon = new THREE.Mesh(hRibbonGeo, ribbonMat);
    hRibbon.position.y = -0.5;
    group.add(hRibbon);

    // 3. Lid slightly elevated
    const lidGeo = new THREE.BoxGeometry(2.06, 0.25, 1.66);
    const lid = new THREE.Mesh(lidGeo, new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.35
    }));
    lid.position.y = 0.15;
    lid.castShadow = true;
    group.add(lid);

    // 4. Ribbon Bow on top
    const bowLoopGeo = new THREE.TorusGeometry(0.3, 0.08, 16, 32);
    const loop1 = new THREE.Mesh(bowLoopGeo, ribbonMat);
    loop1.rotation.y = Math.PI / 4;
    loop1.rotation.x = Math.PI / 4;
    loop1.position.set(-0.2, 0.45, 0);
    group.add(loop1);

    const loop2 = new THREE.Mesh(bowLoopGeo, ribbonMat);
    loop2.rotation.y = -Math.PI / 4;
    loop2.rotation.x = Math.PI / 4;
    loop2.position.set(0.2, 0.45, 0);
    group.add(loop2);

    const bowKnotGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const knot = new THREE.Mesh(bowKnotGeo, ribbonMat);
    knot.position.set(0, 0.4, 0);
    group.add(knot);
  }

  /**
   * 3D Jewelry / Earring Piece in 18k Gold
   */
  private buildJewelryPiece(group: THREE.Group): void {
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.1
    });

    // Elegant velvet stand
    const standGeo = new THREE.CylinderGeometry(0.8, 1.0, 0.4, 32);
    const standMat = new THREE.MeshStandardMaterial({
      color: 0x831843, // Deep velvet magenta
      roughness: 0.9
    });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.y = -1.1;
    group.add(stand);

    // Golden Heart Shape in 3D
    const x = 0, y = 0;
    const heartShape = new THREE.Shape();
    heartShape.moveTo(x + 0.25, y + 0.25);
    heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    heartShape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    heartShape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
    heartShape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
    heartShape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const extrudeSettings = {
      depth: 0.25,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08
    };

    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeo.center();
    const heart = new THREE.Mesh(heartGeo, goldMat);
    heart.rotation.z = Math.PI; // Flip heart right side up
    heart.scale.set(1.4, 1.4, 1.4);
    heart.position.y = -0.1;
    heart.castShadow = true;
    group.add(heart);

    // Brilliant crystal in center of heart
    const crystalGeo = new THREE.OctahedronGeometry(0.18);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 1,
      roughness: 0.02,
      metalness: 0.1,
      reflectivity: 0.95
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.set(0, -0.1, 0.2);
    group.add(crystal);
  }

  private setupInteractions(container: HTMLElement): void {
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      this.isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!this.isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - this.previousMousePosition.x;
      const deltaY = clientY - this.previousMousePosition.y;

      this.targetRotation.y += deltaX * 0.012;
      this.targetRotation.x += deltaY * 0.008;

      // Limit vertical tilt
      this.targetRotation.x = Math.max(-0.6, Math.min(0.8, this.targetRotation.x));

      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      this.isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      this.cameraDistance += e.deltaY * 0.003;
      this.cameraDistance = Math.max(2.4, Math.min(6.5, this.cameraDistance));
      if (this.camera) {
        this.camera.position.z = this.cameraDistance;
      }
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    container.addEventListener('wheel', onWheel, { passive: false });
  }

  private animate(): void {
    this.animFrameId = requestAnimationFrame(() => this.animate());

    if (this.modelGroup) {
      if (this.autoRotate() && !this.isDragging) {
        this.targetRotation.y += 0.008;
      }

      // Smooth interpolation (damping)
      this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.08;
      this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.08;

      this.modelGroup.rotation.x = this.currentRotation.x;
      this.modelGroup.rotation.y = this.currentRotation.y;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
