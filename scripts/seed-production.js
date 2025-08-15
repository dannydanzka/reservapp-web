#!/usr/bin/env node

/**
 * Production Seeder Script
 * 
 * Este script ejecuta los seeders en el entorno de producción
 * usando las variables de entorno de Vercel.
 * 
 * Uso:
 * 1. Asegurar que DATABASE_URL esté configurada para producción
 * 2. Ejecutar: node scripts/seed-production.js
 */

const { execSync } = require('child_process');

console.log('🌱 Iniciando seeders para producción...');
console.log('📍 Entorno:', process.env.NODE_ENV || 'development');

try {
  // Verificar que existe la URL de base de datos
  if (!process.env.DATABASE_URL) {
    throw new Error('❌ DATABASE_URL no está configurada');
  }

  console.log('🔗 Conectando a base de datos de producción...');
  console.log('🔗 URL:', process.env.DATABASE_URL.substring(0, 30) + '...');

  // Generar cliente Prisma
  console.log('⚙️ Generando cliente Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Verificar conexión
  console.log('🔍 Verificando conexión a base de datos...');
  execSync('npx prisma db pull --force', { stdio: 'inherit' });

  // Ejecutar seeders
  console.log('🌱 Ejecutando seeders...');
  execSync('npx prisma db seed', { stdio: 'inherit' });

  console.log('✅ Seeders ejecutados exitosamente en producción!');
  console.log('📊 Datos de prueba disponibles:');
  console.log('   👤 Juan Pérez (juan.perez@gmail.com)');
  console.log('   👤 María López (maria.lopez@gmail.com)');
  console.log('   🏨 Casa Salazar y otros venues');
  console.log('   💰 7 pagos y 6 recibos de prueba');
  console.log('   📧 Notificaciones y sistema completo');

} catch (error) {
  console.error('❌ Error ejecutando seeders:', error.message);
  console.error('');
  console.error('🔧 Posibles soluciones:');
  console.error('   1. Verificar que DATABASE_URL esté correcta');
  console.error('   2. Verificar conexión a la base de datos');
  console.error('   3. Verificar que las tablas existan (prisma db push)');
  process.exit(1);
}