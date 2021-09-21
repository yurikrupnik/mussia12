// storage finalize for be-logs function
resource "google_cloudfunctions_function" "storage-func" {
  name        = "storage-func"
  description = "My storage function"
  runtime     = "nodejs14"

  available_memory_mb   = 256
  source_archive_bucket = google_storage_bucket.functions.name
  source_archive_object = google_storage_bucket_object.archive.name
  //  trigger_http          = true
  event_trigger {
    event_type = "google.storage.object.finalize"
    resource = google_storage_bucket.be_logs_bucket.name
  }
  timeout               = 60
  entry_point           = "storageFunc"
  labels = {
    my-label = "my-label-value1",
    func = "aris2"
  }

  environment_variables = {
    MY_ENV_VAR = "my-env-var-value"
  }
  depends_on = [google_storage_bucket.be_logs_bucket]
}

// pubsub function for be logs
resource "google_cloudfunctions_function" "topic-func" {
  name        = "topic-func"
  description = "My topic function"
  runtime     = "nodejs14"

  available_memory_mb   = 256
  source_archive_bucket = google_storage_bucket.functions.name
  source_archive_object = google_storage_bucket_object.archive.name
  event_trigger {
    event_type = "google.pubsub.topic.publish"
    resource = google_pubsub_topic.be_logs.id
  }
  timeout               = 60
  entry_point           = "storagePubSub"
  labels = {
    my-label = "my-label-d"
    func = "aris1"
  }

  environment_variables = {
    MY_ENV_VAR = "my-env-var-ffd"
  }
  depends_on = [google_pubsub_topic.be_logs]
}

resource "google_cloudfunctions_function" "workflow-func" {
  name        = "workflow-func"
  description = "My topic function"
  runtime     = "nodejs14"

  available_memory_mb   = 256
  source_archive_bucket = google_storage_bucket.functions.name
  source_archive_object = google_storage_bucket_object.archive.name
  event_trigger {
    event_type = "google.pubsub.topic.publish"
    resource = google_pubsub_topic.be_logs.id
  }
  timeout               = 60
  entry_point           = "runWorkflow"
  labels = {
    my-label = "my-label-d"
    func = "aris1"
  }

  environment_variables = {
    MY_ENV_VAR = "my-env-var-ffd"
    MY_ENV_VAR1 = "my-env-var-4"
  }
  depends_on = [google_pubsub_topic.be_logs]
}

resource "google_cloudfunctions_function" "save_to_db" {
  name        = "save-to-db"
  description = "Saving to mongodb collection per document and returns new item"
  runtime     = "nodejs14"

  available_memory_mb   = 256
  source_archive_bucket = google_storage_bucket.functions.name
  source_archive_object = google_storage_bucket_object.archive.name
  trigger_http          = true
  timeout               = 60
  entry_point           = "saveToDb"
  ingress_settings      = "ALLOW_ALL"
}

resource "google_cloudfunctions_function_iam_member" "invoker1" {
  project        = google_cloudfunctions_function.save_to_db.project
  region         = google_cloudfunctions_function.save_to_db.region
  cloud_function = google_cloudfunctions_function.save_to_db.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}

resource "google_cloudfunctions_function" "publish_ps" {
  name        = "publish-to-pubsub"
  description = "Generic function to publish event to PubSub"
  runtime     = "nodejs14"

  available_memory_mb   = 256
  source_archive_bucket = google_storage_bucket.functions.name
  source_archive_object = google_storage_bucket_object.archive.name
  trigger_http          = true
  timeout               = 60
  entry_point           = "callPubSub"
  ingress_settings      = "ALLOW_ALL"
}

resource "google_cloudfunctions_function_iam_member" "invoker2" {
  project        = google_cloudfunctions_function.publish_ps.project
  region         = google_cloudfunctions_function.publish_ps.region
  cloud_function = google_cloudfunctions_function.publish_ps.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}


resource "google_cloudfunctions_function" "publish_to_client" {
  name        = "publish-to-client"
  description = "Saving to mongodb collection per document and returns new item"
  runtime     = "nodejs14"

  available_memory_mb   = 256
  source_archive_bucket = google_storage_bucket.functions.name
  source_archive_object = google_storage_bucket_object.archive.name
  trigger_http          = true
  timeout               = 60
  entry_point           = "publishToClient"

  ingress_settings      = "ALLOW_ALL"
}

resource "google_cloudfunctions_function_iam_member" "invoker" {
  project        = google_cloudfunctions_function.publish_to_client.project
  region         = google_cloudfunctions_function.publish_to_client.region
  cloud_function = google_cloudfunctions_function.publish_to_client.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}
