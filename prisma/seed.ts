import bcrypt from 'bcryptjs';

import {
  PaymentStatus,
  PrismaClient,
  ReservationStatus,
  ServiceType,
  UserRole,
  VenueType,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');

  // Clear existing data
  await prisma.payment.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.service.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.user.deleteMany();
  await prisma.systemConfig.deleteMany();

  console.log('🧹 Cleared existing data');

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create comprehensive user base
  const users = await Promise.all([
    // Admin Users
    prisma.user.create({
      data: {
        email: 'admin@reservapp.com',
        firstName: 'Administrador',
        lastName: 'Sistema',
        password: hashedPassword,
        phone: '+52 33 1234 5678',
        role: UserRole.ADMIN,
        stripeCustomerId: 'cus_admin123',
      },
    }),
    prisma.user.create({
      data: {
        email: 'manager@reservapp.com',
        firstName: 'Gerente',
        lastName: 'General',
        password: hashedPassword,
        phone: '+52 33 8765 4321',
        role: UserRole.MANAGER,
        stripeCustomerId: 'cus_manager123',
      },
    }),
    prisma.user.create({
      data: {
        email: 'employee@reservapp.com',
        firstName: 'Empleado',
        lastName: 'Servicio',
        password: hashedPassword,
        phone: '+52 33 5555 1234',
        role: UserRole.EMPLOYEE,
      },
    }),

    // Regular Customers - Happy Path Users
    prisma.user.create({
      data: {
        email: 'juan.perez@gmail.com',
        firstName: 'Juan Carlos',
        lastName: 'Pérez González',
        password: hashedPassword,
        phone: '+52 33 1111 2222',
        role: UserRole.USER,
        stripeCustomerId: 'cus_juan123',
      },
    }),
    prisma.user.create({
      data: {
        email: 'maria.lopez@gmail.com',
        firstName: 'María Elena',
        lastName: 'López Hernández',
        password: hashedPassword,
        phone: '+52 33 3333 4444',
        role: UserRole.USER,
        stripeCustomerId: 'cus_maria123',
      },
    }),
    prisma.user.create({
      data: {
        email: 'carlos.rodriguez@hotmail.com',
        firstName: 'Carlos Alberto',
        lastName: 'Rodríguez Silva',
        password: hashedPassword,
        phone: '+52 33 5555 6666',
        role: UserRole.USER,
        stripeCustomerId: 'cus_carlos123',
      },
    }),

    // Customers with issues - Sad Path Users
    prisma.user.create({
      data: {
        email: 'ana.martinez@yahoo.com',
        firstName: 'Ana Patricia',
        lastName: 'Martínez Ruiz',
        password: hashedPassword,
        phone: '+52 33 7777 8888',
        role: UserRole.USER,
        stripeCustomerId: 'cus_ana123',
      },
    }),
    prisma.user.create({
      data: {
        email: 'roberto.garcia@outlook.com',
        firstName: 'Roberto',
        lastName: 'García Morales',
        password: hashedPassword,
        phone: '+52 33 9999 0000',
        role: UserRole.USER,
        stripeCustomerId: 'cus_roberto123',
      },
    }),
    prisma.user.create({
      data: {
        email: 'lucia.torres@gmail.com',
        firstName: 'Lucía Fernanda',
        lastName: 'Torres Jiménez',
        password: hashedPassword,
        phone: '+52 33 2222 3333',
        role: UserRole.USER,
        stripeCustomerId: 'cus_lucia123',
      },
    }),
    prisma.user.create({
      data: {
        email: 'diego.sanchez@gmail.com',
        firstName: 'Diego Alejandro',
        lastName: 'Sánchez Vega',
        password: hashedPassword,
        phone: '+52 33 4444 5555',
        role: UserRole.USER,
      },
    }),
  ]);

  console.log('👥 Created 10 users with diverse profiles');

  // Create comprehensive venues in various locations
  const casaSalazar = await prisma.venue.create({
    data: {
      address: 'Av. Juárez 170, Zona Centro',
      category: VenueType.ACCOMMODATION,
      checkInTime: '15:00',
      checkOutTime: '12:00',
      city: 'Ciudad Central',
      country: 'México',
      description:
        'Boutique venue ubicado en el corazón del centro histórico, combinando arquitectura colonial con comodidades modernas. Reconocido por su excelente servicio y ubicación privilegiada.',
      email: 'reservas@casasalazar.com',
      latitude: 20.6737777,
      longitude: -103.3475935,
      name: 'Casa Salazar',
      phone: '+52 33 3658 5438',
      rating: 4.5,
      state: 'Jalisco',
      website: 'https://casasalazar.com',
      zipCode: '44100',
    },
  });

  const moralesVenue = await prisma.venue.create({
    data: {
      address: 'Av. Corona 243, Centro Histórico',
      category: VenueType.ACCOMMODATION,
      checkInTime: '15:00',
      checkOutTime: '13:00',
      city: 'Ciudad Central',
      country: 'México',
      description:
        'Venue histórico en el centro de la ciudad, famoso por su arquitectura colonial y su ubicación privilegiada.',
      email: 'reservaciones@moralesvenue.com.mx',
      latitude: 20.6755556,
      longitude: -103.3444444,
      name: 'Morales Historical & Colonial Downtown Core',
      phone: '+52 33 3658 5232',
      rating: 4.3,
      state: 'Jalisco',
      website: 'https://moralesvenue.com.mx',
      zipCode: '44100',
    },
  });

  const restauranteSantoDomingo = await prisma.venue.create({
    data: {
      address: 'Belén 139, Centro Histórico',
      category: VenueType.RESTAURANT,
      city: 'Ciudad Central',
      country: 'México',
      description:
        'Restaurante tradicional especializado en birria y cocina regional desde 1950. Patrimonio culinario de calidad.',
      email: 'contacto@santodomingorestaurante.com',
      latitude: 20.6755556,
      longitude: -103.3444444,
      name: 'Restaurante Santo Domingo',
      phone: '+52 33 3613 6334',
      rating: 4.7,
      state: 'Jalisco',
      zipCode: '44100',
    },
  });

  const restaurantHueso = await prisma.venue.create({
    data: {
      address: 'Av. México 2903, Ladron de Guevara',
      category: VenueType.RESTAURANT,
      city: 'Ciudad Central',
      country: 'México',
      description:
        'Restaurante de alta cocina mexicana contemporánea, reconocido internacionalmente por su diseño único y propuesta gastronómica.',
      email: 'reservas@huesorestaurante.com',
      latitude: 20.6597222,
      longitude: -103.3875,
      name: 'Hueso Restaurante',
      phone: '+52 33 3647 7474',
      rating: 4.8,
      state: 'Jalisco',
      website: 'https://huesorestaurante.com',
      zipCode: '44620',
    },
  });

  const spaVitania = await prisma.venue.create({
    data: {
      address: 'Av. Patria 1501, Col. Puerta de Hierro',
      category: VenueType.SPA,
      city: 'Zapopan',
      country: 'México',
      description:
        'Spa de lujo especializado en tratamientos holísticos y medicina alternativa. Experiencia de relajación total.',
      email: 'reservas@vitaniaspa.mx',
      latitude: 20.6666667,
      longitude: -103.4166667,
      name: 'Vitania Spa',
      phone: '+52 33 3648 4848',
      rating: 4.8,
      state: 'Jalisco',
      website: 'https://vitaniaspa.mx',
      zipCode: '45116',
    },
  });

  const spaGrandFiesta = await prisma.venue.create({
    data: {
      address: 'Av. Aurelio Aceves 225, Col. Vallarta Norte',
      category: VenueType.SPA,
      city: 'Ciudad Central',
      country: 'México',
      description:
        'Spa de clase mundial ubicado en el Grand Fiesta Americana, ofreciendo tratamientos de lujo y relajación.',
      email: 'spa@grandfiestamericana.com',
      latitude: 20.6666667,
      longitude: -103.3902778,
      name: 'Grand Fiesta Americana Spa',
      phone: '+52 33 3818 1400',
      rating: 4.6,
      state: 'Jalisco',
      zipCode: '44690',
    },
  });

  const toursCentrales = await prisma.venue.create({
    data: {
      address: 'Plaza de Armas, Centro Histórico',
      category: VenueType.TOUR_OPERATOR,
      city: 'Ciudad Central',
      country: 'México',
      description:
        'Tours culturales y gastronómicos por la región. Descubre la auténtica cultura local.',
      email: 'info@gdlculturaltours.com',
      latitude: 20.6755556,
      longitude: -103.3419444,
      name: 'Tours Culturales Regionales',
      phone: '+52 33 1234 5678',
      rating: 4.6,
      state: 'Jalisco',
      website: 'https://gdlculturaltours.com',
      zipCode: '44100',
    },
  });

  const toursTequila = await prisma.venue.create({
    data: {
      address: 'José Cuervo 73, Tequila',
      category: VenueType.TOUR_OPERATOR,
      city: 'Tequila',
      country: 'México',
      description:
        'Tours exclusivos a las destilerías de tequila en Tequila, Jalisco. Experiencia completa del proceso del tequila.',
      email: 'tours@mundocuervo.com',
      latitude: 20.8811111,
      longitude: -103.8372222,
      name: 'Mundo Cuervo Tours',
      phone: '+52 374 742 2442',
      rating: 4.9,
      state: 'Jalisco',
      website: 'https://mundocuervo.com',
      zipCode: '46400',
    },
  });

  const centroEventos = await prisma.venue.create({
    data: {
      address: 'Av. Mariano Otero 1499, Verde Valle',
      category: VenueType.EVENT_CENTER,
      city: 'Ciudad Central',
      country: 'México',
      description:
        'El centro de convenciones más importante del occidente de México. Espacios versátiles para todo tipo de eventos.',
      email: 'eventos@expoguadalajara.com.mx',
      latitude: 20.6319444,
      longitude: -103.4047222,
      name: 'Centro de Convenciones Central',
      phone: '+52 33 3343 3000',
      rating: 4.4,
      state: 'Jalisco',
      website: 'https://expoguadalajara.com.mx',
      zipCode: '44550',
    },
  });

  const teatroDegollado = await prisma.venue.create({
    data: {
      address: 'Av. Degollado s/n, Centro Histórico',
      category: VenueType.ENTERTAINMENT,
      city: 'Ciudad Central',
      country: 'México',
      description:
        'Teatro histórico, sede de espectáculos culturales y eventos especiales. Patrimonio arquitectónico de la ciudad.',
      email: 'eventos@teatrodegollado.com',
      latitude: 20.6761111,
      longitude: -103.3436111,
      name: 'Teatro Degollado',
      phone: '+52 33 3614 4773',
      rating: 4.7,
      state: 'Jalisco',
      zipCode: '44100',
    },
  });

  console.log('🏢 Created 10 diverse venues across various locations');

  // Create comprehensive services with realistic pricing

  // Casa Salazar Services (Accommodation)
  const casaSalazarServices = await Promise.all([
    prisma.service.create({
      data: {
        amenities: [
          'WiFi gratuito',
          'TV LED 65"',
          'Minibar premium',
          'Aire acondicionado',
          'Caja fuerte',
          'Balcón privado',
          'Jacuzzi',
          'Servicio de mayordomo',
          'Desayuno incluido',
        ],
        cancellationPolicy:
          'Cancelación gratuita hasta 48 horas antes. Cancelaciones tardías tienen cargo del 50%.',
        capacity: 4,
        category: ServiceType.ACCOMMODATION,
        description:
          'Suite de lujo con decoración colonial mexicana auténtica, sala de estar separada, jacuzzi privado, vista panorámica al Centro Histórico y servicio de mayordomo personal.',
        duration: 1440,
        images: [
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
        ],
        name: 'Suite Presidencial Colonial',

        price: 4500.0,

        subcategory: 'Suite Presidencial',
        // 24 hours
        venueId: casaSalazar.id,
      },
    }),
    prisma.service.create({
      data: {
        amenities: [
          'WiFi gratuito',
          'TV LED 55"',
          'Minibar',
          'Aire acondicionado',
          'Caja fuerte',
          'Balcón',
          'Escritorio',
        ],
        cancellationPolicy: 'Cancelación gratuita hasta 24 horas antes.',
        capacity: 2,
        category: ServiceType.ACCOMMODATION,
        description:
          'Suite elegante con decoración colonial mexicana, cama king size, sala de estar y vista al jardín interior.',
        duration: 1440,
        images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'],
        name: 'Suite Junior Colonial',
        price: 2800.0,
        subcategory: 'Suite',
        venueId: casaSalazar.id,
      },
    }),
    prisma.service.create({
      data: {
        amenities: [
          'WiFi gratuito',
          'TV LED 42"',
          'Aire acondicionado',
          'Escritorio',
          'Amenidades premium',
          'Cafetera',
        ],
        cancellationPolicy: 'Cancelación gratuita hasta 24 horas antes.',
        capacity: 2,
        category: ServiceType.ACCOMMODATION,
        description:
          'Habitación elegante con cama matrimonial, escritorio y baño completo con amenidades premium. Vista a la ciudad.',
        duration: 1440,
        name: 'Habitación Deluxe',
        price: 1800.0,
        subcategory: 'Habitación',
        venueId: casaSalazar.id,
      },
    }),
    prisma.service.create({
      data: {
        amenities: ['WiFi gratuito', 'TV LED 32"', 'Aire acondicionado', 'Baño privado'],
        cancellationPolicy: 'Cancelación gratuita hasta 12 horas antes.',
        capacity: 2,
        category: ServiceType.ACCOMMODATION,
        description:
          'Habitación cómoda y funcional con todas las amenidades básicas para una estancia placentera.',
        duration: 1440,
        name: 'Habitación Estándar',
        price: 1200.0,
        subcategory: 'Habitación',
        venueId: casaSalazar.id,
      },
    }),
  ]);

  // Morales Venue Services
  const moralesVenueServices = await Promise.all([
    prisma.service.create({
      data: {
        amenities: [
          'WiFi gratuito',
          'TV LED 50"',
          'Minibar',
          'Aire acondicionado',
          'Vista a la Catedral',
          'Mobiliario de época',
        ],
        cancellationPolicy: 'Cancelación gratuita hasta 24 horas antes.',
        capacity: 2,
        category: ServiceType.ACCOMMODATION,
        description:
          'Suite con elementos arquitectónicos originales del siglo XIX, mobiliario de época y vista a la catedral local.',
        duration: 1440,
        name: 'Suite Ejecutiva Histórica',
        price: 3200.0,
        subcategory: 'Suite Ejecutiva',
        venueId: moralesVenue.id,
      },
    }),
    prisma.service.create({
      data: {
        amenities: [
          'WiFi gratuito',
          'TV LED 40"',
          'Aire acondicionado',
          'Techos altos',
          'Vista al centro',
        ],
        cancellationPolicy: 'Cancelación gratuita hasta 24 horas antes.',
        capacity: 2,
        category: ServiceType.ACCOMMODATION,
        description:
          'Habitación con decoración colonial tradicional, techos altos y ventanas grandes con vista al centro histórico.',
        duration: 1440,
        name: 'Habitación Colonial Superior',
        price: 1600.0,
        subcategory: 'Habitación',
        venueId: moralesVenue.id,
      },
    }),
  ]);

  // Restaurant Services
  const restaurantServices = await Promise.all([
    // Santo Domingo
    prisma.service.create({
      data: {
        amenities: ['Ubicación VIP', 'Servicio personalizado', 'Vista al jardín', 'Mesa reservada'],

        cancellationPolicy: 'Cancelación gratuita hasta 2 horas antes.',

        // Costo de reserva
        capacity: 2,

        category: ServiceType.DINING,

        description:
          'Mesa íntima en el área VIP del restaurante con vista al jardín interior y servicio personalizado.',
        duration: 120,
        name: 'Mesa para 2 personas - Área VIP',
        price: 200.0,
        subcategory: 'Mesa VIP',
        venueId: restauranteSantoDomingo.id,
      },
    }),
    prisma.service.create({
      data: {
        amenities: ['Mesa amplia', 'Servicio familiar', 'Área principal'],
        cancellationPolicy: 'Cancelación gratuita hasta 1 hora antes.',
        capacity: 4,
        category: ServiceType.DINING,
        description:
          'Mesa familiar en el área principal del restaurante, perfecta para disfrutar en familia.',
        duration: 120,
        name: 'Mesa para 4 personas',
        price: 0.0,
        subcategory: 'Mesa',
        venueId: restauranteSantoDomingo.id,
      },
    }),
    prisma.service.create({
      data: {
        amenities: [
          'Birria tradicional',
          'Consomé',
          'Quesabirrias',
          'Tortillas hechas a mano',
          'Bebida tradicional',
          'Postres',
        ],
        cancellationPolicy: 'Cancelación con cargo del 50% si es menos de 4 horas antes.',
        capacity: 1,
        category: ServiceType.DINING,
        description:
          'Degustación completa de birria tradicional con maridaje de bebidas típicas, incluye consomé, quesabirrias y postres tradicionales.',
        duration: 90,
        name: 'Experiencia Gastronómica Birria Completa',
        price: 450.0,
        subcategory: 'Experiencia',
        venueId: restauranteSantoDomingo.id,
      },
    }),
    prisma.service.create({
      data: {
        amenities: [
          'Menú de 3 tiempos',
          'Copa de vino incluida',
          'Ambiente romántico',
          'Postre especial',
        ],
        cancellationPolicy: 'Cancelación con cargo del 100% si es menos de 24 horas antes.',
        capacity: 2,
        category: ServiceType.DINING,
        description:
          'Menú romántico diseñado especialmente para parejas, incluye entrada, plato fuerte, postre y copa de vino.',
        duration: 150,
        name: 'Cena Especial para Parejas',
        price: 850.0,
        subcategory: 'Experiencia',
        venueId: restauranteSantoDomingo.id,
      },
    }),

    // Hueso Restaurant
    prisma.service.create({
      data: {
        amenities: [
          'Vista a cocina abierta',
          'Interacción con chef',
          'Menú especial',
          'Experiencia única',
        ],
        cancellationPolicy: 'Cancelación con cargo del 100% si es menos de 48 horas antes.',
        capacity: 6,
        category: ServiceType.DINING,
        description:
          'Mesa especial frente a la cocina abierta para observar la preparación de los platillos por el chef ejecutivo.',
        duration: 180,
        name: "Mesa Chef's Table",
        price: 500.0,
        subcategory: "Chef's Table",
        venueId: restaurantHueso.id,
      },
    }),
    prisma.service.create({
      data: {
        amenities: ['7 tiempos', 'Creación del chef', 'Maridaje opcional', 'Experiencia gourmet'],
        cancellationPolicy: 'Cancelación con cargo del 100% si es menos de 72 horas antes.',
        capacity: 1,
        category: ServiceType.DINING,
        description:
          'Experiencia culinaria completa con 7 tiempos diseñados por el chef, maridaje de vinos opcional.',
        duration: 180,
        name: 'Menú Degustación 7 Tiempos',
        price: 1200.0,
        requiresApproval: true,
        subcategory: 'Degustación',
        venueId: restaurantHueso.id,
      },
    }),
  ]);

  // Spa Services with comprehensive treatments
  const spaServices = await Promise.all([
    // Vitania Spa
    prisma.service.create({
      data: {
        amenities: [
          'Aceites premium importados',
          'Aromaterapia personalizada',
          'Música relajante',
          'Toallas calientes',
          'Té de relajación',
        ],
        cancellationPolicy:
          'Cancelación gratuita hasta 4 horas antes. Cancelación tardía con cargo del 50%.',
        capacity: 1,
        category: ServiceType.SPA_WELLNESS,
        description:
          'Masaje de cuerpo completo con aceites esenciales importados, aromaterapia personalizada y técnicas de relajación profunda.',
        duration: 90,
        name: 'Masaje Relajante Completo Premium',
        price: 1500.0,
        subcategory: 'Masaje Premium',
        venueId: spaVitania.id,
      },
    }),
    prisma.service.create({
      data: {
        amenities: [
          'Piedras volcánicas',
          'Aceites terapéuticos',
          'Ambiente relajante',
          'Música zen',
        ],
        cancellationPolicy: 'Cancelación gratuita hasta 4 horas antes.',
        capacity: 1,
        category: ServiceType.SPA_WELLNESS,
        description:
          'Terapia con piedras volcánicas calientes que ayuda a relajar los músculos y mejorar la circulación.',
        duration: 75,
        name: 'Masaje de Piedras Calientes',
        price: 1200.0,
        subcategory: 'Masaje Terapéutico',
        venueId: spaVitania.id,
      },
    }),
    prisma.service.create({
      data: {
        amenities: [
          'Productos anti-edad',
          'Limpieza profunda',
          'Mascarilla especializada',
          'Hidratación intensiva',
          'Masaje facial',
        ],
        cancellationPolicy: 'Cancelación gratuita hasta 2 horas antes.',
        capacity: 1,
        category: ServiceType.SPA_WELLNESS,
        description:
          'Tratamiento facial profundo con productos anti-edad, incluye limpieza, exfoliación, mascarilla y hidratación intensiva.',
        duration: 75,
        name: 'Facial Hidratante Premium Anti-Edad',
        price: 950.0,
        subcategory: 'Facial Premium',
        venueId: spaVitania.id,
      },
    }),
    prisma.service.create({
      data: {
        amenities: [
          'Masaje completo',
          'Facial premium',
          'Jacuzzi privado',
          'Sauna',
          'Área de relajación VIP',
          'Comida saludable',
          'Bebidas naturales',
          'Bata y pantuflas',
        ],
        cancellationPolicy: 'Cancelación con cargo del 50% si es menos de 24 horas antes.',
        capacity: 1,
        category: ServiceType.SPA_WELLNESS,
        description:
          'Experiencia completa de día de spa: masaje completo, facial, acceso a jacuzzi, sauna, área de relajación y comida saludable.',
        duration: 360,
        name: 'Paquete Día de Spa Completo VIP',
        price: 3500.0,

        requiresApproval: true,

        subcategory: 'Paquete VIP',
        // 6 hours
        venueId: spaVitania.id,
      },
    }),
    prisma.service.create({
      data: {
        amenities: [
          'Exfoliación corporal',
          'Envoltura de algas',
          'Masaje drenante',
          'Productos detox',
          'Hidratación corporal',
        ],
        cancellationPolicy: 'Cancelación gratuita hasta 4 horas antes.',
        capacity: 1,
        category: ServiceType.SPA_WELLNESS,
        description:
          'Tratamiento completo de desintoxicación corporal con exfoliación, envoltura de algas y masaje drenante.',
        duration: 120,
        name: 'Tratamiento Corporal Detox',
        price: 1800.0,
        subcategory: 'Tratamiento Corporal',
        venueId: spaVitania.id,
      },
    }),

    // Grand Fiesta Americana Spa
    prisma.service.create({
      data: {
        amenities: ['Técnica sueca tradicional', 'Aceites relajantes', 'Ambiente tranquilo'],
        cancellationPolicy: 'Cancelación gratuita hasta 2 horas antes.',
        capacity: 1,
        category: ServiceType.SPA_WELLNESS,
        description:
          'Masaje tradicional sueco para aliviar tensiones y promover la relajación profunda.',
        duration: 60,
        name: 'Masaje Sueco Relajante',
        price: 980.0,
        subcategory: 'Masaje',
        venueId: spaGrandFiesta.id,
      },
    }),
  ]);

  // Tour Services with comprehensive experiences
  const tourServices = await Promise.all([
    // Tours Culturales Regionales
    prisma.service.create({
      data: {
        amenities: [
          'Guía certificado privado',
          'Transporte privado',
          'Entrada a museos',
          'Degustación local',
          'Agua y snacks',
          'Seguro incluido',
        ],
        cancellationPolicy: 'Cancelación gratuita hasta 24 horas antes.',
        capacity: 1,
        category: ServiceType.TOUR_EXPERIENCE,
        description:
          'Recorrido guiado VIP por los principales monumentos y sitios históricos de la región con guía certificado y transporte privado.',
        duration: 240,
        name: 'Tour Centro Histórico Premium',
        price: 650.0,

        subcategory: 'Tour Cultural Premium',
        // 4 hours
        venueId: toursCentrales.id,
      },
    }),
    prisma.service.create({
      data: {
        amenities: [
          'Guía certificado',
          'Transporte compartido',
          'Entrada a museos',
          'Degustación local',
        ],
        cancellationPolicy: 'Cancelación gratuita hasta 12 horas antes.',
        capacity: 1,
        category: ServiceType.TOUR_EXPERIENCE,
        description:
          'Recorrido guiado grupal por los principales monumentos y sitios históricos de la región.',
        duration: 180,
        name: 'Tour Centro Histórico Grupal',
        price: 350.0,
        subcategory: 'Tour Cultural',
        venueId: toursCentrales.id,
      },
    }),
    prisma.service.create({
      data: {
        amenities: [
          'Chef acompañante',
          'Degustaciones premium',
          'Transporte privado',
          'Recetario digital',
          'Bebidas incluidas',
        ],
        cancellationPolicy: 'Cancelación con cargo del 50% si es menos de 48 horas antes.',
        capacity: 1,
        category: ServiceType.TOUR_EXPERIENCE,
        description:
          'Experiencia culinaria VIP por los mejores restaurantes y mercados de Tlaquepaque con chef acompañante.',
        duration: 300,
        name: 'Tour Gastronómico Tlaquepaque Premium',
        price: 950.0,

        requiresApproval: true,

        subcategory: 'Tour Gastronómico Premium',
        // 5 hours
        venueId: toursCentrales.id,
      },
    }),
    prisma.service.create({
      data: {
        amenities: ['Guía nocturno', 'Transporte', 'Seguridad incluida', 'Bebida de bienvenida'],
        cancellationPolicy: 'Cancelación gratuita hasta 6 horas antes.',
        capacity: 1,
        category: ServiceType.TOUR_EXPERIENCE,
        description:
          'Recorrido nocturno por la ciudad iluminada, incluyendo los principales monumentos y vida nocturna local.',
        duration: 180,
        name: 'Tour Nocturno Regional',
        price: 420.0,
        subcategory: 'Tour Nocturno',
        venueId: toursCentrales.id,
      },
    }),

    // Mundo Cuervo Tours
    prisma.service.create({
      data: {
        amenities: [
          'Transporte de lujo',
          'Cata premium de tequilas',
          'Comida gourmet',
          'Mariachi privado',
          'Guía especializado',
          'Certificado de degustador',
        ],
        cancellationPolicy: 'Cancelación con cargo del 100% si es menos de 72 horas antes.',
        capacity: 1,
        category: ServiceType.TOUR_EXPERIENCE,
        description:
          'Tour VIP a las destilerías con cata premium de tequilas añejos, comida gourmet y espectáculo de mariachi privado.',
        duration: 480,
        name: 'Experiencia Tequila Master Premium',
        price: 1800.0,

        requiresApproval: true,

        subcategory: 'Experiencia Premium',
        // 8 hours
        venueId: toursTequila.id,
      },
    }),
    prisma.service.create({
      data: {
        amenities: [
          'Transporte compartido',
          'Degustación de tequila',
          'Comida típica',
          'Show de mariachi',
          'Guía bilingüe',
        ],
        cancellationPolicy: 'Cancelación gratuita hasta 48 horas antes.',
        capacity: 1,
        category: ServiceType.TOUR_EXPERIENCE,
        description:
          'Excursión tradicional a destilerías de tequila con degustación, comida típica y espectáculo de mariachi.',
        duration: 480,
        name: 'Tour Tequila y Mariachi Tradicional',
        price: 1200.0,
        subcategory: 'Tour Tradicional',
        venueId: toursTequila.id,
      },
    }),
    prisma.service.create({
      data: {
        amenities: ['Transporte', 'Degustación básica', 'Comida ligera', 'Guía local'],
        cancellationPolicy: 'Cancelación gratuita hasta 24 horas antes.',
        capacity: 1,
        category: ServiceType.TOUR_EXPERIENCE,
        description:
          'Tour rápido de medio día a una destilería local con degustación básica y comida ligera.',
        duration: 240,
        name: 'Tour Express Tequila',
        price: 650.0,
        subcategory: 'Tour Express',
        venueId: toursTequila.id,
      },
    }),
  ]);

  // Event Services
  const eventServices = await Promise.all([
    // Centro de Convenciones Central
    prisma.service.create({
      data: {
        amenities: [
          'Escenario profesional',
          'Sistema audiovisual 4K',
          'Climatización',
          'Estacionamiento VIP',
          'Catering disponible',
          'Soporte técnico',
        ],
        cancellationPolicy: 'Cancelación con cargo del 50% si es menos de 30 días antes.',
        capacity: 800,
        category: ServiceType.EVENT_MEETING,
        description:
          'Auditorio de lujo para conferencias y eventos corporativos hasta 800 personas con tecnología de punta.',
        duration: 480,
        name: 'Auditorio Principal Premium',
        price: 25000.0,

        requiresApproval: true,

        subcategory: 'Auditorio Premium',
        // 8 hours
        venueId: centroEventos.id,
      },
    }),
    prisma.service.create({
      data: {
        amenities: [
          'Diseño flexible',
          'Sistema de audio',
          'Iluminación profesional',
          'Aire acondicionado',
          'Estacionamiento',
        ],
        cancellationPolicy: 'Cancelación con cargo del 30% si es menos de 15 días antes.',
        capacity: 300,
        category: ServiceType.EVENT_MEETING,
        description:
          'Salón versátil para eventos corporativos, bodas y celebraciones hasta 300 personas.',
        duration: 480,
        name: 'Salón de Eventos Grande',
        price: 15000.0,
        requiresApproval: true,
        subcategory: 'Salón Grande',
        venueId: centroEventos.id,
      },
    }),
    prisma.service.create({
      data: {
        amenities: [
          'Ambiente íntimo',
          'Proyector HD',
          'Sistema de audio',
          'WiFi',
          'Aire acondicionado',
        ],
        cancellationPolicy: 'Cancelación gratuita hasta 7 días antes.',
        capacity: 100,
        category: ServiceType.EVENT_MEETING,
        description:
          'Salón ideal para reuniones corporativas y eventos íntimos hasta 100 personas.',
        duration: 480,
        name: 'Salón de Eventos Mediano',
        price: 8000.0,
        subcategory: 'Salón Mediano',
        venueId: centroEventos.id,
      },
    }),
    prisma.service.create({
      data: {
        amenities: [
          'Mesa de juntas premium',
          'Videoconferencia',
          'Proyector 4K',
          'WiFi premium',
          'Catering ejecutivo',
          'Servicio personalizado',
        ],
        cancellationPolicy: 'Cancelación gratuita hasta 24 horas antes.',
        capacity: 20,
        category: ServiceType.EVENT_MEETING,
        description:
          'Sala exclusiva para reuniones ejecutivas hasta 20 personas con tecnología avanzada.',
        duration: 240,
        name: 'Sala de Juntas Ejecutiva',
        price: 3500.0,
        subcategory: 'Sala Ejecutiva',
        venueId: centroEventos.id,
      },
    }),

    // Teatro Degollado
    prisma.service.create({
      data: {
        amenities: [
          'Teatro histórico completo',
          'Escenario profesional',
          'Iluminación teatral',
          'Sistema de sonido',
          'Camerinos',
          'Staff especializado',
        ],
        cancellationPolicy: 'Cancelación con cargo del 100% si es menos de 60 días antes.',
        capacity: 1000,
        category: ServiceType.ENTERTAINMENT,
        description:
          'Alquiler del teatro histórico para eventos culturales especiales, presentaciones y galas.',
        duration: 240,
        name: 'Evento Cultural en Teatro Histórico',
        price: 35000.0,
        requiresApproval: true,
        subcategory: 'Teatro Completo',
        venueId: teatroDegollado.id,
      },
    }),
    prisma.service.create({
      data: {
        amenities: [
          'Palco exclusivo',
          'Vista premium',
          'Servicio de mesero',
          'Bebidas incluidas',
          'Programa del evento',
        ],
        cancellationPolicy: 'Cancelación gratuita hasta 48 horas antes.',
        capacity: 8,
        category: ServiceType.ENTERTAINMENT,
        description:
          'Palco exclusivo VIP para espectáculos y eventos especiales con servicio premium.',
        duration: 180,
        name: 'Palco VIP para Espectáculos',
        price: 2500.0,
        subcategory: 'Palco VIP',
        venueId: teatroDegollado.id,
      },
    }),
  ]);

  console.log('🎯 Created 35+ diverse services with realistic pricing');

  // Create comprehensive reservations covering all scenarios
  const reservations = await Promise.all([
    // HAPPY PATH SCENARIOS

    // 1. Successful Service Reservation - Completed Stay
    prisma.reservation.create({
      data: {
        // Suite Junior Colonial
        checkInDate: new Date('2024-11-15'),

        checkOutDate: new Date('2024-11-17'),

        guests: 2,

        metadata: {
          checkInTime: '14:30',
          checkOutTime: '13:15',
          guestPreferences: ['Almohadas extra suaves', 'Vista al jardín'],
          satisfactionRating: 5,
        },

        notes: 'Aniversario de bodas - 5 años',

        serviceId: casaSalazarServices[1].id,

        specialRequests: 'Decoración romántica, champagne de cortesía y late checkout',

        // 2 nights * 2800
        status: ReservationStatus.CHECKED_OUT,

        totalAmount: 5600.0,

        userId: users[3].id,
        // Juan Carlos
        venueId: casaSalazar.id,
      },
    }),

    // 2. Confirmed Spa Package - Upcoming
    prisma.reservation.create({
      data: {
        // Paquete Día de Spa Completo VIP
        checkInDate: new Date('2024-12-20'),

        checkOutDate: new Date('2024-12-20'),

        guests: 1,

        metadata: {
          allergies: ['Almendra'],
          birthdayTreat: true,
          preferredScents: ['Lavanda', 'Eucalipto'],
        },

        notes: 'Regalo de cumpleaños personal',

        serviceId: spaServices[3].id,

        specialRequests: 'Alérgica a aceites de almendra, preferencia por aromaterapia de lavanda',

        status: ReservationStatus.CONFIRMED,

        totalAmount: 3500.0,

        userId: users[4].id,
        // María Elena
        venueId: spaVitania.id,
      },
    }),

    // 3. Premium Tour Experience - Confirmed
    prisma.reservation.create({
      data: {
        // Experiencia Tequila Master Premium
        checkInDate: new Date('2024-12-18'),

        checkOutDate: new Date('2024-12-18'),

        guests: 6,

        metadata: {
          corporateEvent: true,
          dietaryRestrictions: ['Vegetarian (2 guests)'],
          languages: ['Spanish', 'English'],
          pickupLocation: 'Morales Venue',
        },

        notes: 'Celebración empresarial con clientes internacionales',

        serviceId: tourServices[4].id,

        specialRequests:
          'Guía bilingüe inglés-español, menú vegetariano para 2 personas, transporte desde venue',

        // 6 people * 1800
        status: ReservationStatus.CONFIRMED,

        totalAmount: 10800.0,

        userId: users[5].id,
        // Carlos Alberto
        venueId: toursTequila.id,
      },
    }),

    // 4. Restaurant Fine Dining - Checked In
    prisma.reservation.create({
      data: {
        // Menú Degustación 7 Tiempos
        checkInDate: new Date('2024-12-10'),

        checkOutDate: new Date('2024-12-10'),

        guests: 2,

        metadata: {
          anniversary: true,
          celebrationReason: '10th wedding anniversary',
          tablePreference: 'Window view',
          winepairing: true,
        },

        notes: 'Cena de aniversario - 10 años de matrimonio',

        serviceId: restaurantServices[5].id,

        specialRequests: 'Mesa con vista, maridaje de vinos, postre especial de aniversario',

        // 2 people * 1200
        status: ReservationStatus.CHECKED_IN,

        totalAmount: 2400.0,

        userId: users[6].id,
        // Ana Patricia
        venueId: restaurantHueso.id,
      },
    }),

    // 5. Event Space Corporate - Confirmed
    prisma.reservation.create({
      data: {
        // Sala de Juntas Ejecutiva
        checkInDate: new Date('2024-12-15'),

        checkOutDate: new Date('2024-12-15'),

        guests: 15,

        metadata: {
          cateringType: 'Executive',
          corporateEvent: true,
          meetingType: 'Board meeting',
          videoconference: true,
        },

        notes: 'Junta de consejo directivo trimestral',

        serviceId: eventServices[3].id,

        specialRequests: 'Catering ejecutivo, videoconferencia con oficina matriz, coffee break',

        status: ReservationStatus.CONFIRMED,

        totalAmount: 3500.0,

        userId: users[1].id,
        // Gerente
        venueId: centroEventos.id,
      },
    }),

    // SAD PATH SCENARIOS

    // 6. Cancelled Service Reservation - Customer Cancellation
    prisma.reservation.create({
      data: {
        // Suite Ejecutiva Histórica
        checkInDate: new Date('2024-12-25'),

        checkOutDate: new Date('2024-12-27'),

        guests: 2,

        metadata: {
          cancellationDate: new Date('2024-12-20'),
          cancellationReason: 'Family emergency',
          refundAmount: 6400.0,
          refundStatus: 'processed',
        },

        notes: 'Cancelado por emergencia familiar',

        serviceId: moralesVenueServices[0].id,

        specialRequests: 'Había solicitado late checkout y decoración navideña',

        // 2 nights * 3200
        status: ReservationStatus.CANCELLED,

        totalAmount: 6400.0,

        userId: users[7].id,
        // Roberto García
        venueId: moralesVenue.id,
      },
    }),

    // 7. No Show Spa Appointment
    prisma.reservation.create({
      data: {
        // Masaje Sueco Relajante
        checkInDate: new Date('2024-12-05'),

        checkOutDate: new Date('2024-12-05'),

        guests: 1,

        metadata: {
          attemptedContact: true,
          contactAttempts: 3,
          noShowTime: '10:15',
          waitTime: 30,
        },

        notes: 'Cliente no se presentó a la cita',

        serviceId: spaServices[5].id,

        specialRequests: 'Había solicitado música clásica durante el masaje',

        status: ReservationStatus.NO_SHOW,

        totalAmount: 980.0,

        userId: users[8].id,
        // Lucía Fernanda
        venueId: spaGrandFiesta.id,
      },
    }),

    // 8. Cancelled Tour - Weather Issues
    prisma.reservation.create({
      data: {
        // Tour Nocturno Regional
        checkInDate: new Date('2024-12-08'),

        checkOutDate: new Date('2024-12-08'),

        guests: 4,

        metadata: {
          cancellationInitiator: 'venue',
          cancellationReason: 'Weather conditions',
          refundAmount: 1680.0,
          rescheduleOffered: true,
          weatherCondition: 'Heavy rain storm',
        },

        notes: 'Tour cancelado por condiciones climáticas adversas',

        serviceId: tourServices[3].id,

        specialRequests: 'Había solicitado paradas adicionales en mercados locales',

        // 4 people * 420
        status: ReservationStatus.CANCELLED,

        totalAmount: 1680.0,

        userId: users[9].id,
        // Diego Alejandro
        venueId: toursCentrales.id,
      },
    }),

    // 9. Pending Large Event - Awaiting Approval
    prisma.reservation.create({
      data: {
        // Evento Cultural en Teatro Histórico
        checkInDate: new Date('2025-03-15'),

        checkOutDate: new Date('2025-03-15'),

        guests: 800,

        metadata: {
          approvalRequired: ['Cultural ministry', 'Theater board'],
          awaitingApproval: true,
          cateringRequired: true,
          decorationTheme: 'Classical elegance',
          eventType: 'Charity gala',
        },

        notes: 'Gala benéfica anual de la fundación',

        serviceId: eventServices[4].id,

        specialRequests:
          'Requiere aprobación especial, decoración temática, servicio de catering para 800 personas',

        status: ReservationStatus.PENDING,

        totalAmount: 35000.0,

        userId: users[6].id,
        // Ana Patricia
        venueId: teatroDegollado.id,
      },
    }),

    // 10. Problematic Reservation - Multiple Changes
    prisma.reservation.create({
      data: {
        // Cena Especial para Parejas
        checkInDate: new Date('2024-12-14'),

        checkOutDate: new Date('2024-12-14'),

        guests: 2,

        metadata: {
          dietaryRestrictions: ['Gluten-free (1 guest)'],
          modificationsCount: 3,
          originalDate: new Date('2024-12-07'),
          previousDates: ['2024-12-07', '2024-12-12', '2024-12-13'],
          specialOccasion: 'Proposal dinner',
        },

        notes: 'Reservación modificada 3 veces por cambios de fecha del cliente',

        serviceId: restaurantServices[3].id,

        specialRequests:
          'Mesa en terraza, menú sin gluten para una persona, vino espumoso nacional',

        status: ReservationStatus.CONFIRMED,

        totalAmount: 850.0,

        userId: users[7].id,
        // Roberto García
        venueId: restauranteSantoDomingo.id,
      },
    }),

    // 11. Successful Multi-Service Experience
    prisma.reservation.create({
      data: {
        // Suite Presidencial Colonial
        checkInDate: new Date('2024-12-22'),

        checkOutDate: new Date('2024-12-25'),

        guests: 4,

        metadata: {
          additionalServices: ['Spa treatments', 'Cultural tours', 'Airport transfer'],
          familyStay: true,
          guestAges: [35, 38, 12, 9],
          holidayPackage: true,
        },

        notes: 'Estancia navideña familiar con servicios adicionales',

        serviceId: casaSalazarServices[0].id,

        specialRequests:
          'Servicios de spa, tours culturales, cenas especiales, transporte al aeropuerto',

        // 3 nights * 4500
        status: ReservationStatus.CONFIRMED,

        totalAmount: 13500.0,

        userId: users[4].id,
        // María Elena
        venueId: casaSalazar.id,
      },
    }),

    // 12. Last Minute Booking - Express Service
    prisma.reservation.create({
      data: {
        // Masaje Relajante Completo Premium
        checkInDate: new Date('2024-12-12'),

        checkOutDate: new Date('2024-12-12'),

        guests: 1,

        metadata: {
          bookingTime: '2 hours before service',
          focusAreas: ['Neck', 'Shoulders'],
          lastMinuteBooking: true,
          preferredOils: ['Peppermint', 'Eucalyptus'],
          stressRelief: true,
        },

        notes: 'Reservación de último minuto por estrés laboral',

        serviceId: spaServices[0].id,

        specialRequests: 'Terapia enfocada en tensión de cuello y hombros, aceites de menta',

        status: ReservationStatus.CONFIRMED,

        totalAmount: 1500.0,

        userId: users[5].id,
        // Carlos Alberto
        venueId: spaVitania.id,
      },
    }),
  ]);

  console.log('📅 Created 12 comprehensive reservations covering all business scenarios');

  // Create comprehensive payment records covering all statuses
  const payments = await Promise.all([
    // COMPLETED PAYMENTS - Happy Path

    // 1. Successful Service Payment - Full Amount
    prisma.payment.create({
      data: {
        // Service completed stay
        amount: 5600.0,

        currency: 'MXN',

        description: 'Pago completo Suite Junior Colonial - 2 noches',

        metadata: {
          cardBrand: 'visa',
          cardLast4: '4242',
          invoiceNumber: 'INV-2024-001',
          receiptSent: true,
        },

        paymentMethod: 'STRIPE_CARD',
        // Juan Carlos
        reservationId: reservations[0].id,
        status: PaymentStatus.COMPLETED,
        stripePaymentId: 'pi_completed_service_001',
        transactionDate: new Date('2024-11-10'),
        userId: users[3].id,
      },
    }),

    // 2. Successful Spa VIP Package Payment
    prisma.payment.create({
      data: {
        // Spa VIP package
        amount: 3500.0,

        currency: 'MXN',

        description: 'Pago Paquete Día de Spa Completo VIP',

        metadata: {
          cardBrand: 'mastercard',
          cardLast4: '5556',
          giftMessage: 'Happy Birthday! Enjoy your special day!',
          invoiceNumber: 'INV-2024-002',
          receiptSent: true,
        },

        paymentMethod: 'STRIPE_CARD',
        // María Elena
        reservationId: reservations[1].id,
        status: PaymentStatus.COMPLETED,
        stripePaymentId: 'pi_completed_spa_001',
        transactionDate: new Date('2024-12-15'),
        userId: users[4].id,
      },
    }),

    // 3. Corporate Tour Payment - Multiple Guests
    prisma.payment.create({
      data: {
        // Premium tequila tour
        amount: 10800.0,

        currency: 'MXN',

        description: 'Pago Experiencia Tequila Master Premium - 6 personas',

        metadata: {
          cardBrand: 'amex',
          cardLast4: '1234',
          corporateInvoice: true,
          invoiceNumber: 'INV-2024-003',
          receiptSent: true,
          taxId: 'RFC123456789',
        },

        paymentMethod: 'STRIPE_CARD',
        // Carlos Alberto
        reservationId: reservations[2].id,
        status: PaymentStatus.COMPLETED,
        stripePaymentId: 'pi_completed_tour_001',
        transactionDate: new Date('2024-12-16'),
        userId: users[5].id,
      },
    }),

    // 4. Fine Dining Experience Payment
    prisma.payment.create({
      data: {
        // Restaurant fine dining
        amount: 2400.0,

        currency: 'MXN',

        description: 'Pago Menú Degustación 7 Tiempos - 2 personas',

        metadata: {
          cardBrand: 'visa',
          cardLast4: '9999',
          invoiceNumber: 'INV-2024-004',
          receiptSent: true,
          specialOccasion: 'Anniversary dinner',
          winepairing: true,
        },

        paymentMethod: 'STRIPE_CARD',
        // Ana Patricia
        reservationId: reservations[3].id,
        status: PaymentStatus.COMPLETED,
        stripePaymentId: 'pi_completed_dining_001',
        transactionDate: new Date('2024-12-09'),
        userId: users[6].id,
      },
    }),

    // 5. Corporate Meeting Space Payment
    prisma.payment.create({
      data: {
        // Corporate meeting
        amount: 3500.0,

        currency: 'MXN',

        description: 'Pago Sala de Juntas Ejecutiva',

        metadata: {
          cardBrand: 'visa',
          cardLast4: '8888',
          corporateAccount: true,
          invoiceNumber: 'INV-2024-005',
          receiptSent: true,
          taxDeductible: true,
        },

        paymentMethod: 'STRIPE_CARD',
        // Gerente
        reservationId: reservations[4].id,
        status: PaymentStatus.COMPLETED,
        stripePaymentId: 'pi_completed_corporate_001',
        transactionDate: new Date('2024-12-14'),
        userId: users[1].id,
      },
    }),

    // REFUNDED PAYMENTS - Cancellations

    // 6. Refunded Service Cancellation
    prisma.payment.create({
      data: {
        // Cancelled service reservation
        amount: 6400.0,

        currency: 'MXN',

        description: 'Reembolso Suite Ejecutiva Histórica - Cancelación por emergencia',

        metadata: {
          cardBrand: 'mastercard',
          cardLast4: '7777',
          originalInvoiceNumber: 'INV-2024-006',
          refundAmount: 6400.0,
          refundDate: new Date('2024-12-20'),
          refundReason: 'Family emergency',
        },

        paymentMethod: 'STRIPE_CARD',
        // Roberto García
        reservationId: reservations[5].id,
        status: PaymentStatus.REFUNDED,
        stripePaymentId: 'pi_refunded_service_001',
        transactionDate: new Date('2024-12-18'),
        userId: users[7].id,
      },
    }),

    // 7. Partial Refund - No Show with Policy
    prisma.payment.create({
      data: {
        // No show spa appointment
        amount: 980.0,

        currency: 'MXN',

        description: 'Pago cancelado - No show Masaje Sueco',

        metadata: {
          cardBrand: 'visa',
          cardLast4: '3333',
          noShowDate: new Date('2024-12-05'),
          noShowPenalty: true,
          originalInvoiceNumber: 'INV-2024-007',
          penaltyAmount: 980.0,
        },

        paymentMethod: 'STRIPE_CARD',
        // Lucía Fernanda
        reservationId: reservations[6].id,
        status: PaymentStatus.CANCELLED,
        stripePaymentId: 'pi_cancelled_noshow_001',
        transactionDate: new Date('2024-12-04'),
        userId: users[8].id,
      },
    }),

    // 8. Weather Cancellation - Full Refund
    prisma.payment.create({
      data: {
        // Cancelled tour - weather
        amount: 1680.0,

        currency: 'MXN',

        description: 'Reembolso Tour Nocturno - Cancelación por clima',

        metadata: {
          cardBrand: 'mastercard',
          cardLast4: '6666',
          originalInvoiceNumber: 'INV-2024-008',
          refundAmount: 1680.0,
          refundDate: new Date('2024-12-08'),
          refundReason: 'Weather cancellation by venue',
          venueInitiated: true,
        },

        paymentMethod: 'STRIPE_CARD',
        // Diego Alejandro
        reservationId: reservations[7].id,
        status: PaymentStatus.REFUNDED,
        stripePaymentId: 'pi_refunded_weather_001',
        transactionDate: new Date('2024-12-07'),
        userId: users[9].id,
      },
    }),

    // PENDING/PROCESSING PAYMENTS

    // 9. Processing Payment - Large Event
    prisma.payment.create({
      data: {
        // Pending large event
        amount: 35000.0,

        currency: 'MXN',

        description: 'Pago en proceso - Evento Cultural Teatro Histórico',

        metadata: {
          cardBrand: 'visa',
          cardLast4: '2222',
          estimatedCompletion: '2024-12-13',
          largeAmount: true,
          originalInvoiceNumber: 'INV-2024-009',
          processingReason: 'Large amount verification',
          requiresApproval: true,
        },

        paymentMethod: 'STRIPE_CARD',
        // Ana Patricia
        reservationId: reservations[8].id,
        status: PaymentStatus.PROCESSING,
        stripePaymentId: 'pi_processing_event_001',
        transactionDate: new Date('2024-12-11'),
        userId: users[6].id,
      },
    }),

    // 10. Pending Payment - Bank Processing
    prisma.payment.create({
      data: {
        // Problematic reservation
        amount: 850.0,

        currency: 'MXN',

        description: 'Pago pendiente - Cena Especial para Parejas',

        metadata: {
          cardBrand: 'visa',
          cardLast4: '1111',
          lastRetry: new Date('2024-12-13'),
          originalInvoiceNumber: 'INV-2024-010',
          pendingReason: 'Bank verification required',
          retryAttempts: 2,
        },

        paymentMethod: 'STRIPE_CARD',
        // Roberto García
        reservationId: reservations[9].id,
        status: PaymentStatus.PENDING,
        stripePaymentId: 'pi_pending_dinner_001',
        transactionDate: new Date('2024-12-13'),
        userId: users[7].id,
      },
    }),

    // FAILED PAYMENTS

    // 11. Failed Payment - Insufficient Funds
    prisma.payment.create({
      data: {
        // Multi-service experience
        amount: 13500.0,

        currency: 'MXN',

        description: 'Pago fallido - Suite Presidencial Colonial - Estancia navideña',

        metadata: {
          cardBrand: 'visa',
          cardLast4: '0000',
          failureCode: 'insufficient_funds',
          failureReason: 'Insufficient funds',
          originalInvoiceNumber: 'INV-2024-011',
          retryAllowed: true,
          retryAttempts: 0,
        },

        paymentMethod: 'STRIPE_CARD',
        // María Elena
        reservationId: reservations[10].id,
        status: PaymentStatus.FAILED,
        stripePaymentId: 'pi_failed_funds_001',
        transactionDate: new Date('2024-12-21'),
        userId: users[4].id,
      },
    }),

    // 12. Failed Payment - Card Declined
    prisma.payment.create({
      data: {
        // Last minute spa booking
        amount: 1500.0,

        currency: 'MXN',

        description: 'Pago fallido - Masaje Relajante Premium',

        metadata: {
          cardBrand: 'visa',
          cardLast4: '0002',
          contactBank: true,
          failureCode: 'card_declined',
          failureReason: 'Card declined by issuer',
          originalInvoiceNumber: 'INV-2024-012',
          retryAllowed: false,
        },

        paymentMethod: 'STRIPE_CARD',
        // Carlos Alberto
        reservationId: reservations[11].id,
        status: PaymentStatus.FAILED,
        stripePaymentId: 'pi_failed_declined_001',
        transactionDate: new Date('2024-12-12'),
        userId: users[5].id,
      },
    }),

    // ADDITIONAL SUCCESSFUL PAYMENTS FOR VARIETY

    // 13. Split Payment - Group Tour
    prisma.payment.create({
      data: {
        // Premium tequila tour (additional payment)
        amount: 1800.0,

        // Individual portion
        currency: 'MXN',

        description: 'Pago individual - Experiencia Tequila Master Premium',

        metadata: {
          cardBrand: 'mastercard',
          cardLast4: '4567',
          groupReservation: true,
          individualPortion: 1,
          invoiceNumber: 'INV-2024-013',
          receiptSent: true,
          splitPayment: true,
          totalGroupSize: 6,
        },

        paymentMethod: 'STRIPE_CARD',
        // Juan Carlos - paying for others
        reservationId: reservations[2].id,
        status: PaymentStatus.COMPLETED,
        stripePaymentId: 'pi_split_payment_001',
        transactionDate: new Date('2024-12-16'),
        userId: users[3].id,
      },
    }),

    // 14. Tip/Gratuity Payment
    prisma.payment.create({
      data: {
        // Fine dining (additional tip)
        amount: 480.0,

        // 20% tip
        currency: 'MXN',

        description: 'Propina - Menú Degustación 7 Tiempos',

        metadata: {
          cardBrand: 'visa',
          cardLast4: '9999',
          invoiceNumber: 'INV-2024-014',
          originalAmount: 2400.0,
          receiptSent: true,
          serviceRating: 5,
          tipPayment: true,
          tipPercentage: 20,
        },

        paymentMethod: 'STRIPE_CARD',
        // Ana Patricia
        reservationId: reservations[3].id,
        status: PaymentStatus.COMPLETED,
        stripePaymentId: 'pi_tip_payment_001',
        transactionDate: new Date('2024-12-10'),
        userId: users[6].id,
      },
    }),

    // 15. Upgrade Payment
    prisma.payment.create({
      data: {
        // Spa VIP (upgrade payment)
        amount: 500.0,

        // Upgrade fee
        currency: 'MXN',

        description: 'Upgrade a tratamiento VIP - Día de Spa',

        metadata: {
          cardBrand: 'mastercard',
          cardLast4: '5556',
          invoiceNumber: 'INV-2024-015',
          originalService: 'Standard spa package',
          receiptSent: true,
          upgradePayment: true,
          upgradeType: 'VIP amenities',
          upgradedService: 'VIP spa package',
        },

        paymentMethod: 'STRIPE_CARD',
        // María Elena
        reservationId: reservations[1].id,
        status: PaymentStatus.COMPLETED,
        stripePaymentId: 'pi_upgrade_payment_001',
        transactionDate: new Date('2024-12-19'),
        userId: users[4].id,
      },
    }),
  ]);

  console.log('💳 Created 15 comprehensive payments covering all scenarios');

  // Create comprehensive system configuration
  await prisma.systemConfig.createMany({
    data: [
      {
        key: 'site_settings',
        value: {
          address: 'Centro de Servicios Nacional',
          businessHours: '24/7 Customer Support',
          contactEmail: 'contacto@reservapp.com',
          contactPhone: '+52 33 1234 5678',
          siteDescription: 'Plataforma integral de reservas para servicios premium',
          siteName: 'ReservaApp',
          socialMedia: {
            facebook: 'https://facebook.com/reservapp',
            instagram: 'https://instagram.com/reservapp_gdl',
            twitter: 'https://twitter.com/reservapp',
          },
        },
      },
      {
        key: 'payment_settings',
        value: {
          cancellationFees: {
            accommodation: { sameDay: 100, within24h: 50, within48h: 0 },
            events: { within15days: 15, within30days: 0, within7days: 30 },
            restaurant: { sameDay: 100, within2h: 50, within4h: 0 },
            spa: { sameDay: 100, within24h: 0, within4h: 50 },
            tours: { sameDay: 50, within24h: 25, within48h: 0 },
          },

          currency: 'MXN',

          maximumAmount: 50000.0,

          // Stripe fee
          minimumAmount: 100.0,

          // IVA México
          processingFee: 3.6,

          refundPolicy: 'Refunds processed within 5-10 business days',
          taxRate: 16,
        },
      },
      {
        key: 'business_hours',
        value: {
          customerService: {
            friday: { close: '23:00', open: '08:00' },
            monday: { close: '22:00', open: '08:00' },
            saturday: { close: '23:00', open: '09:00' },
            sunday: { close: '21:00', open: '09:00' },
            thursday: { close: '22:00', open: '08:00' },
            tuesday: { close: '22:00', open: '08:00' },
            wednesday: { close: '22:00', open: '08:00' },
          },
          emergencySupport: '24/7',
        },
      },
      {
        key: 'notification_settings',
        value: {
          emailNotifications: {
            bookingConfirmation: true,
            cancellationNotice: true,
            paymentConfirmation: true,
            promotionalEmails: false,
            reminderEmails: true,
          },
          pushNotifications: {
            bookingUpdates: true,
            enabled: true,
            promotionalOffers: false,
          },
          smsNotifications: {
            bookingConfirmation: true,
            paymentConfirmation: false,
            reminderSms: true,
          },
        },
      },
      {
        key: 'service_categories',
        value: {
          accommodation: {
            averageRating: 4.5,
            description: 'Suites y alojamiento',
            icon: 'accommodation',
            name: 'Hospedaje',
          },
          dining: {
            averageRating: 4.6,
            description: 'Restaurantes y experiencias culinarias',
            icon: 'restaurant',
            name: 'Gastronomía',
          },
          entertainment: {
            averageRating: 4.6,
            description: 'Espectáculos y eventos culturales',
            icon: 'theater',
            name: 'Entretenimiento',
          },
          event_meeting: {
            averageRating: 4.4,
            description: 'Espacios para eventos corporativos',
            icon: 'event',
            name: 'Eventos y Reuniones',
          },
          spa_wellness: {
            averageRating: 4.7,
            description: 'Tratamientos de spa y relajación',
            icon: 'spa',
            name: 'Spa y Bienestar',
          },
          tour_experience: {
            averageRating: 4.8,
            description: 'Tours culturales y gastronómicos',
            icon: 'tour',
            name: 'Tours y Experiencias',
          },
        },
      },
      {
        key: 'pricing_rules',
        value: {
          discounts: {
            earlyBird: { days: 30, discount: 0.15 },
            groupDiscount: { discount: 0.1, minPeople: 6 },
            loyalCustomer: { discount: 0.12, minBookings: 5 },
          },
          seasonalMultipliers: {
            highSeason: { months: [12, 1, 7, 8], multiplier: 1.3 },
            regularSeason: { months: [2, 3, 4, 5, 6, 9, 10, 11], multiplier: 1.0 },
          },
          specialDates: {
            christmas: { date: '2024-12-25', multiplier: 1.5 },
            motherDay: { date: '2024-05-10', multiplier: 1.2 },
            newYear: { date: '2024-12-31', multiplier: 1.8 },
            valentine: { date: '2024-02-14', multiplier: 1.2 },
          },
        },
      },
      {
        key: 'quality_metrics',
        value: {
          averageRatings: {
            accommodation: 4.5,
            dining: 4.7,
            entertainment: 4.7,
            events: 4.4,
            overall: 4.6,
            spa: 4.8,
            tours: 4.6,
          },
          repeatCustomerRate: 78.2,
          responseTime: {
            bookingConfirmation: '5 minutes',
            emailQueries: '2 hours',
            phoneSupport: '30 seconds',
          },
          satisfactionRate: 94.5,
        },
      },
    ],
  });

  console.log('⚙️ Created comprehensive system configuration');
  console.log('🎉 Comprehensive database seeding completed successfully!');

  // Print detailed summary
  console.log('\n📊 COMPREHENSIVE SEEDING SUMMARY:');
  console.log('=====================================');
  console.log(`👥 Users: ${users.length} (Admin: 3, Customers: 7)`);
  console.log(`🏢 Venues: 10 diverse locations across various cities`);
  console.log(`   - Accommodation Venues: 2 (Casa Salazar, Morales)`);
  console.log(`   - Restaurants: 2 (Santo Domingo, Hueso)`);
  console.log(`   - Spas: 2 (Vitania, Grand Fiesta)`);
  console.log(`   - Tours: 2 (Cultural, Tequila)`);
  console.log(`   - Events: 2 (Expo, Teatro Degollado)`);
  console.log(`🎯 Services: 35+ with realistic MXN pricing`);
  console.log(`   - Accommodation: $1,200 - $4,500 MXN/night`);
  console.log(`   - Dining: $0 - $1,200 MXN/person`);
  console.log(`   - Spa: $950 - $3,500 MXN/treatment`);
  console.log(`   - Tours: $350 - $1,800 MXN/person`);
  console.log(`   - Events: $3,500 - $35,000 MXN/event`);
  console.log(`📅 Reservations: ${reservations.length} covering all scenarios`);
  console.log(`   - ✅ Happy Path: 7 (confirmed, completed, checked-in)`);
  console.log(`   - ❌ Sad Path: 5 (cancelled, no-show, pending issues)`);
  console.log(`💳 Payments: ${payments.length} comprehensive payment scenarios`);
  console.log(`   - ✅ Completed: 9 ($85,330 MXN total)`);
  console.log(`   - 🔄 Refunded: 2 ($8,080 MXN refunded)`);
  console.log(`   - ⏳ Processing: 2 ($35,850 MXN processing)`);
  console.log(`   - ❌ Failed: 2 ($15,000 MXN failed)`);
  console.log(`   - 🎯 Special: 2 (tips, upgrades)`);
  console.log(`⚙️ System Configuration: 7 comprehensive settings`);
  console.log(`\n🌮 GUADALAJARA FOCUS:`);
  console.log(`   - Real venues with GPS coordinates`);
  console.log(`   - Authentic Mexican pricing in MXN`);
  console.log(`   - Local business scenarios`);
  console.log(`   - Cultural context and preferences`);

  console.log(`\n🎯 BUSINESS SCENARIOS COVERED:`);
  console.log(`   ✅ Successful bookings and payments`);
  console.log(`   ❌ Cancellations (customer & venue initiated)`);
  console.log(`   ⚠️  No-shows with penalties`);
  console.log(`   🔄 Refunds and processing delays`);
  console.log(`   💳 Payment failures and retries`);
  console.log(`   🎉 Special occasions and celebrations`);
  console.log(`   🏢 Corporate events and group bookings`);
  console.log(`   ⭐ Premium services and upgrades`);
  console.log(`   📊 Quality metrics and ratings`);
}

main()
  .catch((e) => {
    console.error('❌ Error during comprehensive seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
