resource "google_pubsub_schema" "events_schema1" {
  name       = "events-schema"
  type       = "AVRO"
  definition = file("./events-schema.json")
}
