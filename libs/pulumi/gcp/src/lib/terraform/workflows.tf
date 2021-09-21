data "google_iam_policy" "workflows_admin" {
  binding {
    role = "roles/cloudfunctions.invoker"
//    role = "roles/iam.serviceAccountUser"

    members = [
      "user:krupnik.yuri@gmail.com",
    ]
  }
}

resource "google_service_account" "test_account" {
  account_id   = "sa-workflows"
  display_name = "Workflows Service Account"
}

resource "google_service_account_iam_binding" "admin-account-iam" {
  service_account_id = "${google_service_account.test_account.name}"
  role               = "roles/cloudfunctions.serviceAgent"

  members = [
    "serviceAccount:${google_service_account.test_account.email}"
  ]
}

//resource "google_service_account_iam_policy" "admin-account-iam" {
//  service_account_id = google_service_account.test_account.name
//  policy_data        = data.google_iam_policy.workflows_admin.policy_data
//}

// ${google_cloudfunctions_function.save_to_db.https_trigger_url}

//     - readWikipedia:
//        call: http.post
//        args:
//            url: ${google_cloudfunctions_function.publish_to_client.https_trigger_url}
//            body: $${NewEventDocument.body}
//        result: ItemId


resource "google_workflows_workflow" "example" {
  name          = "update-mongo-and-clients"
  region        = "europe-west4"
  description   = "Insert new event document into mongodb and push event to the client"
//  service_account = google_service_account.test_account.id
  source_contents = <<-EOF
  # This is a sample workflow, feel free to replace it with your source code
  #
  # This workflow does the following:
  # - reads current time and date information from an external API and stores
  #   the response in CurrentDateTime variable
  # - retrieves a list of Wikipedia articles related to the day of the week
  #   from CurrentDateTime
  # - returns the list of articles as an output of the workflow
  # FYI, In terraform you need to escape the $$ or it will cause errors.
main:
  params: [input]
  steps:
    - createNewEventItem:
        call: http.post
        args:
            url: ${google_cloudfunctions_function.save_to_db.https_trigger_url}
            body:
              stringField: $${input.stringField}
              intField: $${input.intField}
              tenantId: $${input.tenantId}
        result: NewEventDocument
    - UpdateClientsOfChange:
        call: http.post
        args:
            url: ${google_cloudfunctions_function.publish_to_client.https_trigger_url}
            body: $${NewEventDocument.body}
    - returnOutput:
        return: $${NewEventDocument}
EOF
}
