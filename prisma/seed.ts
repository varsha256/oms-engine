import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenantId = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

  await prisma.tenantWorkflow.upsert({
    where: { tenant_id_version: { tenant_id: tenantId, version: 1 } },
    update: {},
    create: {
      tenant_id: tenantId,
      version: 1,
      is_active: true,
      state_machine_config: {
        initial_state: 'ORDER_RECEIVED',
        states: {
          ORDER_RECEIVED: {
            on: {
              ACCEPT: {
                target: 'BAKING',
                guard: {
                  conditions: {
                    all: [{ fact: 'total_amount', operator: 'greaterThan', value: 0 }]
                  }
                }
              },
              CANCEL: { target: 'CANCELLED' }
            }
          },
          BAKING: {
            on: {
              DISPATCH: { target: 'OUT_FOR_DELIVERY' }
            }
          },
          OUT_FOR_DELIVERY: {
            on: {
              DELIVER: { target: 'DELIVERED' }
            }
          },
          DELIVERED: { state_type: 'TERMINAL' },
          CANCELLED: { state_type: 'TERMINAL' }
        }
      }
    }
  });

  console.log('Database seeded with default tenant workflow!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());