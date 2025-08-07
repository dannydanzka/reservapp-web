// Core middleware exports
export * from './subscriptionMiddleware';

// Middleware usage examples and documentation

/**
 * Example usage in API routes:
 *
 * For routes requiring premium subscription:
 * ```typescript
 * import { requirePremiumSubscription } from '@/libs/core/middleware';
 *
 * export async function POST(request: NextRequest) {
 *   const validation = await requirePremiumSubscription(request);
 *   if (!validation.success) {
 *     return validation.response;
 *   }
 *
 *   const user = validation.user;
 *   // Continue with API logic...
 * }
 * ```
 *
 * For routes with favorites limit:
 * ```typescript
 * import { validateFavoritesLimit } from '@/libs/core/middleware';
 *
 * export async function POST(request: NextRequest) {
 *   const currentCount = await getCurrentFavoriteCount(userId);
 *   const validation = await validateFavoritesLimit(request, currentCount);
 *
 *   if (!validation.success) {
 *     return validation.response;
 *   }
 *
 *   // Add favorite logic...
 * }
 * ```
 *
 * For general subscription validation:
 * ```typescript
 * import { validateSubscription } from '@/libs/core/middleware';
 *
 * export async function GET(request: NextRequest) {
 *   const validation = await validateSubscription(request);
 *   if (!validation.success) {
 *     return NextResponse.json({ error: validation.error }, { status: validation.statusCode });
 *   }
 *
 *   const user = validation.user;
 *   // Customize response based on subscription...
 * }
 * ```
 */
