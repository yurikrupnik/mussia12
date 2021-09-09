
resource "google_storage_bucket" "temp_folder" {
  name     = "${var.project}-temp-bucket"
  location = var.location
  //  storage_class = ""
  force_destroy = true
}

resource "google_storage_bucket" "functions" {
  name     = "${var.project}-functions"
  location = var.location
  //  storage_class = ""
  force_destroy = true
}

resource "google_storage_bucket" "be_logs_bucket" {
  name     = "${var.project}-${var.be_logs_bucket}"
  location = var.location
  //  storage_class = ""
  force_destroy = true
}

// Storage with retention
resource "google_storage_bucket" "agent-logs-bucket" {
  name          = "${var.project}-${var.agent_logs_bucket}"
  force_destroy = true
  location      = var.location
  retention_policy {
    retention_period = "6000"
  }
  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE" // type = "Delete"
    }
  }
}

