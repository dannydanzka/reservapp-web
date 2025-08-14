import bcrypt from 'bcryptjs';

import {
  ContactFormStatus,
  NotificationType,
  PaymentStatus,
  PrismaClient,
  ReceiptStatus,
  ReceiptType,
  ReservationStatus,
  ServiceType,
  UserRoleEnum,
  VenueType,
  BusinessType,
  AccountType,
  DepositStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to generate random date within the last 6 months
function getRandomDateInLast6Months(): Date {
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  const randomTime = sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime());
  return new Date(randomTime);
}

// Helper function to generate dates with business growth pattern
function getBusinessGrowthDate(monthsAgo: number, growthFactor: number = 1): Date {
  const now = new Date();
  const targetMonth = new Date();
  targetMonth.setMonth(now.getMonth() - monthsAgo);
  
  // Add some randomization within the month
  let daysInMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate();
  
  // For current month (August), only use days up to 14
  if (monthsAgo === 0) {
    daysInMonth = Math.min(14, daysInMonth);
  }
  
  const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
  targetMonth.setDate(randomDay);
  targetMonth.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  
  return targetMonth;
}

// Helper function to get random amount based on service type and month
function getRealisticAmount(serviceType: ServiceType, monthsAgo: number): number {
  let baseAmount = 1000;
  
  switch (serviceType) {
    case ServiceType.ACCOMMODATION:
      baseAmount = 1200 + Math.random() * 2800; // $1,200 - $4,000
      break;
    case ServiceType.DINING:
      baseAmount = 300 + Math.random() * 700; // $300 - $1,000
      break;
    case ServiceType.SPA_WELLNESS:
      baseAmount = 500 + Math.random() * 1500; // $500 - $2,000
      break;
    case ServiceType.TOUR_EXPERIENCE:
      baseAmount = 800 + Math.random() * 1200; // $800 - $2,000
      break;
    case ServiceType.EVENT_MEETING:
      baseAmount = 2000 + Math.random() * 8000; // $2,000 - $10,000
      break;
    case ServiceType.ENTERTAINMENT:
      baseAmount = 400 + Math.random() * 600; // $400 - $1,000
      break;
  }
  
  // Seasonal variations - higher prices in recent months (growth)
  let seasonalMultiplier;
  
  if (monthsAgo === 0) {
    // August - continuation of peak season
    seasonalMultiplier = 1.35; // 35% increase
  } else if (monthsAgo === 1) {
    // July - peak season with highest prices
    seasonalMultiplier = 1.40; // 40% increase (highest)
  } else {
    // Feb to June - gradual growth
    seasonalMultiplier = 1 + (6 - monthsAgo) * 0.05; // 5% growth per month
  }
  
  return Math.round(baseAmount * seasonalMultiplier);
}

async function main() {
  console.log('🌱 Starting comprehensive 6-month historical database seeding...');

  // Clear existing data (order matters due to foreign key constraints)
  await prisma.contactForm.deleteMany();
  await prisma.receipt.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.paymentHistory.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.service.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.bankAccount.deleteMany();
  await prisma.businessAccount.deleteMany();
  await prisma.user.deleteMany();
  await prisma.systemConfig.deleteMany();

  console.log('🧹 Cleared existing data');

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash('password123', 12);

  console.log('👥 Creating users with roles...');

  // 1. SUPER ADMIN
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@reservapp.com',
      firstName: 'Sistema',
      lastName: 'Administrador',
      password: hashedPassword,
      phone: '+52 33 1111 1111',
      role: UserRoleEnum.SUPER_ADMIN,
      stripeCustomerId: 'cus_admin123',
      createdAt: getBusinessGrowthDate(6),
    },
  });

  // 2. DEMO ADMIN
  const demoAdmin = await prisma.user.create({
    data: {
      email: 'demo@reservapp.com',
      firstName: 'Demo',
      lastName: 'Administrator',
      password: hashedPassword,
      phone: '+52 33 9999 9999',
      role: UserRoleEnum.ADMIN,
      stripeCustomerId: 'cus_demo123',
      createdAt: getBusinessGrowthDate(5),
    },
  });

  // 3. DEMO USER
  const demoUser = await prisma.user.create({
    data: {
      email: 'user@reservapp.com',
      firstName: 'Demo',
      lastName: 'Usuario',
      password: hashedPassword,
      phone: '+52 33 8888 8888',
      role: UserRoleEnum.USER,
      stripeCustomerId: 'cus_user123',
      createdAt: getBusinessGrowthDate(4),
    },
  });

  // 4-8. 5 BUSINESS ADMINS (Hotel/Restaurant Owners)
  const businessOwners = await Promise.all([
    // Business 1: Luxury Hotel Chain
    prisma.user.create({
      data: {
        email: 'admin.luxury@reservapp.com',
        firstName: 'Roberto',
        lastName: 'Salazar',
        password: hashedPassword,
        phone: '+52 33 2222 3333',
        role: UserRoleEnum.ADMIN,
        stripeCustomerId: 'cus_luxury123',
        createdAt: getBusinessGrowthDate(6),
      },
    }),
    // Business 2: Restaurant Group
    prisma.user.create({
      data: {
        email: 'admin.dining@reservapp.com',
        firstName: 'Patricia',
        lastName: 'Morales',
        password: hashedPassword,
        phone: '+52 33 4444 5555',
        role: UserRoleEnum.ADMIN,
        stripeCustomerId: 'cus_dining123',
        createdAt: getBusinessGrowthDate(5),
      },
    }),
    // Business 3: Wellness & Spa
    prisma.user.create({
      data: {
        email: 'admin.wellness@reservapp.com',
        firstName: 'Carlos',
        lastName: 'Mendoza',
        password: hashedPassword,
        phone: '+52 33 6666 7777',
        role: UserRoleEnum.ADMIN,
        stripeCustomerId: 'cus_wellness123',
        createdAt: getBusinessGrowthDate(4),
      },
    }),
    // Business 4: Event & Entertainment
    prisma.user.create({
      data: {
        email: 'admin.events@reservapp.com',
        firstName: 'Ana',
        lastName: 'García',
        password: hashedPassword,
        phone: '+52 33 8888 9999',
        role: UserRoleEnum.ADMIN,
        stripeCustomerId: 'cus_events123',
        createdAt: getBusinessGrowthDate(3),
      },
    }),
    // Business 5: Tourism & Tours
    prisma.user.create({
      data: {
        email: 'admin.tours@reservapp.com',
        firstName: 'Miguel',
        lastName: 'Rivera',
        password: hashedPassword,
        phone: '+52 33 1010 1111',
        role: UserRoleEnum.ADMIN,
        stripeCustomerId: 'cus_tours123',
        createdAt: getBusinessGrowthDate(2),
      },
    }),
  ]);

  // 9-20. Regular users distributed across different months (12 users)
  const regularUsers = await Promise.all([
    // Month 6 users (early adopters)
    prisma.user.create({
      data: {
        email: 'juan.perez@gmail.com',
        firstName: 'Juan Carlos',
        lastName: 'Pérez',
        password: hashedPassword,
        phone: '+52 33 1234 5678',
        role: UserRoleEnum.USER,
        stripeCustomerId: 'cus_juan123',
        createdAt: getBusinessGrowthDate(6),
      },
    }),
    prisma.user.create({
      data: {
        email: 'maria.lopez@gmail.com',
        firstName: 'María Elena',
        lastName: 'López',
        password: hashedPassword,
        phone: '+52 33 2345 6789',
        role: UserRoleEnum.USER,
        stripeCustomerId: 'cus_maria123',
        createdAt: getBusinessGrowthDate(6),
      },
    }),
    // Month 5 users
    prisma.user.create({
      data: {
        email: 'carlos.rodriguez@hotmail.com',
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        password: hashedPassword,
        phone: '+52 33 3456 7890',
        role: UserRoleEnum.USER,
        stripeCustomerId: 'cus_carlos123',
        createdAt: getBusinessGrowthDate(5),
      },
    }),
    prisma.user.create({
      data: {
        email: 'lucia.martinez@yahoo.com',
        firstName: 'Lucía',
        lastName: 'Martínez',
        password: hashedPassword,
        phone: '+52 33 4567 8901',
        role: UserRoleEnum.USER,
        stripeCustomerId: 'cus_lucia123',
        createdAt: getBusinessGrowthDate(5),
      },
    }),
    // Month 4 users
    prisma.user.create({
      data: {
        email: 'diego.hernandez@gmail.com',
        firstName: 'Diego',
        lastName: 'Hernández',
        password: hashedPassword,
        phone: '+52 33 5678 9012',
        role: UserRoleEnum.USER,
        stripeCustomerId: 'cus_diego123',
        createdAt: getBusinessGrowthDate(4),
      },
    }),
    prisma.user.create({
      data: {
        email: 'sofia.gonzalez@outlook.com',
        firstName: 'Sofía',
        lastName: 'González',
        password: hashedPassword,
        phone: '+52 33 6789 0123',
        role: UserRoleEnum.USER,
        stripeCustomerId: 'cus_sofia123',
        createdAt: getBusinessGrowthDate(4),
      },
    }),
    // Month 3 users (growth phase)
    prisma.user.create({
      data: {
        email: 'fernando.torres@gmail.com',
        firstName: 'Fernando',
        lastName: 'Torres',
        password: hashedPassword,
        phone: '+52 33 7890 1234',
        role: UserRoleEnum.USER,
        stripeCustomerId: 'cus_fernando123',
        createdAt: getBusinessGrowthDate(3),
      },
    }),
    prisma.user.create({
      data: {
        email: 'valentina.ruiz@hotmail.com',
        firstName: 'Valentina',
        lastName: 'Ruiz',
        password: hashedPassword,
        phone: '+52 33 8901 2345',
        role: UserRoleEnum.USER,
        stripeCustomerId: 'cus_valentina123',
        createdAt: getBusinessGrowthDate(3),
      },
    }),
    // Month 2 users (acceleration)
    prisma.user.create({
      data: {
        email: 'sebastian.vargas@gmail.com',
        firstName: 'Sebastián',
        lastName: 'Vargas',
        password: hashedPassword,
        phone: '+52 33 9012 3456',
        role: UserRoleEnum.USER,
        stripeCustomerId: 'cus_sebastian123',
        createdAt: getBusinessGrowthDate(2),
      },
    }),
    prisma.user.create({
      data: {
        email: 'isabella.castro@yahoo.com',
        firstName: 'Isabella',
        lastName: 'Castro',
        password: hashedPassword,
        phone: '+52 33 0123 4567',
        role: UserRoleEnum.USER,
        stripeCustomerId: 'cus_isabella123',
        createdAt: getBusinessGrowthDate(2),
      },
    }),
    // Month 1 users (recent growth)
    prisma.user.create({
      data: {
        email: 'alejandro.moreno@gmail.com',
        firstName: 'Alejandro',
        lastName: 'Moreno',
        password: hashedPassword,
        phone: '+52 33 1357 2468',
        role: UserRoleEnum.USER,
        stripeCustomerId: 'cus_alejandro123',
        createdAt: getBusinessGrowthDate(1),
      },
    }),
    prisma.user.create({
      data: {
        email: 'camila.jimenez@outlook.com',
        firstName: 'Camila',
        lastName: 'Jiménez',
        password: hashedPassword,
        phone: '+52 33 2468 1357',
        role: UserRoleEnum.USER,
        stripeCustomerId: 'cus_camila123',
        createdAt: getBusinessGrowthDate(1),
      },
    }),
  ]);

  console.log(`✅ Created 20 users total: 1 super admin, 1 demo admin, 1 demo user, 5 business owners, 12 regular users`);

  console.log('🏢 Creating business accounts for business owners...');

  const businessAccounts = await Promise.all([
    // Business 1: Luxury Hotel Chain
    prisma.businessAccount.create({
      data: {
        businessName: 'Casa Salazar Luxury Hotels',
        businessType: BusinessType.HOTEL,
        taxId: 'CSL950315ABC',
        legalName: 'Casa Salazar Hotelería S.A. de C.V.',
        contactEmail: 'info@casasalazar.com',
        contactPhone: '+52 33 2222 3333',
        website: 'https://casasalazar.com',
        description: 'Cadena de hoteles boutique de lujo en el occidente de México, especializada en experiencias únicas y servicios de alta calidad.',
        address: 'Av. Juárez 170',
        city: 'Guadalajara',
        state: 'Jalisco',
        country: 'México',
        zipCode: '44100',
        isVerified: true,
        verificationDate: getBusinessGrowthDate(6),
        ownerId: businessOwners[0].id,
        createdAt: getBusinessGrowthDate(6),
      },
    }),
    // Business 2: Restaurant Group
    prisma.businessAccount.create({
      data: {
        businessName: 'Grupo Gastronómico Morales',
        businessType: BusinessType.RESTAURANT,
        taxId: 'GGM880422DEF',
        legalName: 'Morales Restaurantes S.A. de C.V.',
        contactEmail: 'contacto@grupomorales.mx',
        contactPhone: '+52 33 4444 5555',
        website: 'https://grupomorales.mx',
        description: 'Grupo restaurantero especializado en cocina mexicana contemporánea y experiencias gastronómicas únicas.',
        address: 'Av. Américas 1500',
        city: 'Guadalajara',
        state: 'Jalisco',
        country: 'México',
        zipCode: '44630',
        isVerified: true,
        verificationDate: getBusinessGrowthDate(5),
        ownerId: businessOwners[1].id,
        createdAt: getBusinessGrowthDate(5),
      },
    }),
    // Business 3: Wellness & Spa
    prisma.businessAccount.create({
      data: {
        businessName: 'Zentro Wellness & Spa',
        businessType: BusinessType.SPA,
        taxId: 'ZWS770618GHI',
        legalName: 'Zentro Bienestar Integral S.A. de C.V.',
        contactEmail: 'reservas@zentrowellness.com',
        contactPhone: '+52 33 6666 7777',
        website: 'https://zentrowellness.com',
        description: 'Centro de bienestar integral con spa, tratamientos holísticos y experiencias de relajación.',
        address: 'Av. Patria 888',
        city: 'Zapopan',
        state: 'Jalisco',
        country: 'México',
        zipCode: '45040',
        isVerified: true,
        verificationDate: getBusinessGrowthDate(4),
        ownerId: businessOwners[2].id,
        createdAt: getBusinessGrowthDate(4),
      },
    }),
    // Business 4: Event & Entertainment
    prisma.businessAccount.create({
      data: {
        businessName: 'García Events & Entertainment',
        businessType: BusinessType.EVENT_CENTER,
        taxId: 'GEE850920JKL',
        legalName: 'García Eventos y Entretenimiento S.A. de C.V.',
        contactEmail: 'eventos@garciaevents.mx',
        contactPhone: '+52 33 8888 9999',
        website: 'https://garciaevents.mx',
        description: 'Organización de eventos corporativos y sociales con espacios únicos y entretenimiento premium.',
        address: 'Av. López Mateos Norte 755',
        city: 'Guadalajara',
        state: 'Jalisco',
        country: 'México',
        zipCode: '44170',
        isVerified: true,
        verificationDate: getBusinessGrowthDate(3),
        ownerId: businessOwners[3].id,
        createdAt: getBusinessGrowthDate(3),
      },
    }),
    // Business 5: Tourism & Tours
    prisma.businessAccount.create({
      data: {
        businessName: 'Rivera Tours & Experiences',
        businessType: BusinessType.TOUR_AGENCY,
        taxId: 'RTE920714MNO',
        legalName: 'Rivera Turismo y Experiencias S.A. de C.V.',
        contactEmail: 'tours@riveraexperiences.com',
        contactPhone: '+52 33 1010 1111',
        website: 'https://riveraexperiences.com',
        description: 'Agencia especializada en tours culturales, gastronómicos y de aventura por el occidente de México.',
        address: 'Av. Chapultepec Norte 134',
        city: 'Guadalajara',
        state: 'Jalisco',
        country: 'México',
        zipCode: '44600',
        isVerified: true,
        verificationDate: getBusinessGrowthDate(2),
        ownerId: businessOwners[4].id,
        createdAt: getBusinessGrowthDate(2),
      },
    }),
  ]);

  console.log('✅ Created 5 business accounts with different business types');

  console.log('🏦 Creating bank accounts for businesses...');

  const bankAccounts = [];
  for (const businessAccount of businessAccounts) {
    const bankAccount = await prisma.bankAccount.create({
      data: {
        bankName: 'Banco Santander México',
        accountNumber: `****${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        accountType: AccountType.BUSINESS_CHECKING,
        accountHolder: businessAccount.businessName,
        routingNumber: '014180012',
        isVerified: true,
        verificationDate: businessAccount.createdAt,
        isActive: true,
        isPrimary: true,
        businessAccountId: businessAccount.id,
        createdAt: businessAccount.createdAt,
      },
    });
    bankAccounts.push(bankAccount);
  }

  console.log('✅ Created bank accounts for all businesses');

  console.log('🏢 Creating 15 venues across all businesses...');

  // Business 1 venues (Luxury Hotels) - 4 venues
  const luxuryVenues = await Promise.all([
    prisma.venue.create({
      data: {
        name: 'Casa Salazar Centro Histórico',
        description: 'Hotel boutique de lujo en el corazón del centro histórico de Guadalajara, en un edificio colonial restaurado.',
        category: VenueType.ACCOMMODATION,
        address: 'Av. Juárez 170, Zona Centro',
        city: 'Guadalajara',
        state: 'Jalisco',
        country: 'México',
        zipCode: '44100',
        phone: '+52 33 3658 7777',
        email: 'centro@casasalazar.com',
        website: 'https://casasalazar.com/centro',
        latitude: 20.676109,
        longitude: -103.347730,
        rating: 4.8,
        checkInTime: '15:00',
        checkOutTime: '12:00',
        ownerId: businessOwners[0].id,
        createdAt: getBusinessGrowthDate(6),
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Casa Salazar Chapultepec',
        description: 'Elegante hotel en la zona más exclusiva de Guadalajara, con vistas panorámicas y amenidades premium.',
        category: VenueType.ACCOMMODATION,
        address: 'Av. Chapultepec Norte 310',
        city: 'Guadalajara',
        state: 'Jalisco',
        country: 'México',
        zipCode: '44600',
        phone: '+52 33 3647 8888',
        email: 'chapultepec@casasalazar.com',
        website: 'https://casasalazar.com/chapultepec',
        latitude: 20.681389,
        longitude: -103.364167,
        rating: 4.9,
        checkInTime: '15:00',
        checkOutTime: '12:00',
        ownerId: businessOwners[0].id,
        createdAt: getBusinessGrowthDate(5),
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Casa Salazar Providencia',
        description: 'Resort urbano con spa completo y espacios para eventos en la zona Providencia.',
        category: VenueType.ACCOMMODATION,
        address: 'Av. Providencia 1790',
        city: 'Guadalajara',
        state: 'Jalisco',
        country: 'México',
        zipCode: '44630',
        phone: '+52 33 3640 9999',
        email: 'providencia@casasalazar.com',
        website: 'https://casasalazar.com/providencia',
        latitude: 20.692778,
        longitude: -103.366389,
        rating: 4.7,
        checkInTime: '15:00',
        checkOutTime: '12:00',
        ownerId: businessOwners[0].id,
        createdAt: getBusinessGrowthDate(4),
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Casa Salazar Tlaquepaque',
        description: 'Hacienda boutique en el pueblo mágico de Tlaquepaque, perfecta para escapadas románticas.',
        category: VenueType.ACCOMMODATION,
        address: 'Calle Independencia 227',
        city: 'Tlaquepaque',
        state: 'Jalisco',
        country: 'México',
        zipCode: '45500',
        phone: '+52 33 3635 1010',
        email: 'tlaquepaque@casasalazar.com',
        website: 'https://casasalazar.com/tlaquepaque',
        latitude: 20.641111,
        longitude: -103.315556,
        rating: 4.6,
        checkInTime: '15:00',
        checkOutTime: '12:00',
        ownerId: businessOwners[0].id,
        createdAt: getBusinessGrowthDate(3),
      },
    }),
  ]);

  // Business 2 venues (Restaurants) - 3 venues
  const restaurantVenues = await Promise.all([
    prisma.venue.create({
      data: {
        name: 'Morales Cocina Mexicana',
        description: 'Restaurante insignia del grupo, especializado en cocina mexicana contemporánea con ingredientes locales.',
        category: VenueType.RESTAURANT,
        address: 'Av. Américas 1500, Col. Providencia',
        city: 'Guadalajara',
        state: 'Jalisco',
        country: 'México',
        zipCode: '44630',
        phone: '+52 33 3817 2020',
        email: 'reservas@moralescocina.mx',
        website: 'https://moralescocina.mx',
        latitude: 20.692500,
        longitude: -103.378611,
        rating: 4.5,
        ownerId: businessOwners[1].id,
        createdAt: getBusinessGrowthDate(5),
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Morales Rooftop',
        description: 'Restaurante con terraza al aire libre y vista panorámica de la ciudad, perfecto para cenas románticas.',
        category: VenueType.RESTAURANT,
        address: 'Av. López Mateos Sur 2375',
        city: 'Guadalajara',
        state: 'Jalisco',
        country: 'México',
        zipCode: '44550',
        phone: '+52 33 3647 3030',
        email: 'rooftop@grupomorales.mx',
        website: 'https://moralesrooftop.mx',
        latitude: 20.659722,
        longitude: -103.378889,
        rating: 4.7,
        ownerId: businessOwners[1].id,
        createdAt: getBusinessGrowthDate(4),
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Morales Cantina Gourmet',
        description: 'Cantina moderna con cocina gourmet mexicana y la mejor selección de tequilas y mezcales artesanales.',
        category: VenueType.RESTAURANT,
        address: 'Av. México 3300, Col. Monraz',
        city: 'Guadalajara',
        state: 'Jalisco',
        country: 'México',
        zipCode: '44670',
        phone: '+52 33 3640 4040',
        email: 'cantina@grupomorales.mx',
        website: 'https://moralescantina.mx',
        latitude: 20.700833,
        longitude: -103.381667,
        rating: 4.4,
        ownerId: businessOwners[1].id,
        createdAt: getBusinessGrowthDate(3),
      },
    }),
  ]);

  // Business 3 venues (Spa & Wellness) - 2 venues
  const spaVenues = await Promise.all([
    prisma.venue.create({
      data: {
        name: 'Zentro Wellness Spa Providencia',
        description: 'Spa de lujo con tratamientos holísticos, temazcal, y terapias especializadas en relajación profunda.',
        category: VenueType.SPA,
        address: 'Av. Patria 888, Col. Jardines del Bosque',
        city: 'Zapopan',
        state: 'Jalisco',
        country: 'México',
        zipCode: '45040',
        phone: '+52 33 3647 5050',
        email: 'providencia@zentrowellness.com',
        website: 'https://zentrowellness.com/providencia',
        latitude: 20.708611,
        longitude: -103.391111,
        rating: 4.8,
        ownerId: businessOwners[2].id,
        createdAt: getBusinessGrowthDate(4),
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Zentro Retreat Center',
        description: 'Centro de retiros y bienestar integral con yoga, meditación y terapias alternativas en ambiente natural.',
        category: VenueType.SPA,
        address: 'Carretera a Colotlán Km 12.5',
        city: 'Zapopan',
        state: 'Jalisco',
        country: 'México',
        zipCode: '45200',
        phone: '+52 33 3636 6060',
        email: 'retreat@zentrowellness.com',
        website: 'https://zentrowellness.com/retreat',
        latitude: 20.756944,
        longitude: -103.463889,
        rating: 4.9,
        ownerId: businessOwners[2].id,
        createdAt: getBusinessGrowthDate(2),
      },
    }),
  ]);

  // Business 4 venues (Events & Entertainment) - 3 venues
  const eventVenues = await Promise.all([
    prisma.venue.create({
      data: {
        name: 'García Convention Center',
        description: 'Centro de convenciones moderno con salones modulares para eventos corporativos y conferencias.',
        category: VenueType.EVENT_CENTER,
        address: 'Av. López Mateos Norte 755',
        city: 'Guadalajara',
        state: 'Jalisco',
        country: 'México',
        zipCode: '44170',
        phone: '+52 33 3669 7070',
        email: 'convenciones@garciaevents.mx',
        website: 'https://garciaevents.mx/convention',
        latitude: 20.698056,
        longitude: -103.356944,
        rating: 4.3,
        ownerId: businessOwners[3].id,
        createdAt: getBusinessGrowthDate(3),
      },
    }),
    prisma.venue.create({
      data: {
        name: 'García Salón de Eventos',
        description: 'Elegante salón para bodas y eventos sociales con capacidad para 500 personas y servicios integrales.',
        category: VenueType.EVENT_CENTER,
        address: 'Av. Américas 1633, Col. Providencia',
        city: 'Guadalajara',
        state: 'Jalisco',
        country: 'México',
        zipCode: '44630',
        phone: '+52 33 3817 8080',
        email: 'eventos@garciaevents.mx',
        website: 'https://garciaevents.mx/salon',
        latitude: 20.693333,
        longitude: -103.379167,
        rating: 4.6,
        ownerId: businessOwners[3].id,
        createdAt: getBusinessGrowthDate(2),
      },
    }),
    prisma.venue.create({
      data: {
        name: 'García Entertainment Complex',
        description: 'Complejo de entretenimiento con boliche, karaoke, bar deportivo y área de juegos para eventos corporativos.',
        category: VenueType.ENTERTAINMENT,
        address: 'Av. Patria 1891, Col. Puerta de Hierro',
        city: 'Zapopan',
        state: 'Jalisco',
        country: 'México',
        zipCode: '45116',
        phone: '+52 33 3640 9090',
        email: 'entertainment@garciaevents.mx',
        website: 'https://garciaevents.mx/entertainment',
        latitude: 20.709722,
        longitude: -103.423056,
        rating: 4.2,
        ownerId: businessOwners[3].id,
        createdAt: getBusinessGrowthDate(1),
      },
    }),
  ]);

  // Business 5 venues (Tours & Experiences) - 3 venues
  const tourVenues = await Promise.all([
    prisma.venue.create({
      data: {
        name: 'Rivera Cultural Tours Hub',
        description: 'Centro de tours culturales por Guadalajara y pueblos mágicos de Jalisco con guías certificados.',
        category: VenueType.TOUR_OPERATOR,
        address: 'Av. Chapultepec Norte 134',
        city: 'Guadalajara',
        state: 'Jalisco',
        country: 'México',
        zipCode: '44600',
        phone: '+52 33 3625 1010',
        email: 'cultural@riveraexperiences.com',
        website: 'https://riveraexperiences.com/cultural',
        latitude: 20.681944,
        longitude: -103.363611,
        rating: 4.5,
        ownerId: businessOwners[4].id,
        createdAt: getBusinessGrowthDate(2),
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Rivera Adventure Center',
        description: 'Centro de tours de aventura y ecoturismo en la Sierra de Jalisco con actividades extremas.',
        category: VenueType.TOUR_OPERATOR,
        address: 'Carretera a Tapalpa Km 35',
        city: 'Tapalpa',
        state: 'Jalisco',
        country: 'México',
        zipCode: '49340',
        phone: '+52 343 432 1111',
        email: 'adventure@riveraexperiences.com',
        website: 'https://riveraexperiences.com/adventure',
        latitude: 19.951944,
        longitude: -103.769167,
        rating: 4.7,
        ownerId: businessOwners[4].id,
        createdAt: getBusinessGrowthDate(1),
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Rivera Gastronomy Tours',
        description: 'Tours gastronómicos especializados en mercados tradicionales, destilerías de tequila y restaurantes locales.',
        category: VenueType.TOUR_OPERATOR,
        address: 'Mercado San Juan de Dios, Local 45',
        city: 'Guadalajara',
        state: 'Jalisco',
        country: 'México',
        zipCode: '44100',
        phone: '+52 33 3614 2020',
        email: 'gastronomy@riveraexperiences.com',
        website: 'https://riveraexperiences.com/gastronomy',
        latitude: 20.675833,
        longitude: -103.342500,
        rating: 4.6,
        ownerId: businessOwners[4].id,
        createdAt: getBusinessGrowthDate(1),
      },
    }),
  ]);

  const allVenues = [...luxuryVenues, ...restaurantVenues, ...spaVenues, ...eventVenues, ...tourVenues];
  console.log(`✅ Created 15 venues across 5 businesses`);

  console.log('🎯 Creating services for each venue with realistic pricing...');

  const allServices = [];

  // Luxury Hotel Services
  for (const venue of luxuryVenues) {
    const hotelServices = await Promise.all([
      // Accommodation services
      prisma.service.create({
        data: {
          name: 'Suite Ejecutiva',
          description: 'Suite ejecutiva con vista a la ciudad, sala de estar, área de trabajo y amenidades premium.',
          category: ServiceType.ACCOMMODATION,
          subcategory: 'Suite Premium',
          price: 3500,
          currency: 'MXN',
          duration: 1440, // 24 hours
          capacity: 2,
          venueId: venue.id,
          isActive: true,
          createdAt: venue.createdAt,
        },
      }),
      prisma.service.create({
        data: {
          name: 'Habitación Estándar',
          description: 'Habitación elegante con todas las comodidades, cama king size y baño de mármol.',
          category: ServiceType.ACCOMMODATION,
          subcategory: 'Habitación Standard',
          price: 2200,
          currency: 'MXN',
          duration: 1440,
          capacity: 2,
          venueId: venue.id,
          isActive: true,
          createdAt: venue.createdAt,
        },
      }),
      prisma.service.create({
        data: {
          name: 'Spa & Wellness Package',
          description: 'Paquete completo de spa con masaje relajante, facial y acceso a instalaciones.',
          category: ServiceType.SPA_WELLNESS,
          subcategory: 'Paquete Spa',
          price: 1800,
          currency: 'MXN',
          duration: 240,
          capacity: 1,
          venueId: venue.id,
          isActive: true,
          createdAt: venue.createdAt,
        },
      }),
    ]);
    allServices.push(...hotelServices);
  }

  // Restaurant Services
  for (const venue of restaurantVenues) {
    const restaurantServices = await Promise.all([
      prisma.service.create({
        data: {
          name: 'Cena Degustación',
          description: 'Menú degustación de 7 tiempos con maridaje de vinos mexicanos y cocina contemporánea.',
          category: ServiceType.DINING,
          subcategory: 'Menú Degustación',
          price: 1200,
          currency: 'MXN',
          duration: 180,
          capacity: 2,
          venueId: venue.id,
          isActive: true,
          createdAt: venue.createdAt,
        },
      }),
      prisma.service.create({
        data: {
          name: 'Mesa Privada',
          description: 'Reservación de mesa privada para grupos hasta 8 personas con servicio personalizado.',
          category: ServiceType.DINING,
          subcategory: 'Mesa Privada',
          price: 800,
          currency: 'MXN',
          duration: 150,
          capacity: 8,
          venueId: venue.id,
          isActive: true,
          createdAt: venue.createdAt,
        },
      }),
    ]);
    allServices.push(...restaurantServices);
  }

  // Spa Services
  for (const venue of spaVenues) {
    const spaServices = await Promise.all([
      prisma.service.create({
        data: {
          name: 'Temazcal Ceremonial',
          description: 'Experiencia de temazcal tradicional con ceremonia ancestral y guía espiritual.',
          category: ServiceType.SPA_WELLNESS,
          subcategory: 'Temazcal',
          price: 950,
          currency: 'MXN',
          duration: 120,
          capacity: 8,
          venueId: venue.id,
          isActive: true,
          createdAt: venue.createdAt,
        },
      }),
      prisma.service.create({
        data: {
          name: 'Masaje de Piedras Calientes',
          description: 'Masaje relajante con piedras volcánicas calientes y aceites esenciales.',
          category: ServiceType.SPA_WELLNESS,
          subcategory: 'Masaje Terapéutico',
          price: 1100,
          currency: 'MXN',
          duration: 90,
          capacity: 1,
          venueId: venue.id,
          isActive: true,
          createdAt: venue.createdAt,
        },
      }),
      prisma.service.create({
        data: {
          name: 'Retiro de Yoga y Meditación',
          description: 'Retiro de fin de semana con sesiones de yoga, meditación y alimentación consciente.',
          category: ServiceType.SPA_WELLNESS,
          subcategory: 'Retiro Wellness',
          price: 2800,
          currency: 'MXN',
          duration: 2880, // 48 hours
          capacity: 15,
          venueId: venue.id,
          isActive: true,
          createdAt: venue.createdAt,
        },
      }),
    ]);
    allServices.push(...spaServices);
  }

  // Event Services
  for (const venue of eventVenues) {
    const eventServices = await Promise.all([
      prisma.service.create({
        data: {
          name: 'Evento Corporativo Completo',
          description: 'Paquete integral para eventos corporativos con salón, catering, audiovisuales y coordinación.',
          category: ServiceType.EVENT_MEETING,
          subcategory: 'Evento Corporativo',
          price: 15000,
          currency: 'MXN',
          duration: 480,
          capacity: 200,
          venueId: venue.id,
          isActive: true,
          createdAt: venue.createdAt,
        },
      }),
      prisma.service.create({
        data: {
          name: 'Boda Premium',
          description: 'Paquete completo de boda con decoración, banquete, música en vivo y coordinación total.',
          category: ServiceType.EVENT_MEETING,
          subcategory: 'Boda',
          price: 25000,
          currency: 'MXN',
          duration: 600,
          capacity: 300,
          venueId: venue.id,
          isActive: true,
          createdAt: venue.createdAt,
        },
      }),
    ]);
    allServices.push(...eventServices);
  }

  // Tour Services
  for (const venue of tourVenues) {
    const tourServices = await Promise.all([
      prisma.service.create({
        data: {
          name: 'Tour Pueblos Mágicos',
          description: 'Tour completo por los pueblos mágicos de Jalisco con transportación, guía y comida incluida.',
          category: ServiceType.TOUR_EXPERIENCE,
          subcategory: 'Tour Cultural',
          price: 1500,
          currency: 'MXN',
          duration: 600,
          capacity: 15,
          venueId: venue.id,
          isActive: true,
          createdAt: venue.createdAt,
        },
      }),
      prisma.service.create({
        data: {
          name: 'Ruta del Tequila',
          description: 'Tour especializado por las destilerías de tequila con cata, transporte y comida tradicional.',
          category: ServiceType.TOUR_EXPERIENCE,
          subcategory: 'Tour Gastronómico',
          price: 1800,
          currency: 'MXN',
          duration: 480,
          capacity: 12,
          venueId: venue.id,
          isActive: true,
          createdAt: venue.createdAt,
        },
      }),
    ]);
    allServices.push(...tourServices);
  }

  console.log(`✅ Created ${allServices.length} services across all venues`);

  console.log('📅 Creating historical reservations with realistic patterns...');

  // All users for reservations (excluding admins)
  const allUsers = [demoUser, ...regularUsers];

  // Create reservations over 6 months with growth patterns
  const allReservations = [];

  // Generate reservations for each month with realistic growth pattern
  // Note: Today is August 14, so we need data through current month
  for (let monthsAgo = 6; monthsAgo >= 0; monthsAgo--) {
    let baseReservationsThisMonth;

    if (monthsAgo === 0) {
      // August (current month, only 14 days) - 28 reservations for full month, so ~14 for half
      baseReservationsThisMonth = 14;
    } else if (monthsAgo === 1) {
      // July - Peak season, more than June (55 reservations)
      baseReservationsThisMonth = 55;
    } else {
      // Feb to June - Original growth pattern (10 to 50)
      baseReservationsThisMonth = Math.floor(10 + (6 - monthsAgo) * 8);
    }

    for (let i = 0; i < baseReservationsThisMonth; i++) {
      // Random user for this reservation
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];

      // Random service (and its venue)
      const randomService = allServices[Math.floor(Math.random() * allServices.length)];
      const venue = allVenues.find(v => v.id === randomService.venueId);

      // Generate realistic dates
      const reservationDate = getBusinessGrowthDate(monthsAgo);

      // Check-in date (1-30 days after reservation)
      const checkInDate = new Date(reservationDate);
      checkInDate.setDate(checkInDate.getDate() + Math.floor(Math.random() * 30) + 1);

      // Check-out date (1-7 days after check-in for accommodation, same day for others)
      const checkOutDate = new Date(checkInDate);
      if (randomService.category === ServiceType.ACCOMMODATION) {
        checkOutDate.setDate(checkOutDate.getDate() + Math.floor(Math.random() * 7) + 1);
      } else {
        checkOutDate.setHours(checkInDate.getHours() + Math.floor(randomService.duration / 60));
      }

      // Realistic guest count
      const guests = Math.min(Math.floor(Math.random() * randomService.capacity) + 1, randomService.capacity);

      // Calculate total amount with some variation
      const baseAmount = getRealisticAmount(randomService.category, monthsAgo);
      const totalAmount = baseAmount * guests;

      // Status distribution (older reservations more likely completed)
      const statusOptions = monthsAgo > 3 
        ? [ReservationStatus.COMPLETED, ReservationStatus.COMPLETED, ReservationStatus.CANCELLED]
        : monthsAgo > 1
        ? [ReservationStatus.COMPLETED, ReservationStatus.CONFIRMED, ReservationStatus.CANCELLED]
        : [ReservationStatus.CONFIRMED, ReservationStatus.PENDING, ReservationStatus.IN_PROGRESS];
      
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      
      const reservation = await prisma.reservation.create({
        data: {
          status,
          checkInDate,
          checkOutDate,
          guests,
          totalAmount,
          currency: 'MXN',
          notes: `Reservación automática generada para ${venue?.name}`,
          userId: randomUser.id,
          venueId: randomService.venueId,
          serviceId: randomService.id,
          createdAt: reservationDate,
          updatedAt: reservationDate,
        },
      });
      
      allReservations.push(reservation);
    }
  }

  console.log(`✅ Created ${allReservations.length} reservations across 6 months with growth pattern`);

  console.log('💰 Creating payment records for reservations...');

  const allPayments = [];
  
  for (const reservation of allReservations) {
    // Only create payments for confirmed/completed reservations
    if ([ReservationStatus.CONFIRMED, ReservationStatus.COMPLETED, ReservationStatus.IN_PROGRESS, ReservationStatus.CHECKED_OUT].includes(reservation.status)) {
      
      // Payment status based on reservation status
      let paymentStatus: PaymentStatus = PaymentStatus.PENDING;
      if (reservation.status === ReservationStatus.COMPLETED) {
        paymentStatus = PaymentStatus.COMPLETED;
      } else if (reservation.status === ReservationStatus.CONFIRMED) {
        paymentStatus = Math.random() > 0.3 ? PaymentStatus.COMPLETED : PaymentStatus.PENDING;
      }
      
      // Transaction date (same day as reservation or slightly later)
      const transactionDate = new Date(reservation.createdAt);
      if (paymentStatus === PaymentStatus.COMPLETED) {
        transactionDate.setHours(transactionDate.getHours() + Math.floor(Math.random() * 24));
      }
      
      const payment = await prisma.payment.create({
        data: {
          amount: reservation.totalAmount,
          currency: reservation.currency,
          status: paymentStatus,
          paymentMethod: 'stripe',
          transactionDate: paymentStatus === PaymentStatus.COMPLETED ? transactionDate : null,
          description: `Pago para reservación ${reservation.confirmationId}`,
          stripePaymentId: paymentStatus === PaymentStatus.COMPLETED ? `pi_${Math.random().toString(36).substr(2, 9)}` : null,
          userId: reservation.userId,
          reservationId: reservation.id,
          createdAt: reservation.createdAt,
          updatedAt: transactionDate,
        },
      });
      
      allPayments.push(payment);
      
      // Create receipts for completed payments
      if (paymentStatus === PaymentStatus.COMPLETED) {
        // Convert Decimal to number for calculations
        const amountNum = Number(payment.amount);
        await prisma.receipt.create({
          data: {
            type: ReceiptType.PAYMENT,
            status: ReceiptStatus.VERIFIED,
            amount: payment.amount,
            currency: payment.currency,
            issueDate: transactionDate,
            paidDate: transactionDate,
            taxAmount: amountNum * 0.16, // 16% IVA
            subtotalAmount: amountNum * 0.84,
            isVerified: true,
            verifiedAt: transactionDate,
            paymentId: payment.id,
            userId: payment.userId,
            createdAt: transactionDate,
          },
        });
      }
    }
  }

  console.log(`✅ Created ${allPayments.length} payments with realistic status distribution`);

  console.log('🏦 Creating payment history for businesses...');

  // Create payment histories for completed payments (business deposits)
  const completedPayments = allPayments.filter(p => p.status === PaymentStatus.COMPLETED);
  
  for (const payment of completedPayments) {
    const reservation = allReservations.find(r => r.id === payment.reservationId);
    const service = allServices.find(s => s.id === reservation?.serviceId);
    const venue = allVenues.find(v => v.id === service?.venueId);
    const businessAccount = businessAccounts.find(ba => ba.ownerId === venue?.ownerId);
    const bankAccount = bankAccounts.find(ba => ba.businessAccountId === businessAccount?.id);
    
    if (businessAccount && bankAccount) {
      // Calculate deposit amount (90% of payment, 10% platform fee)
      const depositAmount = Number(payment.amount) * 0.9;
      
      // Deposit date (1-3 days after payment)
      const depositDate = new Date(payment.transactionDate || payment.createdAt);
      depositDate.setDate(depositDate.getDate() + Math.floor(Math.random() * 3) + 1);
      
      await prisma.paymentHistory.create({
        data: {
          amount: depositAmount,
          currency: payment.currency,
          status: DepositStatus.COMPLETED,
          transactionRef: `dep_${Math.random().toString(36).substr(2, 9)}`,
          description: `Depósito por reservación ${reservation?.confirmationId}`,
          depositDate,
          processedDate: depositDate,
          businessAccountId: businessAccount.id,
          bankAccountId: bankAccount.id,
          reservationId: reservation!.id,
          createdAt: payment.createdAt,
        },
      });
    }
  }

  console.log('✅ Created payment history records for business deposits');

  console.log('📞 Creating contact forms...');

  const contactForms = await Promise.all([
    prisma.contactForm.create({
      data: {
        name: 'Carlos Mendoza',
        email: 'carlos.mendoza@empresarial.com',
        phone: '+52 33 1234 5678',
        subject: 'Consulta sobre eventos corporativos',
        message: 'Hola, estoy interesado en organizar un evento corporativo para 150 personas. Me gustaría saber sobre disponibilidad y precios para el próximo mes.',
        status: ContactFormStatus.PENDING,
        createdAt: getBusinessGrowthDate(1),
      },
    }),
    prisma.contactForm.create({
      data: {
        name: 'María Elena Vázquez',
        email: 'maria.vazquez@hotmail.com',
        phone: '+52 33 9876 5432',
        subject: 'Información sobre paquetes de boda',
        message: 'Buenos días, estoy planeando mi boda para diciembre y me interesa conocer sus paquetes completos. ¿Podrían enviarme información detallada?',
        status: ContactFormStatus.IN_PROGRESS,
        notes: 'Se envió cotización por email. Pendiente respuesta.',
        createdAt: getBusinessGrowthDate(2),
        updatedAt: getBusinessGrowthDate(1),
      },
    }),
    prisma.contactForm.create({
      data: {
        name: 'Roberto Silva',
        email: 'roberto.silva@gmail.com',
        phone: '+52 33 5555 7777',
        subject: 'Problema con reservación',
        message: 'Tengo un problema con mi reservación #RES123456. No puedo modificar las fechas desde la plataforma y necesito ayuda urgente.',
        status: ContactFormStatus.RESOLVED,
        notes: 'Problema resuelto. Se modificó la reservación directamente en el sistema.',
        createdAt: getBusinessGrowthDate(3),
        updatedAt: getBusinessGrowthDate(2),
      },
    }),
    prisma.contactForm.create({
      data: {
        name: 'Ana Lucía Torres',
        email: 'ana.torres@universidad.edu.mx',
        phone: '+52 33 2222 8888',
        subject: 'Alianza comercial universidades',
        message: 'Representamos a un grupo de universidades y nos interesa establecer una alianza comercial para eventos académicos y estancias. ¿Podríamos agendar una reunión?',
        status: ContactFormStatus.IN_PROGRESS,
        notes: 'Reunión programada para próxima semana con equipo comercial.',
        createdAt: getBusinessGrowthDate(2),
        updatedAt: getBusinessGrowthDate(1),
      },
    }),
    prisma.contactForm.create({
      data: {
        name: 'Fernando Jiménez',
        email: 'fernando.jimenez@turismo.gob.mx',
        phone: '+52 33 3333 4444',
        subject: 'Colaboración sector turístico',
        message: 'Desde la Secretaría de Turismo estamos interesados en incluir su plataforma en nuestros programas de promoción turística regional.',
        status: ContactFormStatus.ARCHIVED,
        notes: 'Propuesta evaluada. Se decidió no proceder por el momento.',
        createdAt: getBusinessGrowthDate(4),
        updatedAt: getBusinessGrowthDate(3),
      },
    }),
  ]);

  console.log(`✅ Created ${contactForms.length} contact forms with different statuses`);

  console.log('🔔 Creating notifications for users...');

  // Create notifications for recent reservations
  const recentReservations = allReservations.filter(r => {
    const monthsAgo = Math.floor((new Date().getTime() - r.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return monthsAgo <= 2;
  });

  const notifications = [];
  for (const reservation of recentReservations.slice(0, 30)) { // Limit to 30 notifications
    const service = allServices.find(s => s.id === reservation.serviceId);
    
    const notification = await prisma.notification.create({
      data: {
        type: NotificationType.RESERVATION_CONFIRMATION,
        title: 'Reservación Confirmada',
        message: `Tu reservación para ${service?.name} ha sido confirmada. Confirmación: ${reservation.confirmationId}`,
        isRead: Math.random() > 0.7, // 30% read
        userId: reservation.userId,
        createdAt: reservation.createdAt,
      },
    });
    notifications.push(notification);
  }

  console.log(`✅ Created ${notifications.length} notifications for recent reservations`);

  console.log('🌟 Creating reviews for venues and services...');

  // Create reviews for completed reservations
  const completedReservations = allReservations.filter(r => r.status === ReservationStatus.COMPLETED);
  
  const reviewTexts = [
    { rating: 5, title: "Excelente experiencia", comment: "Todo fue perfecto, el servicio excepcional y las instalaciones de primera calidad. Definitivamente regresaré." },
    { rating: 5, title: "Superó mis expectativas", comment: "Una experiencia increíble, el personal muy atento y el lugar hermoso. Altamente recomendado." },
    { rating: 4, title: "Muy buena opción", comment: "En general una muy buena experiencia, algunas pequeñas cosas por mejorar pero muy satisfecho." },
    { rating: 4, title: "Recomendable", comment: "Buen servicio y buenas instalaciones, la comida estuvo deliciosa y el ambiente muy agradable." },
    { rating: 3, title: "Experiencia promedio", comment: "Estuvo bien, cumple con lo básico pero creo que se puede mejorar en varios aspectos." },
    { rating: 2, title: "Expectativas no cumplidas", comment: "Esperaba más por el precio pagado, el servicio fue lento y algunas instalaciones necesitan mantenimiento." },
  ];

  for (const reservation of completedReservations.slice(0, 40)) { // Limit to 40 reviews
    if (Math.random() > 0.4) { // 60% of completed reservations have reviews
      const randomReview = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
      
      await prisma.review.create({
        data: {
          rating: randomReview.rating,
          title: randomReview.title,
          comment: randomReview.comment,
          isVerified: true,
          userId: reservation.userId,
          venueId: reservation.venueId,
          serviceId: reservation.serviceId,
          reservationId: reservation.id,
          createdAt: new Date(reservation.checkOutDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000), // Within a week of checkout
        },
      });
    }
  }

  console.log('✅ Created reviews for completed reservations');

  console.log('⚙️ Creating system configuration...');

  await Promise.all([
    prisma.systemConfig.create({
      data: {
        key: 'platform_commission',
        value: { percentage: 10, description: 'Platform commission percentage' },
      },
    }),
    prisma.systemConfig.create({
      data: {
        key: 'payment_methods',
        value: { 
          enabled: ['stripe', 'paypal'], 
          default: 'stripe',
          currencies: ['MXN', 'USD']
        },
      },
    }),
    prisma.systemConfig.create({
      data: {
        key: 'notification_settings',
        value: {
          email_enabled: true,
          sms_enabled: false,
          push_enabled: true
        },
      },
    }),
    prisma.systemConfig.create({
      data: {
        key: 'business_verification',
        value: {
          required_documents: ['tax_id', 'business_license'],
          auto_approve_threshold: 1000
        },
      },
    }),
  ]);

  console.log('✅ Created system configuration');

  // Summary statistics
  const userCount = await prisma.user.count();
  const venueCount = await prisma.venue.count();
  const serviceCount = await prisma.service.count();
  const reservationCount = await prisma.reservation.count();
  const paymentCount = await prisma.payment.count();
  const contactFormCount = await prisma.contactForm.count();

  console.log(`
  📊 SEEDING COMPLETED - 6-Month Historical Data Generated
  
  👥 Users: ${userCount}
  🏢 Venues: ${venueCount}
  🎯 Services: ${serviceCount}
  📅 Reservations: ${reservationCount}
  💰 Payments: ${paymentCount}
  📞 Contact Forms: ${contactFormCount}
  
  🎯 Key Features:
  ✅ 5 diverse business accounts with realistic operation patterns
  ✅ 15 venues distributed across different business types
  ✅ 6-month historical data with growth patterns
  ✅ Realistic seasonal variations in pricing and bookings
  ✅ Complete payment flow with business deposits
  ✅ Contact forms with different statuses
  ✅ Reviews and notifications for user engagement
  
  🚀 Dashboard will show realistic trends over the past 6 months!
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('✅ Database connection closed');
  });