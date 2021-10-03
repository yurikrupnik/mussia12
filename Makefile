ra:
	npx nx run-many --target=${target} --parallel --all --maxParallel=10
  # example to run: make ra target=lint

run-many:
	npx nx run-many --target=${target} --projects=${projects} --parallel=true --maxParallel=10

graph:
	npx nx dep-graph
affected-graph:
	npx nx affected:dep-graph


build-nx:
	docker-compose -f docker-compose.nx.yml build --force-rm

rebuild-nx-docker:
	docker rmi eu.gcr.io/mussia8/nx
	make build-nx
