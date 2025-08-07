import { Prisma, Venue, VenueType } from '@prisma/client';
import { prismaService } from '@/libs/services/database/prismaService';

export interface VenueFilters {
  category?: VenueType;
  search?: string;
  city?: string;
  rating?: number;
  isActive?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface VenueWithServices extends Venue {
  services: Array<{
    id: string;
    name: string;
    category: string;
    price: Prisma.Decimal;
    currency: string;
    capacity: number;
  }>;
  _count: {
    services: number;
    reservations: number;
  };
}

export class VenueRepository {
  private prisma = prismaService.getClient();

  async findAll(filters: VenueFilters = {}): Promise<VenueWithServices[]> {
    const where: Prisma.VenueWhereInput = {};

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { address: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    if (filters.city) {
      where.address = { contains: filters.city };
    }

    if (filters.rating) {
      where.rating = { gte: filters.rating };
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.priceRange) {
      where.services = {
        some: {
          price: {
            gte: filters.priceRange.min,
            lte: filters.priceRange.max,
          },
        },
      };
    }

    return await this.prisma.venue.findMany({
      include: {
        _count: {
          select: {
            reservations: true,
            services: true,
          },
        },
        services: {
          select: {
            capacity: true,
            category: true,
            currency: true,
            id: true,
            name: true,
            price: true,
          },
          take: 5,
        },
      },
      orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
      where,
    });
  }

  async findById(id: string): Promise<VenueWithServices | null> {
    return await this.prisma.venue.findUnique({
      include: {
        _count: {
          select: {
            reservations: true,
            services: true,
          },
        },
        services: {
          select: {
            capacity: true,
            category: true,
            currency: true,
            id: true,
            name: true,
            price: true,
          },
        },
      },
      where: { id },
    });
  }

  async findByCategory(category: VenueType): Promise<VenueWithServices[]> {
    return await this.findAll({ category });
  }

  async findNearby(
    latitude: number,
    longitude: number,
    radiusKm: number = 10
  ): Promise<VenueWithServices[]> {
    const venues = await this.prisma.$queryRaw<VenueWithServices[]>`
      SELECT *, 
        (6371 * acos(
          cos(radians(${latitude})) * 
          cos(radians(latitude)) * 
          cos(radians(longitude) - radians(${longitude})) + 
          sin(radians(${latitude})) * 
          sin(radians(latitude))
        )) AS distance
      FROM Venue 
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      HAVING distance <= ${radiusKm}
      ORDER BY distance
    `;

    return venues;
  }

  async create(data: Prisma.VenueCreateInput): Promise<Venue> {
    return await this.prisma.venue.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async update(id: string, data: Prisma.VenueUpdateInput): Promise<Venue> {
    return await this.prisma.venue.update({
      data: {
        ...data,
        updatedAt: new Date(),
      },
      where: { id },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.venue.delete({
      where: { id },
    });
  }

  async getVenueStats(id: string) {
    const venue = await this.prisma.venue.findUnique({
      include: {
        reservations: {
          include: {
            payments: true,
          },
        },
        services: true,
      },
      where: { id },
    });

    if (!venue) return null;

    const totalReservations = venue.reservations.length;
    const totalRevenue = venue.reservations
      .flatMap((r) => r.payments)
      .filter((p) => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount.toNumber(), 0);

    const occupancyRate =
      venue.services.reduce((avg, service) => {
        const serviceReservations = venue.reservations.filter((r) => r.serviceId === service.id);
        return avg + serviceReservations.length / service.capacity;
      }, 0) / venue.services.length;

    return {
      averageRating: venue.rating?.toNumber() || 0,
      occupancyRate: Math.min(occupancyRate * 100, 100),
      totalReservations,
      totalRevenue,
      totalServices: venue.services.length,
    };
  }

  async searchAvailable(
    checkIn: Date,
    checkOut: Date,
    serviceCapacity?: number,
    category?: VenueType
  ): Promise<VenueWithServices[]> {
    const where: Prisma.VenueWhereInput = {
      services: {
        some: {
          capacity: serviceCapacity ? { gte: serviceCapacity } : undefined,
          reservations: {
            none: {
              OR: [
                {
                  checkInDate: { lte: checkOut },
                  checkOutDate: { gte: checkIn },
                  status: {
                    in: ['CONFIRMED', 'CHECKED_IN'],
                  },
                },
              ],
            },
          },
        },
      },
    };

    if (category) {
      where.category = category;
    }

    return await this.prisma.venue.findMany({
      include: {
        _count: {
          select: {
            reservations: true,
            services: true,
          },
        },
        services: {
          select: {
            capacity: true,
            category: true,
            currency: true,
            id: true,
            name: true,
            price: true,
          },
          where: {
            capacity: serviceCapacity ? { gte: serviceCapacity } : undefined,
          },
        },
      },
      orderBy: { rating: 'desc' },
      where,
    });
  }
}

// Export instance
export const venueRepository = new VenueRepository();
