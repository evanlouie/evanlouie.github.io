---
layout: post
title: Development With Docker-Compose
date: 2017-12-14 12:28 -0800
---

Docker's documentation leaves much to be desired as navigating it often becomes an exercise in `CMD-f`ing. I often want to use `docker-compose` for a project to get it running locally as PoC before setting up my k8s cluster. But it usually takes me longer to get the `ports` and `volumes` sorted out than I would prefer.

Here's a sample `docker-compose.yml` which marks a MongoDB container as a dependency for my web service. As all containers are accessible to each other based on the format `<protocol>://<serviceName>:<port>`, my `web` service can now ping the `mongo` service at `mongodb://mongo:27017` and be assured that the mongo container is up and running when it does; with the `mongo` service's container persisting its `/data/db` folder locally to my host machines working subdirectory `./data/db`.

```yaml
version: "3"
services:
  web:
    image: evanlouie/echoml
    ports:
      - 80:80
      - 3000:3000
      - 4000:4000
    depends_on:
      - mongo
      - redis
    environment:
      - NODE_ENV=production
  mongo:
    image: mongo
    ports:
      - 27017:27017
    volumes:
      - ./data/mongodb:/data/db
  redis:
    image: redis
    ports:
      - 6379:6379
```

Note: By default, containers can ping eachother via their service name, the `depends_on` marks one your services to require the listed ones to be started (doesn't check if "ready") before itself can start.

In order to make development easier, add `ports` mappings to expose the container ports to the host (`<hostPort>:<containerPort>`). Now you can develop locally on your host machine while having the `mongo` and `redis` containers exposed. In this example, `mongo` is accessible by the host via: `mongodb://0.0.0.0:27017` and `redis` via `redis://0.0.0.0:6379`.

This is my default dev environment I run when developing locally (minus the `web` service). Exposing to my host persistant MongoDB, PostgreSQL, and MySQL databases as well as volatile redis cache:

```yaml
version: "3"
services:
  mongo:
    image: mongo
    ports:
      - 27017:27017
    volumes:
      - ./data/mongodb:/data/db
  postgres:
    image: postgres
    ports:
      - 5432:5432
    volumes:
      - ./data/postgresql:/var/lib/postgresql/data
  mysql:
    image: mysql
    environment:
      - MYSQL_ROOT_PASSWORD=password
    ports:
      - 3306:3306
    volumes:
      - ./data/mysql:/var/lib/mysql
  redis:
    image: redis
    ports:
      - 6379:6379
```

LA(MMP)P stack? Sure!:

```yaml
version: "3"
services:
  php:
    image: php:apache
    ports:
      - 9000:80
    volumes:
      - ./:/var/www/html
  mongo:
    image: mongo
    ports:
      - 27017:27017
    volumes:
      - ./data/mongodb:/data/db
  postgres:
    image: postgres
    environment:
      - POSTGRES_PASSWORD=password
    ports:
      - 5432:5432
    volumes:
      - ./data/postgresql:/var/lib/postgresql/data
  mysql:
    image: mysql
    environment:
      - MYSQL_ROOT_PASSWORD=password
    ports:
      - 3306:3306
    volumes:
      - ./data/mysql:/var/lib/mysql
  redis:
    image: redis
    ports:
      - 6379:6379
```
