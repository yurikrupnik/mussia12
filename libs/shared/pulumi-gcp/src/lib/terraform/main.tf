//
//
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">=3.79.0"
    }
    null = {
      source  = "hashicorp/null"
      version = ">=2.1.2"
    }
  }
}

provider "google" {
  //  credentials = file("<NAME>.json")
//  access_token = "ya29.a0ARrdaM92oNP56Bws3yDNJgPR990g9POTFal4U0a7jJAYVHdSEcNNWwOoYyXUddjzMKlpVpKGJeHOEyIoDIN-Ser7oUxVM15VFSqqBJIUs8mIuHtLObJwk6aU8ZLZCCTw-Hu-cC9nFQPrEAu-pasK3kf4Vot78oXn-6Jkq5g"
  project = var.project
  region  = var.location
  zone    = var.zone

}
//
//resource "google_service_account" "storage" {
//  account_id   = "scv-my-app-storage"
//  display_name = "My app storage SA"
//}
//
////resource "google_project_iam_member" "storage" {
////  project = var.project
////  role = "roles/storage/admin"
////  member = "serviceAccount:${google_service_account.storage.email}"
////}
//
////resource "google_compute_network" "vpc_network" {
////  name = "terraform-network"
////}
//
//// GCP Data Fusion
////resource "google_data_fusion_instance" "basic_instance" {
////  provider = google-beta
////  name = "my-instance"
////  project = var.project
////  region = var.location
////  type = "BASIC"
////}
//
//// Dataflow end
////resource "google_dataflow_job" "pubsub_stream" {
////  name = "tf-test-dataflow.tf-job1"
////  template_gcs_path = "gs://my-bucket/templates/template_file"
////  temp_gcs_location = "gs://my-bucket/tmp_dir"
////  enable_streaming_engine = true
////  parameters = {
////    inputFilePattern = "${google_storage_bucket.bucket1.url}/*.json"
////    outputTopic    = google_pubsub_topic.topic.id
////  }
////  transform_name_mapping = {
////    name = "test_job"
////    env = "test"
////  }
////  on_delete = "cancel"
////}
//
//// functions start
//resource "null_resource" "build" {
//  triggers = {
//    always_run = "${timestamp()}"
//  }
//  provisioner "local-exec" {
//    command = <<-EOF
//      node -v
//      cd ..
//      npm i
//      npm run build -- --scope=pubsub-be-logs --scope=storage-func
//    EOF
//
//    //    environment = var.environment_variables
//  }
//}
locals {
  da = "${var.project}-aris"
  null_data_source = {
    wait_for_lambda_exporter = {
      inputs = {
        lambda_dependency_id = "${null_resource.function_dependencies.id}"
        source_dir           = "${path.module}/storage-func/dist"
      }
    }
  }
}

resource "null_resource" "function_dependencies" {
  provisioner "local-exec" {
    command = <<-EOF
          node -v
          cd ..
          npx lerna exec --parallel --scope=service1 --scope=storage-func -- npm i
          npm run bootstrap
          npm run build -- --scope=pubsub-be-logs --scope=storage-func
        EOF
  }

  triggers = {
    //    index = sha256(file("${path.module}/index.js"))
    package = sha256(file("functions/pubsub-be-logs/package.json"))
    lock    = sha256(file("functions/pubsub-be-logs/package-lock.json"))
    node    = sha256(join("", fileset(path.module, "functions/pubsub-be-logs/**/*.ts")))
  }
}
//
data "null_data_source" "wait_for_function_exporter" {
  inputs = {
    lambda_dependency_id = "${null_resource.function_dependencies.id}"
    source_dir           = "${path.module}/functions/storage-func/dist"
  }
}
////
data "archive_file" "lambda" {
  output_path = "${path.module}/storage-func/function.zip"
  source_dir  = "${data.null_data_source.wait_for_function_exporter.outputs["source_dir"]}"
  type        = "zip"
}
//
////data "archive_file" "source_zip" {
////  depends_on  = [null_resource.lambda_dependencies]
////  type        = "zip"
////  source_dir  = "storage-func/dist"
////  output_path = "storage-func/dist/source.zip"
////}
//
//resource "google_storage_bucket" "bucket" {
//  //  depends_on  = [null_resource.build]
//  name = "${var.project}-terraform"
//}
//
resource "google_storage_bucket_object" "archive" {
  name   = "source.zip"
  bucket = google_storage_bucket.functions.name
  source = data.archive_file.lambda.output_path
}
////
////resource "google_storage_bucket_object" "archive1" {
////  name   = "index.zip"
////  bucket = google_storage_bucket.bucket.name
////  source = "./storage-func/index.zip"
////}
////resource "google_cloudfunctions_function" "func3" {
////  name        = "func3"
////  description = "My http function"
////  runtime     = "nodejs14"
////
////  depends_on  = [google_storage_bucket_object.archive, google_storage_bucket.bucket]
////
////  available_memory_mb = 128
////  source_archive_bucket = data.archive_file.lambda.output_base64sha256
//////  source_archive_bucket = google_storage_bucket.bucket.name
//////  source_archive_object = google_storage_bucket_object.archive.name
////  source_archive_object = data.archive_file.lambda.output_path
////  trigger_http = true
////
////  timeout     = 60
////  entry_point = "http"
////  labels = {
////    my-label = "my-label-value"
////  }
////
////  environment_variables = {
////    MY_ENV_VAR = "my-env-var-value"
////  }
////}
//resource "google_cloudfunctions_function" "func2" {
//  name        = "func2"
//  description = "My http function"
//  runtime     = "nodejs14"
//
//  depends_on = [google_storage_bucket_object.archive, google_storage_bucket.bucket]
//
//  available_memory_mb   = 128
//  source_archive_bucket = google_storage_bucket.bucket.name
//  source_archive_object = google_storage_bucket_object.archive.name
//  trigger_http          = true
//
//  timeout     = 60
//  entry_point = "http"
//  labels = {
//    my-label = "my-label-value"
//  }
//
//  environment_variables = {
//    MY_ENV_VAR = "my-env-var-value"
//  }
//}
//


//// functions end

// workflows functions


