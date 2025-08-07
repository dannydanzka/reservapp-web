import { Decimal } from '@prisma/client/runtime/library';
import { Prisma, Service, ServiceType } from '@prisma/client';
import { PrismaService } from '@libs/services/database/prismaService';

export interface ServiceFilters {
  category?: ServiceType;
  venueId?: string;
  search?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  capacity?: number;
  available?: boolean;
  duration?: number;
}

export interface ServiceWithVenue extends Service {
  venue: {
    id: string;
    name: string;
    category: string;
    address: string;
    rating: Decimal | null;
  };
  _count: {
    reservations: number;
  };
}

export class ServiceRepository {
  private prismaService: PrismaService;

  constructor() {
    this.prismaService = PrismaService.getInstance();
  }

  private get prisma() {
    return this.prismaService.getClient();
  }

  async findAll(filters: ServiceFilters = {}): Promise<ServiceWithVenue[]> {
    const where: Prisma.ServiceWhereInput = {};

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.venueId) {
      where.venueId = filters.venueId;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    if (filters.priceRange) {
      where.price = {
        gte: filters.priceRange.min,
        lte: filters.priceRange.max,
      };
    }

    if (filters.capacity) {
      where.capacity = { gte: filters.capacity };
    }

    if (filters.duration) {
      where.duration = filters.duration;
    }

    if (filters.available) {
      where.isActive = true;
    }

    return await this.prisma.service.findMany({
      include: {
        _count: {
          select: {
            reservations: true,
          },
        },
        venue: {
          select: {
            address: true,
            category: true,
            id: true,
            name: true,
            rating: true,
          },
        },
      },
      orderBy: [{ price: 'asc' }, { createdAt: 'desc' }],
      where,
    });
  }

  async findById(id: string): Promise<ServiceWithVenue | null> {
    return await this.prisma.service.findUnique({
      include: {
        _count: {
          select: {
            reservations: true,
          },
        },
        venue: {
          select: {
            address: true,
            category: true,
            id: true,
            name: true,
            rating: true,
          },
        },
      },
      where: { id },
    });
  }

  async findByVenue(venueId: string): Promise<ServiceWithVenue[]> {
    return await this.findAll({ venueId });
  }

  async findByCategory(category: ServiceType): Promise<ServiceWithVenue[]> {
    return await this.findAll({ category });
  }

  async create(data: Prisma.ServiceCreateInput): Promise<Service> {
    return await this.prisma.service.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async update(id: string, data: Prisma.ServiceUpdateInput): Promise<Service> {
    return await this.prisma.service.update({
      data: {
        ...data,
        updatedAt: new Date(),
      },
      where: { id },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.service.delete({
      where: { id },
    });
  }

  async checkAvailability(
    serviceId: string,
    checkInDate: Date,
    checkOutDate: Date,
    requiredCapacity: number = 1
  ): Promise<boolean> {
    const service = await this.prisma.service.findUnique({
      include: {
        reservations: {
          where: {
            OR: [
              {
                checkInDate: { lte: checkOutDate },
                checkOutDate: { gte: checkInDate },
                status: {
                  in: ['CONFIRMED', 'CHECKED_IN'],
                },
              },
            ],
          },
        },
      },
      where: { id: serviceId },
    });

    if (!service) return false;
    if (!service.isActive) return false;
    if (service.capacity < requiredCapacity) return false;

    const reservedCapacity = service.reservations.reduce(
      (sum: number, reservation: any) => sum + reservation.guests,
      0
    );

    return service.capacity >= reservedCapacity + requiredCapacity;
  }

  async getAvailableServices(
    checkInDate: Date,
    checkOutDate: Date,
    capacity: number = 1,
    filters: ServiceFilters = {}
  ): Promise<ServiceWithVenue[]> {
    const where: Prisma.ServiceWhereInput = {
      capacity: { gte: capacity },
      isActive: true,
      reservations: {
        none: {
          OR: [
            {
              checkInDate: { lte: checkOutDate },
              checkOutDate: { gte: checkInDate },
              status: {
                in: ['CONFIRMED', 'CHECKED_IN'],
              },
            },
          ],
        },
      },
    };

    if (filters.category) where.category = filters.category;
    if (filters.venueId) where.venueId = filters.venueId;
    if (filters.priceRange) {
      where.price = {
        gte: filters.priceRange.min,
        lte: filters.priceRange.max,
      };
    }

    return await this.prisma.service.findMany({
      include: {
        _count: {
          select: {
            reservations: true,
          },
        },
        venue: {
          select: {
            address: true,
            category: true,
            id: true,
            name: true,
            rating: true,
          },
        },
      },
      orderBy: { price: 'asc' },
      where,
    });
  }

  async getServiceStats(id: string) {
    const service = await this.prisma.service.findUnique({
      include: {
        reservations: {
          include: {
            payments: true,
          },
        },
      },
      where: { id },
    });

    if (!service) return null;

    const totalReservations = service.reservations.length;
    const totalRevenue = service.reservations
      .flatMap((r: any) => r.payments)
      .filter((p: any) => p.status === 'COMPLETED')
      .reduce((sum: number, p: any) => sum + p.amount.toNumber(), 0);

    const occupancyRate =
      service.reservations.filter((r: any) => r.status === 'CONFIRMED' || r.status === 'CHECKED_IN')
        .length / service.capacity;

    // Note: Rating functionality not implemented in current reservation model
    const averageRating = 0;

    return {
      averageRating,
      bookingRate: totalReservations > 0 ? (totalReservations / service.capacity) * 100 : 0,
      capacity: service.capacity,
      occupancyRate: Math.min(occupancyRate * 100, 100),
      totalReservations,
      totalRevenue,
    };
  }

  async getPopularServices(limit: number = 10): Promise<ServiceWithVenue[]> {
    return await this.prisma.service.findMany({
      include: {
        _count: {
          select: {
            reservations: true,
          },
        },
        venue: {
          select: {
            address: true,
            category: true,
            id: true,
            name: true,
            rating: true,
          },
        },
      },
      orderBy: {
        reservations: {
          _count: 'desc',
        },
      },
      take: limit,
      where: { isActive: true },
    });
  }

  async updatePricing(id: string, newPrice: number): Promise<Service> {
    return await this.prisma.service.update({
      data: {
        price: newPrice,
        updatedAt: new Date(),
      },
      where: { id },
    });
  }

  async toggleAvailability(id: string): Promise<Service> {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new Error('Service not found');
    }

    return await this.prisma.service.update({
      data: {
        isActive: !service.isActive,
        updatedAt: new Date(),
      },
      where: { id },
    });
  }
}
