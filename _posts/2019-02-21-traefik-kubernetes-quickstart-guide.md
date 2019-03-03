---
layout: post
title: Traefik (Kubernetes) Quickstart Guide
date: 2019-02-21 01:41 -0800
---

> A VERY brief working example to get quick-started on Traefik

In this we will:

- Install Traefik.
- Install the BookInfo sample application (from Istio).
- Configure an Ingress to expose the services made available from the BookInfo application.

## Requirements

- A Kubernetes cluster with RBAC support.

## Prep

1. Get the latest release of Fabrikate from https://github.com/Microsoft/fabrikate
2. Clone https://github.com/evanlouie/fabrikate-traefik
3. Unzip the `fab` binary into the just cloned `fabrikate-traefik`

## Installation

### Traefik

```bash
# Install and materialize the Traefik helm charts
cd fabrikate-traefik
./fab install
./fab generate dev

# Apply the materialized manifests
cd generated/dev
kubectl apply --recursive -f .
```

### A Test App

```bash
# Install the test book info app from Istio
kubectl apply -f https://raw.githubusercontent.com/istio/istio/master/samples/bookinfo/platform/kube/bookinfo.yaml
```

## Exposing your App to the world (Ingress)

```yaml
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: traefik-ingress
  namespace: default
  annotations:
    kubernetes.io/ingress.class: "traefik" # In the case of having multiple ingress controllers, the type must be specified
spec:
  rules:
    - http:
        paths:
          - path: /productpage
            backend:
              serviceName: productpage
              servicePort: 9080
          - path: /login
            backend:
              serviceName: productpage
              servicePort: 9080
          - path: /logout
            backend:
              serviceName: productpage
              servicePort: 9080
          - path: /api/v1/products.*
            backend:
              serviceName: productpage
              servicePort: 9080
---
```

## Check on your services

```bash
kubectl port-forward -n traefik services/traefik-dashboard 9999:80
```

Now goto `http://localhost:9999` and you will see the newly available services.

## Common Gotchas

- Traefik will install ONE load balancer in whichever namespace it is installed into.
- For every namespace with a service you wish to expose through the Traefik LB, you need to setup a separate `Ingress` in the target namespace. Even though the Traefik LB may be in namespace `foo`, `Ingress` resources from namespaces `bar` and `baz` are required to control the routing for services in in those namespaces.
