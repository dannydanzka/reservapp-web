#!/usr/bin/env node

/**
 * Script para generar documentación de Swagger automáticamente
 * Escanea todos los endpoints de API y verifica si tienen documentación
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_DIR = path.join(process.cwd(), 'src', 'app', 'api');

function scanDirectory(dir, results = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath, results);
    } else if (file === 'route.ts') {
      results.push(fullPath);
    }
  }

  return results;
}

function checkSwaggerDocumentation(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasSwaggerDoc = content.includes('@openapi');

  // Extraer el path del endpoint
  const relativePath = path.relative(path.join(API_DIR), filePath);
  const endpointPath = '/' + path.dirname(relativePath).replace(/\\/g, '/');

  // Extraer métodos HTTP
  const methods = [];
  if (content.includes('export async function GET') || content.includes('export const GET')) methods.push('GET');
  if (content.includes('export async function POST') || content.includes('export const POST')) methods.push('POST');
  if (content.includes('export async function PUT') || content.includes('export const PUT')) methods.push('PUT');
  if (content.includes('export async function DELETE') || content.includes('export const DELETE')) methods.push('DELETE');
  if (content.includes('export async function PATCH') || content.includes('export const PATCH')) methods.push('PATCH');

  return {
    filePath,
    endpointPath,
    methods,
    hasSwaggerDoc,
    isDocumented: hasSwaggerDoc
  };
}

function generateReport() {
  console.log('🔍 Escaneando endpoints de API...\n');

  const routeFiles = scanDirectory(API_DIR);
  const endpoints = routeFiles.map(checkSwaggerDocumentation);

  const documented = endpoints.filter(e => e.isDocumented);
  const undocumented = endpoints.filter(e => !e.isDocumented);

  console.log(`📊 RESUMEN DE DOCUMENTACIÓN:`);
  console.log(`✅ Endpoints documentados: ${documented.length}`);
  console.log(`❌ Endpoints sin documentar: ${undocumented.length}`);
  console.log(`📈 Progreso: ${Math.round((documented.length / endpoints.length) * 100)}%\n`);

  if (documented.length > 0) {
    console.log('✅ ENDPOINTS DOCUMENTADOS:');
    documented.forEach(endpoint => {
      console.log(`   ${endpoint.methods.join(', ')} ${endpoint.endpointPath}`);
    });
    console.log('');
  }

  if (undocumented.length > 0) {
    console.log('❌ ENDPOINTS SIN DOCUMENTAR:');
    undocumented.forEach(endpoint => {
      console.log(`   ${endpoint.methods.join(', ')} ${endpoint.endpointPath}`);
      console.log(`      Archivo: ${path.relative(process.cwd(), endpoint.filePath)}`);
    });
    console.log('');
  }

  console.log('🚀 Para acceder a la documentación completa:');
  console.log('   - Swagger UI: http://localhost:3000/api-docs');
  console.log('   - JSON Schema: http://localhost:3000/api/swagger');

  return {
    total: endpoints.length,
    documented: documented.length,
    undocumented: undocumented.length,
    progress: Math.round((documented.length / endpoints.length) * 100)
  };
}

// Ejecutar si el script se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  generateReport();
}

export { generateReport, scanDirectory, checkSwaggerDocumentation };