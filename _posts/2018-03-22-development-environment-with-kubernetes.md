---
layout: post
title: Development Environment With Kubernetes
date: 2018-03-22 16:12 -0700
---

Currently Work in progress; A basic `deployment` to expose MySQL, PostgreSQL,
and Redis to your cluster

```yaml
kind: Deployment
apiVersion: apps/v1beta1
metadata:
  name: datastores
spec:
  replicas: 1
  selector:
    matchLabels:
      app: datastores
  template:
    metadata:
      labels:
        app: datastores
    spec:
      containers:
        - image: redis:latest
          name: redis
          command:
            - /bin/bash
            - -c
            - redis-server --requirepass password
          ports:
            - containerPort: 11211
              name: redis
        - image: postgres:latest
          name: postgres
          ports:
            - containerPort: 5432
              name: postgres
          env:
            - name: POSTGRES_PASSWORD
              value: password
        - image: mysql:latest
          name: mysql
          ports:
            - containerPort: 3306
          env:
            - name: MYSQL_ROOT_PASSWORD
              value: password
# ---
# kind: Service
# apiVersion: v1
# metadata:
#   name: datastores
# spec:
#   ports:
#     - name: redis
#       port: 11211
#     - name: postgres
#       port: 5432
#     - name: mysql
#       port: 3306
#   selector:
#     app: datastores
---
kind: Service
apiVersion: v1
metadata:
  name: mysql
spec:
  ports:
    - name: mysql
      port: 3306
  selector:
    app: datastores
---
kind: Service
apiVersion: v1
metadata:
  name: postgres
spec:
  ports:
    - name: postgres
      port: 5432
  selector:
    app: datastores
---
kind: Service
apiVersion: v1
metadata:
  name: redis
spec:
  ports:
    - name: redis
      port: 11211
  selector:
    app: datastores
```
