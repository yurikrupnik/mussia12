ra:
	npx nx run-many --target=serve --all --parallel --maxParallel=6


build-nx:
	docker-compose -f docker-compose.nx.yml build --force-rm

rebuild-nx-docker:
	docker rmi eu.gcr.io/mussia8/nx
	make build-nx
