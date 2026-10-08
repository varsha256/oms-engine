import { NextRequest, NextResponse } from 'next/server';
import { transitionOrder } from '../../../../../../services/orderService';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const tenantId = req.headers.get('X-Tenant-Key');
  if (!tenantId) {
    return NextResponse.json(
      { error: 'UNAUTHORIZED', message: 'Missing X-Tenant-Key' },
      { status: 401 }
    );
  }

  const resolvedParams = await Promise.resolve(params);
  const orderId = resolvedParams.id;

  if (!orderId) {
    return NextResponse.json(
      { error: 'BAD_REQUEST', message: 'Missing order id in path' },
      { status: 400 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'BAD_REQUEST', message: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const event = body.event;
  if (!event) {
    return NextResponse.json(
      { error: 'BAD_REQUEST', message: 'Missing required field: event' },
      { status: 400 }
    );
  }

  try {
    const updatedOrder = await transitionOrder(tenantId, orderId, event, body.payload || {});
    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error: any) {
    const message = error?.message || 'Transition failed';

    if (message.includes('INVALID_TRANSITION') || message.includes('GUARD_FAILED')) {
      return NextResponse.json(
        { error: 'INVALID_TRANSITION', message },
        { status: 400 }
      );
    }

    if (message.includes('CONCURRENCY_ERROR')) {
      return NextResponse.json(
        { error: 'CONCURRENCY_ERROR', message },
        { status: 409 }
      );
    }

    if (message.includes('not found') || message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Order not found for this tenant' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR', message },
      { status: 500 }
    );
  }
}