run-many:
	npx nx run-many --target=${target} --projects=${projects} --parallel=true
# example to run: make ra target=lint projects=fullstack-bi-service
ra:
	npx nx run-many --target=${target} --parallel --all --maxParallel=6
# example to run: make ra target=lint


graph:
	npx nx dep-graph
affected-graph:
	npx nx affected:dep-graph

# Docker
build-nx:
	docker-compose -f docker-compose.nx.yml build --force-rm
rebuild-nx-docker:
	docker rmi eu.gcr.io/mussia8/nx
	make build-nx
