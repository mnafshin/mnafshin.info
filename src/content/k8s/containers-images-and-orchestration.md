---
title: 'Containers, Images and Why We Need Orchestration'
description: What a container and an image really are, how an image is named, layered and shipped through a registry, and why running many containers on many machines needs an orchestrator such as Kubernetes.
pubDate: '2026-11-19T12:00:00Z'
section: k8s
topic: containers-and-images
tags: [containers, images, registry, orchestration, kubernetes]
draft: false
---

A container is your application running as an ordinary process that has been given its own private world: its own files, its own view of the network and its own share of CPU and memory. An image is the package that container starts from. Once you have many containers spread over several machines, something has to decide where they run and keep them running. That something is an orchestrator, and Kubernetes is the one most teams use.

We will follow one small Spring Boot backend, `order-service`, from a JAR on your laptop to many copies on many machines.

## A container is a boxed-in process

Run `java -jar order-service.jar` and the app uses whatever Java version, files and settings that machine has. On the test server, a different setup can make the same JAR behave differently.

A container removes that guesswork. The Linux kernel gives the process a private filesystem, so it sees only the files that came with it. It sees only its own processes and network interfaces, and it can be capped to, say, one CPU and 512 MB of memory.

Unlike a virtual machine, a container does not boot its own operating system. All containers on a machine share the host's kernel, so they start quickly and one server can run dozens of them. A VM isolates more strongly, which is why containers often run on top of VMs.

## An image is the package a container starts from

The container's private files come from an image: a read-only bundle with the operating system files, the Java runtime, your JAR and the command to start it.

A Java picture helps: an image is like a class, and a container is like an object. You build the image once and start as many containers from it as you like. Each container gets a thin writable area of its own, which disappears when the container is removed.

You describe an image in a Dockerfile:

```dockerfile
FROM eclipse-temurin:25-jre
WORKDIR /app
COPY target/order-service.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

`FROM` starts from a public image that already holds a small Linux and a Java 25 runtime. `COPY` adds your JAR, and `ENTRYPOINT` says what to run.

## Layers make images cheap to rebuild and ship

An image is a stack of layers, and each layer records a set of file changes. The base image brings its layers for Linux and Java, and our `COPY` line adds one more layer holding the JAR.

Layers are identified by their content, so they are shared and reused. Change a line of Java and rebuild, and only the JAR layer is new. The build is fast, and an upload sends only the part that changed.

## Registries, tags and digests

Images are shared through a registry, a server that stores images much like Maven Central stores JARs. You build, try and push:

```bash
docker build -t registry.example.com/shop/order-service:1.4.0 .
docker run -p 8080:8080 registry.example.com/shop/order-service:1.4.0
docker push registry.example.com/shop/order-service:1.4.0
```

The name has three parts: the registry (`registry.example.com`), the repository (`shop/order-service`) and the tag (`1.4.0`). Leave out the registry and Docker assumes Docker Hub; leave out the tag and it assumes `latest`.

A tag is only a label, and on most registries labels can move: someone can push a different image as `1.4.0` tomorrow. The push also reports a digest, a `sha256:...` fingerprint of the image's content. A digest can never point to different bytes, so `order-service@sha256:...` always means exactly the image you tested.

This makes the image an immutable artifact. You build it once, and the same bytes go to test and production. What differs between environments, such as the database URL or the Spring profile, is passed in when the container starts, for example as environment variables. Rolling back means starting the previous image again.

Choosing a trustworthy base image, scanning and signing belong to container security, which the SecurityPlained section will cover.

## Many containers need an orchestrator

On your laptop, `docker run` is enough. In production you want three copies of `order-service`, plus `payment-service`, `checkout-service` and more, spread over several machines. Now questions arise:

- **Scheduling:** which machine has room for the next copy?
- **Self-healing:** who restarts a crashed container at 3 a.m., or replaces a machine that died?
- **Scaling:** who adds copies when traffic triples, and removes them later?
- **Rollouts:** how do you move from 1.4.0 to 1.5.0 without downtime, and back again?
- **Service discovery:** copies come and go and their addresses change, so how does `checkout-service` find a healthy `order-service`?

Scripts can answer each one, but that work grows with every service. An orchestrator answers them all in one system.

## A first look at Kubernetes

Kubernetes works by desired state. You do not say "start a container on server 2". You describe what should be true, and it keeps it true:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
spec:
  replicas: 3
  selector:
    matchLabels: { app: order-service }
  template:
    metadata:
      labels: { app: order-service }
    spec:
      containers:
        - name: order-service
          image: registry.example.com/shop/order-service:1.4.0
```

This asks for three running copies of our image. Kubernetes picks machines for them, replaces any copy that dies, and swaps copies gradually when you change the tag to `1.5.0`. Spring developers know the idea from [dependency injection](https://mnafshin.info/spring/dependency-injection-and-the-container/): you declare beans and the Spring container wires them. Kubernetes does the same for running processes.

Kubernetes does not build your code or images; you hand it finished images. Its architecture, Pods, Deployments, Services and autoscaling each get their own article later in this series.

## Recap

- A container is an ordinary process with its own files, network view and resource limits, sharing the host's kernel.
- An image is the read-only, layered package a container starts from; one image can start many containers.
- An image name is registry, repository and tag. Tags can move; a digest always means the same content.
- Build once and run the same image everywhere, passing configuration in from outside.
- Many containers on many machines need scheduling, self-healing, scaling, rollouts and service discovery: the job of an orchestrator like Kubernetes.

## Sources

Official documentation and well-known tutorials read while writing this article. The wording here is our own.

- [Kubernetes documentation: Overview](https://kubernetes.io/docs/concepts/overview/)
- [Kubernetes documentation: Images](https://kubernetes.io/docs/concepts/containers/images/)
- [Kubernetes documentation: Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [Docker Docs: What is a container?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)
- [Docker Docs: Understanding the image layers](https://docs.docker.com/get-started/docker-concepts/building-images/understanding-image-layers/)
- [Open Container Initiative: Image Format Specification](https://github.com/opencontainers/image-spec/blob/main/spec.md)
- [Spring guide: Spring Boot with Docker](https://spring.io/guides/gs/spring-boot-docker)
- [Red Hat: What is container orchestration?](https://www.redhat.com/en/topics/containers/what-is-container-orchestration)
- [freeCodeCamp: A Beginner-Friendly Introduction to Containers, VMs and Docker](https://www.freecodecamp.org/news/a-beginner-friendly-introduction-to-containers-vms-and-docker-79a9e3e119b/)
