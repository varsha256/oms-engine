variable "vercel_token" {
  type      = string
  sensitive = true
}

variable "supabase_token" {
  type      = string
  sensitive = true
}

variable "upstash_email" {
  type = string
}

variable "upstash_key" {
  type      = string
  sensitive = true
}

variable "aiven_api_token" {
  type      = string
  sensitive = true
}

variable "supabase_org_id" {
  type = string
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "aiven_project_name" {
  type = string
}

variable "github_repo" {
  type = string
}