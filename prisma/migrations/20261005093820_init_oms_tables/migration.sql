-- CreateTable
CREATE TABLE "tenant_workflows" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "state_machine_config" JSONB NOT NULL,
    "rule_definitions" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "workflow_version_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "current_state" VARCHAR(100) NOT NULL,
    "total_amount" DECIMAL(12,2) NOT NULL,
    "tax_amount" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox_events" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "aggregate_type" VARCHAR(50) NOT NULL DEFAULT 'ORDER',
    "aggregate_id" UUID NOT NULL,
    "event_type" VARCHAR(100) NOT NULL,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "error_log" TEXT,
    "last_attempted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outbox_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox_events_dlq" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "aggregate_type" VARCHAR(50) NOT NULL,
    "aggregate_id" UUID NOT NULL,
    "event_type" VARCHAR(100) NOT NULL,
    "payload" JSONB NOT NULL,
    "failed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "error_log" TEXT,
    "retry_count" INTEGER NOT NULL,

    CONSTRAINT "outbox_events_dlq_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenant_workflows_tenant_id_version_key" ON "tenant_workflows"("tenant_id", "version");

-- CreateIndex
CREATE INDEX "orders_tenant_id_current_state_idx" ON "orders"("tenant_id", "current_state");

-- CreateIndex
CREATE INDEX "outbox_events_processed_retry_count_created_at_idx" ON "outbox_events"("processed", "retry_count", "created_at");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_workflow_version_id_fkey" FOREIGN KEY ("workflow_version_id") REFERENCES "tenant_workflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
