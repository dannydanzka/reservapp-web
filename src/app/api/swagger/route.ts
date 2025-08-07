import { NextResponse } from 'next/server';

import { swaggerSpec } from '@/libs/core/config/swagger.config';

/**
 * @openapi
 * /swagger:
 *   get:
 *     summary: Retrieve Swagger JSON specification
 *     tags: [Documentation]
 *     responses:
 *       200:
 *         description: Returns Swagger JSON specification
 */
export async function GET() {
  return NextResponse.json(swaggerSpec);
}
