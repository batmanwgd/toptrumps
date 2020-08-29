up:
	docker-compose up -d --force-recreate battle

logs:
	docker-compose logs -f

install:
	docker-compose run --rm battle "npm install"

into:
	docker-compose exec battle bash

unrootify:
	sudo chown -R $$(id -u):$$(id -g) .

build:
	docker-compose run --rm battle "npm run build"
