variable "project" {
  default = "mussia8"
}
variable "location" {
  default = "europe-west1"
}

variable "zone" {
  default = "europe-west1-c"
}

variable "be_logs_bucket" {
  default = "be-logs-raw-data"
}

variable "agent_logs_bucket" {
  default = "agent-logs-raw-data"
}

variable "bucketName" {
  default = "be-events-raw-data"
}



// examples
variable "prefix" {
  default = ["Mr", "Mrs", "Sir"]
  type    = list(string)
}

variable "file-content" {
  type = map(string)
  default = {
    "statement1" : "we love pets!"
    "statement2" : "we love animals!"
  }
}
variable "pet-count" {
  type = map(number)
  default = {
    "statement1" : "1"
    "statement2" : "4"
  }
}


variable "bella" {
  type = object({
    name        = string
    color       = string
    age         = number
    food        = list(string)
    favoritePet = bool
  })

  default = {
    name        = "bella"
    color       = "red"
    age         = 28
    food        = ["fish", "meat", "fruits", "cakes"]
    favoritePet = true
  }
}
