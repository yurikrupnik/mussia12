resource "google_bigquery_dataset" "dataset" {
  dataset_id                  = "example_dataset"
  friendly_name               = "test logs"
  description                 = "This is a test description"
  location                    = "EU"
  default_table_expiration_ms = 3600000

  labels = {
    env = "default"
  }

  // Todo handle it fails with creating table
  //  access {
  //    role          = "OWNER"
  //    user_by_email = google_service_account.bqowner.email
  //  }
  //
  //  access {
  //    role   = "READER"
  //    domain = "hashicorp.com"
  //  }
}

resource "google_bigquery_table" "default2" {
  dataset_id          = google_bigquery_dataset.dataset.dataset_id
  table_id            = "agents_logs"
  deletion_protection = false
  labels = {
    env = "agents"
  }
}

resource "google_bigquery_table" "be_logs" {
  dataset_id          = google_bigquery_dataset.dataset.dataset_id
  table_id            = "be_logs"
  deletion_protection = false
  time_partitioning {
    type = "DAY"
  }

  labels = {
    env = "be"
  }
}

resource "google_bigquery_table" "agent_logs" {
  dataset_id          = google_bigquery_dataset.dataset.dataset_id
  table_id            = "agent_logs"
  deletion_protection = false

  labels = {
    env = "be"
  }
}

resource "google_bigquery_table" "be_logs_table" {
  dataset_id          = google_bigquery_dataset.dataset.dataset_id
  table_id            = "bar"
  deletion_protection = false
  time_partitioning {
    type = "MONTH"
  }
  labels = {
    env = "default"
  }
//  schema = google_pubsub_schema.events_schema1.definition.fields
//  schema = file("events-schema.json")
  schema = <<EOF
[
  {
      "name" : "stringField",
       "type": "STRING",
       "mode": "NULLABLE",
      "description": "Testing string field"
  },
  {
      "name" : "intField",
      "type": "INTEGER",
      "mode": "NULLABLE",
      "description": "Testing int field"
  },
  {
      "name" : "tenantId",
      "type": "STRING",
       "mode": "NULLABLE",
      "description": "Tenant Id"
  }
]
EOF

}


//resource "google_bigquery_table" "sheet" {
//  dataset_id = google_bigquery_dataset.dataset.dataset_id
//  table_id   = "sheet"
//
//  external_data_configuration {
//    autodetect    = true
//    source_format = "GOOGLE_SHEETS"
//
//    google_sheets_options {
//      skip_leading_rows = 1
//    }
//
//    source_uris = [
//      "https://docs.google.com/document/d/0B8Dp6BUygaT_LUtrWlM1ZWNtMms/edit?resourcekey=0-F9DrhBC_zolbpdbio9Lu4Q",
//    ]
//  }
//}
