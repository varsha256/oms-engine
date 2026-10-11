terraform {
  required_version = ">= 1.5.0"
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
    upstash = {
      source  = "upstash/upstash"
      version = "~> 1.0"
    }
    aiven = {
      source  = "aiven/aiven"
      version = "~> 4.0"
    }
  }
}

provider "vercel" {
  api_token = var.vercel_token
}

provider "supabase" {
  access_token = var.supabase_token
}

provider "upstash" {
  email   = var.upstash_email
  api_key = var.upstash_key
}

provider "aiven" {
  api_token = var.aiven_api_token
}

# 1. Provision PostgreSQL Database on Supabase


# 2. Provision Redis Cluster on Upstash
resource "upstash_redis_database" "oms_redis" {
  database_name = "oms-redis"
  region        = "ap-south-1"
  tls           = true
  eviction      = true
}

# 3. Provision Kafka Cluster & Topic on Aiven (Free/Startup Tier)
resource "aiven_kafka" "oms_kafka" {
  project      = var.aiven_project_name
  cloud_name   = "aws-ap-south-1"
  plan         = "startup-2" # Note: Check Aiven dashboard for exact free tier plan string
  service_name = "oms-kafka-cluster"
}

resource "aiven_kafka_topic" "order_events" {
  project      = aiven_kafka.oms_kafka.project
  service_name = aiven_kafka.oms_kafka.service_name
  topic_name   = "order.events"
  partitions   = 1
  replication  = 1
}

# 4. Link Infrastructure Secrets to Vercel Application Deployment
resource "vercel_project" "oms_app" {
  name      = "oms-engine"
  framework = "nextjs"

  git_repository = {
    type = "github"
    repo = var.github_repo
  }
}

resource "vercel_project_environment_variable" "database_url" {
  project_id = vercel_project.oms_app.id
  key        = "DATABASE_URL"
  # Fixed the resource reference from oms_db.id to oms.id
  value  = "postgresql://postgres:${var.db_password}@db.${supabase_project.oms.id}.supabase.co:5432/postgres"
  target = ["production", "preview"]
}

resource "vercel_project_environment_variable" "redis_url" {
  project_id = vercel_project.oms_app.id
  key        = "UPSTASH_REDIS_REST_URL"
  value      = "https://${upstash_redis_database.oms_redis.endpoint}"
  target     = ["production", "preview"]
}

resource "vercel_project_environment_variable" "redis_rest_token" {
  project_id = vercel_project.oms_app.id
  key        = "UPSTASH_REDIS_REST_TOKEN"
  value      = upstash_redis_database.oms_redis.rest_token
  target     = ["production", "preview"]
}

resource "vercel_project_environment_variable" "kafka_uri" {
  project_id = vercel_project.oms_app.id
  key        = "KAFKA_URI"
  value      = aiven_kafka.oms_kafka.service_uri
  target     = ["production", "preview"]
}