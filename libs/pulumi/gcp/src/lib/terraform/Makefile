PROJECT_ID=mussia8
APP_REGION=europe-west1

# define get-secret
# $(shell gcloud secrets versions access latest --secret=$(1) --project=$(PROJECT_ID))
# endef
#define get-secret
#$(shell gcloud auth print-access-token)
#endef



create-file:
#	export MONGO_URI=$(gcloud secrets versions access latest --secret=MONGO_URI)
#	echo $(MONGO_URI)
	export MONGO_URI=gcp:///MONGO_URI
	echo $(MONGO_URI)
#  gcp-get-secret bash -c "echo $MYSQL_PASSWORD"
#	echo $GOOGLE_CLIENT_SECRET > .env.dev
#	echo $(GOOGLE_CLIENT_SECRET) > .env.dev
#	echo "Ars=sd" > .env.dev
#	echo "append this text" >> .env.dev

use-sa:
	gcloud auth list
projects:
	gcloud projects list --impersonate-service-account=general-sa@mussia8.iam.gserviceaccount.com
set-auth:
	gcloud config set auth/impersonate_service_account sa-general-sa@mussia8.iam.gserviceaccount.com
unset-auth:
	gcloud config unset auth/impersonate_service_account
test-gcs:
	gsutil -i yuris-persona-sa@mussia8.iam.gserviceaccount.com ls
get-token:
	gcloud auth print-access-token

ti:
	terraform init
td:
	terraform destroy -auto-approve
ta:
	#TF_VAR_identity=${gcloud auth print-access-token}
	#echo get-secret
	#echo !!!!!!!!!! $TF_VAR_identity
	#gcloud auth print-access-token
	terraform apply -auto-approve
tv:
	terraform validate

db-ip:
	nslookup cluster0-shard-00-00.rdmew.mongodb.net

ds:
	MONGO_URI=$(gcloud secrets versions access latest --secret=GOOGLE_CLIENT_SECRET)
	echo $MONGO_URI
#	MONGO_URI=gcloud secrets versions access latest --secret=MONGO_URI --project=mussia8
	#echo here $MONGO_URI
	#MONGO_URI=$MONGO_URI docker-compose up bi-service
	#docker-compose up bi-service
