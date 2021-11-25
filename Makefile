GCP_PROJECT:=gcloud config get-value project


define get-secret
$(shell gcloud secrets versions access latest --secret=MONGO_URI --project=mussia12-333121)
endef


# NX start
ra:
	#call geg-secret
	DB=$(call get-secret,$(MONGO_URI))
	echo $GCP_PROJECT
	echo $DB
	#npx nx run-many --target=${target} --parallel --all --maxParallel=10
  # example to run: make ra target=lint

run-many:
	npx nx run-many --target=${target} --projects=${projects} --parallel=true --maxParallel=10

graph:
	npx nx dep-graph
affected-graph:
	npx nx affected:dep-graph
# NX end

build-nx:
	docker-compose -f docker-compose.nx.yml build --force-rm

rebuild-nx-docker:
	docker rmi eu.gcr.io/mussia8/nx
	make build-nx

to-kube:
	kompose convert

# Kubectl start
once:
	gcloud alpha artifacts packages list --limit=5 --repository=eu.gcr.io --location=europe
kube-start:
	minikube start
	kubectl apply -f kube/deployment.yaml
	minikube service nginx-serivce --url
	minikube dashboard
	minikube ssh
	# auth part
kube-stop:
	kubectl delete -f kube/deployment.yaml
	minikube stop
	minikube delete

kube-secret:
	kubectl get secrets

docker-config:
	docker login -u yurikrupnik --password=WAG0jech7jes-clic
	gcloud iam service-accounts list
	scp -i $(minikube ssh-key) docker@$(minikube ip):.docker/config.json .docker/config.json
# Kubectl end

# k3s start

# k3s end

# Docker helpers

# clean running images
docker-clean:
	docker rm $(docker ps -aq)

deploy-cluster-example:
	gcloud beta container --project "mussia8" clusters create "cost-optimized-cluster-1" \
  --zone "europe-west1-d" --no-enable-basic-auth --cluster-version \
  "1.20.10-gke.1600" --release-channel "regular" --machine-type \
  "e2-medium" --image-type "COS_CONTAINERD" --disk-type "pd-standard" \
  --disk-size "100" --metadata disable-legacy-endpoints=true \
  --scopes "https://www.googleapis.com/auth/devstorage.read_only","https://www.googleapis.com/auth/logging.write","https://www.googleapis.com/auth/monitoring","https://www.googleapis.com/auth/servicecontrol","https://www.googleapis.com/auth/service.management.readonly","https://www.googleapis.com/auth/trace.append" \
  --max-pods-per-node "110" --num-nodes "3" --logging=SYSTEM,WORKLOAD --monitoring=SYSTEM \
  --enable-ip-alias --network "projects/mussia8/global/networks/default" --subnetwork \
  "projects/mussia8/regions/europe-west1/subnetworks/default" --no-enable-intra-node-visibility \
  --default-max-pods-per-node "110" --enable-autoscaling --min-nodes "0" --max-nodes "3" \
  --no-enable-master-authorized-networks --addons HorizontalPodAutoscaling,HttpLoadBalancing,GcePersistentDiskCsiDriver \
  --enable-autoupgrade --enable-autorepair --max-surge-upgrade 1 --max-unavailable-upgrade 0 \
  --enable-autoprovisioning --min-cpu 2 --max-cpu 6 --min-memory 8 --max-memory 24 --enable-autoprovisioning-autorepair \
  --enable-autoprovisioning-autoupgrade --autoprovisioning-max-surge-upgrade 1 \
  --autoprovisioning-max-unavailable-upgrade 0 --autoscaling-profile optimize-utilization \
  --enable-vertical-pod-autoscaling --resource-usage-bigquery-dataset "nternal_gke" \
  --enable-resource-consumption-metering \
  --enable-shielded-nodes --node-locations "europe-west1-d"
