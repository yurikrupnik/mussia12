

resource "google_pubsub_topic" "be_logs" {
  name = "be_logs"
  message_storage_policy {
    allowed_persistence_regions = [
      var.location,
    ]
  }
  depends_on = [google_pubsub_schema.events_schema1]
  schema_settings {
    schema   = google_pubsub_schema.events_schema1.id
    encoding = "JSON"
  }
}

resource "google_pubsub_topic" "dl-be-logs" {
  name = "dl-be-logs"
}

resource "google_pubsub_subscription" "be-logs-sub1" {
  name  = "stam-test-subscription"
  topic = google_pubsub_topic.be_logs.name
  labels = {
    type = "be-logs"
  }

  # 20 minutes
  message_retention_duration = "1200s"
  retain_acked_messages      = true

  ack_deadline_seconds = 20

  expiration_policy {
    ttl = "300000.5s"
  }
  retry_policy {
    minimum_backoff = "10s"
  }
  depends_on              = [google_pubsub_topic.dl-be-logs]
  enable_message_ordering = false
  dead_letter_policy {
    dead_letter_topic     = google_pubsub_topic.dl-be-logs.id
    max_delivery_attempts = 10
  }
}
