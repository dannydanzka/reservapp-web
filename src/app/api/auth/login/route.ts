import { NextRequest } from 'next/server';

import { ApiResponse } from '@/libs/types/api.types';
import {
  LoginCredentials,
  LoginSession,
} from '@/modules/mod-auth/domain/interfaces/auth.interfaces';
import { LoginUseCase } from '@/modules/mod-auth/domain/use-cases/LoginUseCase';
import { ServerAuthRepository } from '@/modules/mod-auth/data/repositories/ServerAuthRepository';
import { validateRequestBody, withErrorHandling } from '@/libs/services/api/utils/handleApiRequest';

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Authenticate user and generate session token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/LoginSession'
 *       400:
 *         description: Missing credentials
 *       401:
 *         description: Invalid credentials
 */
const loginHandler = async (request: NextRequest): Promise<ApiResponse<LoginSession>> => {
  const body: LoginCredentials = await request.json();

  // Validate request body
  const validation = validateRequestBody<LoginCredentials>(body, ['email', 'password']);
  if (!validation.isValid) {
    return {
      error: 'VALIDATION_ERROR',
      message: validation.errors?.join(', ') ?? 'Validation failed',
      success: false,
      timestamp: new Date().toISOString(),
    };
  }

  try {
    // Execute login use case
    const authRepository = new ServerAuthRepository();
    const loginUseCase = new LoginUseCase(authRepository);

    const session = await loginUseCase.execute(body);

    return {
      data: session,
      message: 'Login successful',
      success: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      error: 'LOGIN_ERROR',
      message: error instanceof Error ? error.message : 'Login failed',
      success: false,
      timestamp: new Date().toISOString(),
    };
  }
};

export const POST = withErrorHandling(loginHandler);
