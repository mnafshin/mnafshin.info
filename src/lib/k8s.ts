import type { CollectionEntry } from 'astro:content';
import { getSectionConceptArticles, getWeeklyArticles } from './articles';
import type { CurriculumTopic } from './curriculum-topics';

export type K8sArticle = CollectionEntry<'k8s'>;

/**
 * Learning order of the KubePlained section, taken from the channel
 * curriculum (docs/CURRICULUM.md in mnafshin/kubeplained-channel,
 * Basics K01–K17, then Platform K18–K25). No articles are published yet.
 */
export const K8S_CURRICULUM: readonly CurriculumTopic[] = [
  { id: 'K01', group: 'Basics', title: 'Why containers and orchestration; images' },
  { id: 'K02', group: 'Basics', title: 'Cluster architecture: control plane and nodes' },
  { id: 'K03', group: 'Basics', title: 'Local setup: kind or minikube and kubectl basics' },
  { id: 'K04', group: 'Basics', title: 'Pods' },
  { id: 'K05', group: 'Basics', title: 'Deployments, ReplicaSets, rolling updates and rollback' },
  { id: 'K06', group: 'Basics', title: 'Services and DNS' },
  { id: 'K07', group: 'Basics', title: 'Ingress and Gateway API' },
  { id: 'K08', group: 'Basics', title: 'ConfigMaps and Secrets (usage)' },
  { id: 'K09', group: 'Basics', title: 'Probes: liveness vs readiness vs startup, graceful shutdown (e.g. readiness down when the DB is down, up when Kafka is degraded)' },
  { id: 'K10', group: 'Basics', title: 'Debugging apps in the cluster (logs, exec, port-forward, events)' },
  { id: 'K11', group: 'Basics', title: 'Resource requests and limits, QoS' },
  { id: 'K12', group: 'Basics', title: 'Autoscaling (HPA) and cluster autoscaling' },
  { id: 'K13', group: 'Basics', title: 'Storage: PV/PVC and StatefulSets' },
  { id: 'K14', group: 'Basics', title: 'Jobs and CronJobs' },
  { id: 'K15', group: 'Basics', title: 'Namespaces and RBAC basics' },
  { id: 'K16', group: 'Basics', title: 'Helm and Kustomize' },
  { id: 'K17', group: 'Basics', title: 'Local dev loop: Skaffold or Tilt' },
  { id: 'K18', group: 'Platform level', title: 'Operators and CRDs in depth' },
  { id: 'K19', group: 'Platform level', title: 'Cluster API, multi-cluster and multi-tenancy' },
  { id: 'K20', group: 'Platform level', title: 'GitOps (Flux or Argo CD) and infrastructure as code (Terraform or Crossplane)' },
  { id: 'K21', group: 'Platform level', title: 'CI/CD for container services: build, scan, image, deploy; progressive delivery (canary, blue/green)' },
  { id: 'K22', group: 'Platform level', title: 'Envoy as edge proxy, gRPC-JSON transcoding, service mesh (Istio/Linkerd), mTLS and SPIFFE identities, Cilium/eBPF' },
  { id: 'K23', group: 'Platform level', title: 'Observability: logs, metrics, traces; OpenTelemetry (W3C trace context, OTLP, Collector), Prometheus, Grafana, Jaeger, SLOs; migrating backends (e.g. ELK to Jaeger) with a collector and dual-write' },
  { id: 'K24', group: 'Platform level', title: 'Disaster recovery and resilience at cluster level' },
  { id: 'K25', group: 'Platform level', title: 'AI agents on the platform: Kagent, MCP, isolating and limiting agent access' },
];

/**
 * Learning order of published concept articles on /k8s/.
 * Entries are added when the matching article is written.
 */
export const K8S_CONCEPT_ORDER = [] as const;

/** Published KubePlained concept articles, in learning order. */
export async function getK8sConceptArticles(): Promise<K8sArticle[]> {
  return (await getSectionConceptArticles('k8s', K8S_CONCEPT_ORDER)) as K8sArticle[];
}

/** Published KubePlained weekly reviews, newest first. */
export async function getK8sWeeklies(): Promise<K8sArticle[]> {
  return (await getWeeklyArticles('k8s')) as K8sArticle[];
}
