import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export async function findTenantForUser(authUserId: string) {
  return prisma.tenantMembership.findUnique({
    where: { authUserId },
    include: { tenant: true },
  });
}

export async function createTenantForUser(authUserId: string, companyName: string) {
  const normalizedName = companyName.trim();
  if (!normalizedName || normalizedName.length > 160) {
    throw new Error('Company name must be between 1 and 160 characters.');
  }

  try {
    return await prisma.$transaction(async (transaction) => {
      const existingMembership = await transaction.tenantMembership.findUnique({
        where: { authUserId },
        include: { tenant: true },
      });

      if (existingMembership) {
        return existingMembership;
      }

      const tenant = await transaction.tenant.create({
        data: { companyName: normalizedName },
      });

      return transaction.tenantMembership.create({
        data: {
          authUserId,
          tenantId: tenant.id,
          role: 'owner',
        },
        include: { tenant: true },
      });
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const membership = await findTenantForUser(authUserId);
      if (membership) {
        return membership;
      }
    }
    throw error;
  }
}
