import bcrypt from 'bcryptjs';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createDemoUsers() {
  console.log('🚀 Creando usuarios demo...');

  try {
    // Password común para todos los usuarios demo
    const demoPassword = await bcrypt.hash('demo123', 10);

    // 1. SUPER_ADMIN Demo
    const superAdminEmail = 'demo.superadmin@reservapp.com';
    const existingSuperAdmin = await prisma.user.findUnique({
      where: { email: superAdminEmail },
    });

    if (!existingSuperAdmin) {
      const superAdmin = await prisma.user.create({
        data: {
          email: superAdminEmail,
          firstName: 'Demo',
          isActive: true,
          lastName: 'SuperAdmin',
          password: demoPassword,
          phone: '+52 33 9999 0001',
          role: 'SUPER_ADMIN',
        },
      });
      console.log('✅ SUPER_ADMIN creado:', superAdmin.email);
    } else {
      console.log('⚠️ SUPER_ADMIN ya existe:', superAdminEmail);
    }

    // 2. ADMIN Demo (con venues asignados)
    const adminEmail = 'demo.admin@reservapp.com';
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    let adminUser;
    if (!existingAdmin) {
      adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          firstName: 'Demo',
          isActive: true,
          lastName: 'Admin',
          password: demoPassword,
          phone: '+52 33 9999 0002',
          role: 'ADMIN',
        },
      });
      console.log('✅ ADMIN creado:', adminUser.email);

      // Asignar algunos venues al admin demo
      const venuesWithoutOwner = await prisma.venue.findMany({
        take: 3,
        where: { ownerId: null },
      });

      if (venuesWithoutOwner.length > 0) {
        await prisma.venue.updateMany({
          data: {
            ownerId: adminUser.id,
          },
          where: {
            id: {
              in: venuesWithoutOwner.map((v) => v.id),
            },
          },
        });
        console.log(`   📍 ${venuesWithoutOwner.length} venues asignados al ADMIN demo`);
      }
    } else {
      console.log('⚠️ ADMIN ya existe:', adminEmail);
      adminUser = existingAdmin;
    }

    // 3. USER Demo (para app móvil)
    const userEmail = 'demo.user@reservapp.com';
    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!existingUser) {
      const user = await prisma.user.create({
        data: {
          email: userEmail,
          firstName: 'Demo',
          isActive: true,
          lastName: 'Usuario',
          password: demoPassword,
          phone: '+52 33 9999 0003',
          role: 'USER',
        },
      });
      console.log('✅ USER creado:', user.email);
    } else {
      console.log('⚠️ USER ya existe:', userEmail);
    }

    console.log('\n📋 Resumen de usuarios demo:');
    console.log('================================');
    console.log('🔐 Password para todos: demo123');
    console.log('');
    console.log('1. SUPER_ADMIN (ve todo el sistema):');
    console.log('   Email: demo.superadmin@reservapp.com');
    console.log('   Pass:  demo123');
    console.log('');
    console.log('2. ADMIN (ve solo sus venues):');
    console.log('   Email: demo.admin@reservapp.com');
    console.log('   Pass:  demo123');
    console.log('');
    console.log('3. USER (para app móvil):');
    console.log('   Email: demo.user@reservapp.com');
    console.log('   Pass:  demo123');
    console.log('================================\n');
  } catch (error) {
    console.error('❌ Error creando usuarios demo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
createDemoUsers()
  .then(() => {
    console.log('✨ Script completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
