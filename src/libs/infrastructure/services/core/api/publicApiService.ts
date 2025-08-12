/**
 * Public API Service
 * Handles public API calls (no authentication required)
 */

import { PrismaClient, VenueType } from '@prisma/client';

export interface PublicVenue {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  rating: number;
  category: string;
  latitude: number | null;
  longitude: number | null;
  phone?: string;
  services: {
    id: string;
    name: string;
    price: number;
    type: string;
  }[];
  _count: {
    services: number;
  };
}

const prisma = new PrismaClient();

interface PaginationOptions {
  page?: number;
  limit?: number;
}

interface ServiceFilters {
  category?: string;
  venueId?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
}

interface VenueFilters {
  category?: VenueType;
  city?: string;
  search?: string;
}

export class PublicApiService {
  static async getPublicVenues(): Promise<PublicVenue[]> {
    const venues = await prisma.venue.findMany({
      orderBy: { rating: 'desc' },
      select: {
        _count: {
          select: {
            services: {
              where: { isActive: true },
            },
          },
        },
        address: true,
        category: true,
        city: true,
        description: true,
        id: true,
        latitude: true,
        longitude: true,
        name: true,
        rating: true,
        services: {
          select: {
            category: true,
            id: true,
            name: true,
            price: true,
          },
          take: 3,
          where: { isActive: true },
        },
        state: true,
      },
      where: { isActive: true },
    });

    return venues.map((venue) => ({
      ...venue,
      latitude: Number(venue.latitude),
      longitude: Number(venue.longitude),
      rating: Number(venue.rating),
      services: venue.services.map((service) => ({
        id: service.id,
        name: service.name,
        price: Number(service.price),
        type: service.category,
      })),
    })) as PublicVenue[];
  }
  static async getServices(filters: ServiceFilters = {}, pagination: PaginationOptions = {}) {
    const { limit = 10, page = 1 } = pagination;
    const { category, priceMax, priceMin, search, venueId } = filters;

    const skip = (page - 1) * limit;

    const where = {
      isActive: true,
      ...(category && { type: category }),
      ...(venueId && { venueId }),
      ...(priceMin !== undefined && { price: { gte: priceMin } }),
      ...(priceMax !== undefined && { price: { lte: priceMax } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        include: {
          venue: {
            select: {
              city: true,
              id: true,
              name: true,
              rating: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        where,
      }),
      prisma.service.count({ where }),
    ]);

    return {
      data: services,
      pagination: {
        limit,
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    };
  }

  static async getVenues(filters: VenueFilters = {}, pagination: PaginationOptions = {}) {
    const { limit = 10, page = 1 } = pagination;
    const { category, city, search } = filters;

    const skip = (page - 1) * limit;

    const where = {
      isActive: true,
      ...(category && { category }),
      ...(city && { city }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [venues, total] = await Promise.all([
      prisma.venue.findMany({
        include: {
          _count: {
            select: {
              services: {
                where: { isActive: true },
              },
            },
          },
          services: {
            select: {
              category: true,
              id: true,
              name: true,
              price: true,
            },
            take: 3,
            where: { isActive: true }, // Show only first 3 services
          },
        },
        orderBy: { rating: 'desc' },
        skip,
        take: limit,
        where,
      }),
      prisma.venue.count({ where }),
    ]);

    return {
      data: venues,
      pagination: {
        limit,
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    };
  }

  static async getPopularVenues(limit = 6) {
    return await prisma.venue.findMany({
      include: {
        _count: {
          select: {
            services: {
              where: { isActive: true },
            },
          },
        },
        services: {
          select: {
            category: true,
            id: true,
            name: true,
            price: true,
          },
          take: 2,
          where: { isActive: true },
        },
      },
      orderBy: { rating: 'desc' },
      take: limit,
      where: { isActive: true },
    });
  }

  static async getServiceById(serviceId: string) {
    return await prisma.service.findUnique({
      include: {
        venue: {
          select: {
            address: true,
            city: true,
            description: true,
            id: true,
            latitude: true,
            longitude: true,
            name: true,
            rating: true,
            state: true,
          },
        },
      },
      where: { id: serviceId, isActive: true },
    });
  }

  static async getVenueById(venueId: string) {
    return await prisma.venue.findUnique({
      include: {
        services: {
          orderBy: { price: 'asc' },
          where: { isActive: true },
        },
      },
      where: { id: venueId, isActive: true },
    });
  }
}

export const publicApiService = PublicApiService;
