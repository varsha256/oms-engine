import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { evaluateStateTransition } from '../lib/stateEngine';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function transitionOrder(tenantId: string, orderId: string, event: string, payload: any) {
  const lockKey = `lock:order:${orderId}`;
  const acquired = await redis.set(lockKey, 'LOCKED', 'PX', 5000, 'NX');

  if (!acquired) {
    throw new Error('CONCURRENCY_ERROR: Order is currently being updated.');
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUniqueOrThrow({ where: { id: orderId } });
      const workflow = await tx.tenantWorkflow.findUniqueOrThrow({ where: { id: order.workflow_version_id } });

      const nextState = await evaluateStateTransition(
        workflow.state_machine_config,
        order.current_state,
        event,
        { total_amount: Number(order.total_amount), ...payload }
      );

      // Update Order State
      const updatedOrder = await tx.order.update({
        where: { id: orderId, version: order.version },
        data: { current_state: nextState, version: { increment: 1 } }
      });

      // Write Event to Outbox
      await tx.outboxEvent.create({
        data: {
          tenant_id: tenantId,
          aggregate_id: orderId,
          event_type: 'ORDER_TRANSITIONED',
          payload: {
            order_id: orderId,
            previous_state: order.current_state,
            current_state: nextState,
            trigger_event: event
          }
        }
      });

      return updatedOrder;
    });
  } finally {
    await redis.del(lockKey);
  }
}