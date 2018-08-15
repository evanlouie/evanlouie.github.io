---
layout: post
title: Creating OSBA Namespaced Service Instances
date: 2018-08-14 14:27 -0700
---

A TypeScript function to provision namespaced Service Instances with Service Catalog and the Open Service Broker for Azure.

This particular example provisions a Blob Storage named `foobar` in the Kubernetes namespace named `default` (ServiceBroker must already exist in this namespace) and in the Azure resource group named `testing` (Azure will create if not present) in `westus2` data-center.

<!-- <script src="https://gist.github.com/evanlouie/c00722a77caa6f217224fc4b3964399d.js"></script> -->

```typescript
const provision = (
  name: string,
  namespace: string,
  location: string,
  resourceGroup: string
) =>
  fetch(
    `http://localhost:8001/apis/servicecatalog.k8s.io/v1beta1/namespaces/${namespace}/serviceinstances`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        apiVersion: "servicecatalog.k8s.io/v1beta1",
        kind: "ServiceInstance",
        metadata: {
          name
        },
        spec: {
          serviceClassExternalName: "azure-storage",
          servicePlanExternalName: "blob-container",
          parameters: {
            location,
            resourceGroup
          }
        }
      })
    }
  );

provision("foobar", "default", "westus2", "testing");
```
