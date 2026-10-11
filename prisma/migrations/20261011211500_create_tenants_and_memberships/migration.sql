CREATE TABLE "tenants" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_name" VARCHAR(160) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tenant_memberships" (
    "auth_user_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "role" VARCHAR(20) NOT NULL DEFAULT 'owner',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_memberships_pkey" PRIMARY KEY ("auth_user_id"),
    CONSTRAINT "tenant_memberships_tenant_id_fkey"
        FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id")
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "tenant_memberships_tenant_id_idx" ON "tenant_memberships"("tenant_id");

ALTER TABLE "tenants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tenant_memberships" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "tenants", "tenant_memberships" FROM anon, authenticated;
