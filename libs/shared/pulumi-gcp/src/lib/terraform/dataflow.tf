
resource "google_dataflow_job" "pubsub_stream" {
  name              = "ps-to-text-be-logs"
  template_gcs_path = "gs://dataflow-templates/latest/Cloud_PubSub_to_GCS_Text"
  temp_gcs_location = "${google_storage_bucket.temp_folder.url}/temp"
  parameters = {
    inputTopic           = google_pubsub_topic.be_logs.id
    outputDirectory      = "${google_storage_bucket.be_logs_bucket.url}/text"
    outputFilenamePrefix = "ps-to-text-be-logs"
  }
  on_delete = "cancel"
}


resource "google_dataflow_job" "pubsub_stream2" {
  name              = "ps-to-avro-be-logs"
  template_gcs_path = "gs://dataflow-templates/latest/Cloud_PubSub_to_Avro"
  temp_gcs_location = "${google_storage_bucket.temp_folder.url}/temp"
  parameters = {
    inputTopic        = google_pubsub_topic.be_logs.id
    outputDirectory   = "${google_storage_bucket.be_logs_bucket.url}/avro"
    avroTempDirectory = "${google_storage_bucket.be_logs_bucket.url}/temp"
  }
  on_delete = "cancel"
}

resource "google_dataflow_job" "bigquery-stream" {
  name              = "ps-to-bq-be-logs"
  template_gcs_path = "gs://dataflow-templates-europe-north1/latest/PubSub_to_BigQuery"
  temp_gcs_location = "${google_storage_bucket.temp_folder.url}/temp"
  parameters = {
    inputTopic="projects/mussia8/topics/be_logs"
    outputTableSpec="mussia8:example_dataset.bar"
  }
  on_delete = "cancel"
}


// 104.155.115.194:27017,35.187.160.255:27017,34.77.48.52:27017
// gcloud beta dataflow flex-template run
// --template-file-gcs-location
// gs://dataflow-templates-us-central1/latest/flex/Cloud_PubSub_to_MongoDB
//--region us-central1 --parameters
//inputSubscription=projects/mussia8/subscriptions/be_logs.some_sub,
//mongoDBUri=104.155.115.194:27017,35.187.160.255:27017,34.77.48.52:27017,
//database=test,
//collection=events,
//deadletterTable=mussia8:example_dataset.agent_logs
