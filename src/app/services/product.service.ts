import { Injectable, signal, computed } from '@angular/core';
import { Product, ProductCategory } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productsState = signal<Product[]>([
    {
      id: 'prod-01',
      name: 'Kit Glow Facial Completo',
      category: 'skincare',
      categoryLabel: 'Skincare Facial',
      price: 89000,
      originalPrice: 110000,
      rating: 4.9,
      reviewsCount: 48,
      badge: 'RUTINA COMPLETA',
      shortDescription: 'Tu rutina de belleza facial en un solo kit: limpia, hidrata, nutre e ilumina.',
      fullDescription: 'El Kit Glow es la experiencia facial insignia de SAMELÁ. Diseñado para transformar tu cutis en 4 sencillos pasos. Contiene limpiador espumoso botánico, tónico revitalizante de rosas, sérum concentrado de vitamina C con ácido hialurónico y crema humectante con efecto terciopelo. Incluye además una diadema de microfibra rosa para tu momento de cuidado.',
      benefits: [
        'Limpia profundamente sin alterar la barrera lipídica',
        'Hidrata intensamente y aporta luminosidad natural inmediata',
        'Estimula la regeneración celular y suaviza líneas de expresión',
        'Apto para todo tipo de piel, incluso pieles sensibles'
      ],
      includes: [
        'Limpiador Facial Botánico 100ml',
        'Tónico Facial Calmante de Rosas 120ml',
        'Sérum Vitamina C + Ácido Hialurónico 30ml',
        'Crema Hidratante Facial Glow 50g',
        'Diadema de Spa Acolchada de Felpa Rosa'
      ],
      skinType: 'Todo tipo de piel (Mixta, Grasa, Seca o Sensible)',
      howToUse: 'Día y noche: 1. Limpiar el rostro con agua tibia y jabón facial. 2. Rociar el tónico y secar suavemente a toquecitos. 3. Aplicar 3-4 gotas de sérum. 4. Sellar con la crema hidratante.',
      ingredients: 'Extracto de Rosas, Niacinamida al 5%, Ácido Hialurónico triple peso molecular, Vitamina C estabilizada, Aceite de Jojoba y Centella Asiática.',
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      model3DType: 'serum',
      model3DLabel: 'Sérum Glow & Gotero Facial 3D',
      inStock: true
    },
    {
      id: 'prod-02',
      name: 'Kit Mini Spa en Casa',
      category: 'skincare',
      categoryLabel: 'Skincare & Bienestar',
      price: 78000,
      originalPrice: 95000,
      rating: 5.0,
      reviewsCount: 39,
      badge: 'MÁS VENDIDO',
      shortDescription: 'Un momento de desconexión y relajación facial profunda con aromaterapia y masajeador.',
      fullDescription: 'Convierte cualquier tarde en una experiencia de spa de lujo. Este kit combina el poder detoxificante de la mascarilla de arcilla rosa, el efecto drenante del rodillo de cuarzo rosa con gua sha, exfoliante facial de microgránulos de arroz y crema revitalizante.',
      benefits: [
        'Descongestiona el rostro y reduce la hinchazón matutina',
        'Elimina impurezas y células muertas con exfoliación sedosa',
        'Favorece la circulación sanguínea y el drenaje linfático',
        'Sensación calmante y relajante inigualable'
      ],
      includes: [
        'Mascarilla Facial Purificante de Arcilla Rosa 60g',
        'Exfoliante Facial de Arroz y Avena 50ml',
        'Rodillo Facial y Gua Sha de Cuarzo Rosa Natural',
        'Crema Facial Regeneradora Nutritiva 50g',
        'Toalla Facial Ultra Suave 100% Algodón Rosa'
      ],
      skinType: 'Piel cansada, opaca o con tendencia al estrés',
      howToUse: 'Usar 2 veces por semana. Aplicar la mascarilla durante 15 minutos, retirar con toalla húmeda tibia y masajear con el rodillo de cuarzo rosa de abajo hacia arriba.',
      ingredients: 'Arcilla rosa francesa, cuarzo rosa pulido a mano, extracto de avena coloidal, manteca de karité pura y aceite esencial de lavanda.',
      imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      model3DType: 'jar',
      model3DLabel: 'Frasco de Mascarilla Rosa & Cuarzo 3D',
      inStock: true
    },
    {
      id: 'prod-03',
      name: 'Kit Self Care Bienestar',
      category: 'combos',
      categoryLabel: 'Kits para el Autocuidado',
      price: 94000,
      originalPrice: 118000,
      rating: 4.8,
      reviewsCount: 26,
      badge: 'EDICIÓN LIMITADA',
      shortDescription: 'Tu momento de bienestar en un solo kit: skincare, vela aromática y toalla de spa.',
      fullDescription: 'Diseñado por SAMELÁ para recordarte que cuidarte hoy te hace sentir increíble mañana. Incluye todo lo necesario para un ritual completo de cariño propio, ideal para regalar o para tu santuario nocturno.',
      benefits: [
        'Ritual holístico que combina cuidado de la piel y aromaterapia relajante',
        'Ayuda a desconectar de la rutina diaria',
        'Hidratación profunda durante la noche',
        'Empaque especial listo para obsequio'
      ],
      includes: [
        'Limpiador Facial Suave 80ml',
        'Tónico Equilibrante 100ml',
        'Crema Facial Rica en Péptidos 50g',
        'Vela Aromática de Soja con Fragancia a Rosas & Vainilla',
        'Rodillo Facial Drenante',
        'Toalla Facial de Spa con Bordado'
      ],
      skinType: 'Todo tipo de piel',
      howToUse: 'Enciende la vela aromática 10 minutos antes de tu rutina. Limpia y tonifica tu piel, aplica la crema con suaves movimientos y disfruta el descanso.',
      ingredients: 'Cera de soja biodegradable, aceites esenciales puros, péptidos de arroz, té blanco y aloe orgánico.',
      imageUrl: 'https://images.unsplash.com/photo-1608248597359-24755106a74b?auto=format&fit=crop&w=800&q=80',
      model3DType: 'box',
      model3DLabel: 'Cofre Exclusivo Self Care 3D',
      inStock: true
    },
    {
      id: 'prod-04',
      name: 'Diadema de Spa Acolchada Rosa',
      category: 'skincare',
      categoryLabel: 'Accesorios Skincare',
      price: 22000,
      originalPrice: 28000,
      rating: 4.9,
      reviewsCount: 52,
      badge: 'OFERTA',
      shortDescription: 'Diadema ergonómica acolchada para mantener el cabello protegido durante tu skincare y maquillaje.',
      fullDescription: 'La famosa diadema de nube esponjosa en tono rosa pastel de SAMELÁ. Confeccionada en suave tejido de toalla afelpada de secado rápido, no aprieta ni maltrata las hebras de tu cabello mientras aplicas tus mascarillas o lavas tu rostro.',
      benefits: [
        'Protege el cabello del agua, cremas y mascarillas',
        'Diseño de nube acolchado ultra cómodo que no presiona la cabeza',
        'Textura de toalla absorbente y elástica',
        'Lavable en lavadora y duradera'
      ],
      includes: ['1 Diadema de felpa acolchada color rosa dulce SAMELÁ'],
      skinType: 'Apta para todos',
      howToUse: 'Colócala sobre tu cabello antes de iniciar tu rutina de limpieza facial o aplicación de maquillaje.',
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      model3DType: 'jar',
      model3DLabel: 'Modelo Suave 3D',
      inStock: true
    },
    {
      id: 'prod-05',
      name: 'Espejo Compacto Grabado SAMELÁ Dorado',
      category: 'accesorios',
      categoryLabel: 'Accesorios y Detalles',
      price: 36000,
      originalPrice: 45000,
      rating: 5.0,
      reviewsCount: 64,
      badge: 'MÁS VENDIDO',
      shortDescription: 'Espejo de bolsillo de alta gama en oro pulido con doble luna de aumento y grabado SAMELÁ.',
      fullDescription: 'Un detalle icónico del emprendimiento SAMELÁ. Confeccionado en aleación metálica con baño dorado brillante, tapa grabada con la corona y detalles florales de la marca. Cuenta con dos espejos internos: uno estándar de alta fidelidad y otro con aumento x2 para retoques de precisión.',
      benefits: [
        'Doble espejo: visión real y aumento 2X para retoques impecables',
        'Cierre magnético suave y bisagra reforzada de larga duración',
        'Acabado en oro de joyería resistente a rayaduras',
        'Viene en su bolsita de terciopelo protectora'
      ],
      includes: [
        'Espejo compacto grabado SAMELÁ',
        'Funda protectora de terciopelo rosa',
        'Cajita de presentación con moño'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
      model3DType: 'mirror',
      model3DLabel: 'Espejo Metálico 3D Interactivo',
      inStock: true
    },
    {
      id: 'prod-06',
      name: 'Aretes Corazón Dorado 18k',
      category: 'accesorios',
      categoryLabel: 'Accesorios y Detalles',
      price: 29000,
      originalPrice: 35000,
      rating: 4.9,
      reviewsCount: 31,
      badge: 'NUEVO',
      shortDescription: 'Aretes delicados en forma de corazón tridimensional en acero inoxidable con baño de oro.',
      fullDescription: 'Piezas pensadas para complementar tus estilos favoritos. Confeccionados en acero quirúrgico antialérgico, acabado espejo pulido a mano que refleja la luz con cada movimiento. Livianos y cómodos para uso diario continuo.',
      benefits: [
        'Material antialérgico que no irrita la piel ni cambia de color',
        'Resistente al agua y al perfume',
        'Diseño atemporal minimalista que eleva cualquier outfit'
      ],
      includes: ['Par de aretes corazón dorado', 'Topitos de seguridad extras', 'Tarjeta de presentación SAMELÁ'],
      imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
      model3DType: 'jewelry',
      model3DLabel: 'Joyería 3D en Oro Pulido',
      inStock: true
    },
    {
      id: 'prod-07',
      name: 'Aretes Flor Nacarada & Circones',
      category: 'accesorios',
      categoryLabel: 'Accesorios y Detalles',
      price: 32000,
      originalPrice: 39000,
      rating: 5.0,
      reviewsCount: 22,
      badge: 'EDICIÓN LIMITADA',
      shortDescription: 'Aretes florales con pétalos nacarados traslúcidos y pistilo en microcircones brillantes.',
      fullDescription: 'Inspirados en la pureza de la naturaleza y la feminidad. Cada pétalo tiene reflejos iridiscentes únicos que cambian suavemente con la luz ambiental. Poste hipoalergénico con baño de oro rosa.',
      benefits: [
        'Efecto nácar iridiscente sofisticado y romántico',
        'Acabado liviano que no jala el lóbulo',
        'Perfecto para bodas, grados o cenas especiales'
      ],
      includes: ['Par de aretes flor nacarada', 'Estuche individual acrílico'],
      imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      model3DType: 'jewelry',
      model3DLabel: 'Flor Nácar 3D Brillante',
      inStock: true
    },
    {
      id: 'prod-08',
      name: 'Collar Triple Delicado con Dijes',
      category: 'accesorios',
      categoryLabel: 'Accesorios y Detalles',
      price: 38000,
      originalPrice: 48000,
      rating: 4.8,
      reviewsCount: 19,
      badge: 'OFERTA',
      shortDescription: 'Gargantilla y cadenas en capas superpuestas con dijes de mariposa y mini perlas cultivadas.',
      fullDescription: 'El accesorio en tendencia para lucir escotes elegantes. Tres cadenas unidas en un solo broche para que nunca se enreden: una tipo choker con perlas mini, una cadena media con dije de mariposa pulida y una cadena larga con cristal lágrima.',
      benefits: [
        'Broche único antidestrenzamiento',
        'Largo graduable con cadena extensora de 5 cm',
        'Baño dorado duradero con recubrimiento e-coating'
      ],
      includes: ['Collar triple con dijes', 'Tarjeta de cuidados de joyería SAMELÁ'],
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      model3DType: 'jewelry',
      model3DLabel: 'Cadena Triple 3D',
      inStock: true
    },
    {
      id: 'prod-09',
      name: 'Aros Clásicos & Trenzados Dorados (Set)',
      category: 'accesorios',
      categoryLabel: 'Accesorios y Detalles',
      price: 34000,
      originalPrice: 42000,
      rating: 4.7,
      reviewsCount: 17,
      badge: 'NUEVO',
      shortDescription: 'Dúo de aros dorados gruesos: uno de acabado liso espejo y otro con textura trenzada chic.',
      fullDescription: 'Los básicos infalibles de cualquier joyero femenino. Aros huecos ultraligeros que no pesan durante todo el día, equipados con cierre de click seguro que no se abre accidentalmente.',
      benefits: [
        'Ultraligeros: no estiran las orejas',
        'Cierre click seguro y fácil de abrochar',
        'Baño en oro de 18 quilates'
      ],
      includes: ['1 Par aros lisos gruesos', '1 Par aros trenzados de textura', 'Cajita decorada'],
      imageUrl: 'https://images.unsplash.com/photo-1611591475883-9b88cf14578b?auto=format&fit=crop&w=800&q=80',
      model3DType: 'jewelry',
      model3DLabel: 'Aros Dorados 3D',
      inStock: true
    },
    {
      id: 'prod-10',
      name: 'Caja de Regalo SAMELÁ Signature',
      category: 'regalos',
      categoryLabel: 'Regalos Sorpresa',
      price: 115000,
      originalPrice: 145000,
      rating: 5.0,
      reviewsCount: 43,
      badge: 'MÁS VENDIDO',
      shortDescription: 'Caja rosada de lujo con lazo de satén, papel seda con fragancia, skincare y accesorios.',
      fullDescription: 'La máxima expresión del emprendimiento SAMELÁ: "Pequeños detalles, grandes momentos". Incluye la famosa caja rosa rígida con detalles de corona y corazones, rellena de papel seda, confeti perlado, tarjeta de dedicatoria personalizada, un sérum facial, la diadema de spa acolchada, un espejo compacto dorado y aretes de corazón.',
      benefits: [
        'Presentación de alta gama lista para entregar sin envoltorios adicionales',
        'Incluye dedicatoria caligrafiada a mano personalizada con tu mensaje',
        'Aroma exclusivo a rosas frescas al abrir la caja',
        'Ahorro del 25% comparado con productos individuales'
      ],
      includes: [
        'Caja rígida rosa con lazo de satén y logo SAMELÁ',
        'Sérum Facial Vitamina C 30ml',
        'Espejo Compacto Grabado en Oro',
        'Diadema de Spa Acolchada Rosa',
        'Aretes Corazón Dorado 18k',
        'Tarjeta de Regalo Personalizada con Mensaje'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      model3DType: 'box',
      model3DLabel: 'Caja Rosa de Regalo 3D con Lazo',
      inStock: true
    },
    {
      id: 'prod-11',
      name: 'Colección SAMELÁ Deluxe',
      category: 'regalos',
      categoryLabel: 'Colecciones Especiales',
      price: 149000,
      originalPrice: 190000,
      rating: 5.0,
      reviewsCount: 18,
      badge: 'EDICIÓN LIMITADA',
      shortDescription: 'El combo definitivo: Kit Glow completo + Espejo dorado + Joyería + Empaque VIP.',
      fullDescription: 'La combinación más completa de belleza, cuidado facial y accesorios. Creado especialmente para sorprender en cumpleaños, aniversarios, día de la madre o fechas memorables.',
      benefits: [
        'El regalo más inolvidable y completo de la marca',
        'Envío prioritario con seguro total',
        'Incluye todas las piezas estelares de autocuidado'
      ],
      includes: [
        'Kit Glow Facial Completo (4 pasos)',
        'Espejo Compacto SAMELÁ Dorado',
        'Collar Triple Delicado',
        'Set de Aretes Corazón',
        'Caja Deluxe con moño y tarjeta'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
      model3DType: 'box',
      model3DLabel: 'Caja Regalo VIP 3D',
      inStock: true
    },
    {
      id: 'prod-12',
      name: 'Sérum Facial Ácido Hialurónico & Rosas',
      category: 'skincare',
      categoryLabel: 'Skincare Facial',
      price: 42000,
      originalPrice: 52000,
      rating: 4.9,
      reviewsCount: 35,
      badge: 'OFERTA',
      shortDescription: 'Sérum hidratante ultraconcentrado con extracto de rosas y péptidos regeneradores.',
      fullDescription: 'Tratamiento intensivo para recuperar la tersura, elasticidad y relleno de la piel. Su textura fluida no grasa se absorbe al instante dejando un resplandor saludable y fresco.',
      benefits: [
        'Retiene hasta 1000 veces su peso en agua en las capas profundas',
        'Calma irritaciones y rojeces causadas por el sol o contaminación',
        'Acabado suave sedoso ideal previo al maquillaje'
      ],
      includes: ['Frasco de vidrio ámbar-rosa 30ml con pipeta dosificadora de precisión'],
      skinType: 'Todo tipo de piel, especialmente deshidratadas',
      howToUse: 'Aplicar 3 a 4 gotas sobre el rostro limpio y cuello ligeramente humedecidos con tónico.',
      ingredients: 'Agua de Rosas Damascena, Ácido Hialurónico al 2%, Glicerina vegetal, Pantenol (Vitamina B5) y Vitamina E.',
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      model3DType: 'serum',
      model3DLabel: 'Gotero Facial 3D con Pipeta',
      inStock: true
    }
  ]);

  readonly selectedCategory = signal<ProductCategory>('todos');
  readonly searchQuery = signal<string>('');
  readonly selectedProductForModal = signal<Product | null>(null);
  readonly selectedProductFor3D = signal<Product | null>(null);

  readonly filteredProducts = computed(() => {
    const category = this.selectedCategory();
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.productsState();

    return list.filter(p => {
      const matchCategory = category === 'todos' || p.category === category || (category === 'combos' && (p.category === 'combos' || p.category === 'regalos'));
      const matchQuery = !query || 
        p.name.toLowerCase().includes(query) || 
        p.shortDescription.toLowerCase().includes(query) ||
        p.categoryLabel.toLowerCase().includes(query);
      return matchCategory && matchQuery;
    });
  });

  getProducts(): Product[] {
    return this.productsState();
  }

  getProductById(id: string): Product | undefined {
    return this.productsState().find(p => p.id === id);
  }

  setCategory(category: ProductCategory): void {
    this.selectedCategory.set(category);
  }

  setSearchQuery(q: string): void {
    this.searchQuery.set(q);
  }

  openProductModal(product: Product): void {
    this.selectedProductForModal.set(product);
  }

  closeProductModal(): void {
    this.selectedProductForModal.set(null);
  }

  open3DViewer(product: Product): void {
    this.selectedProductFor3D.set(product);
  }

  close3DViewer(): void {
    this.selectedProductFor3D.set(null);
  }
}
