import type { CollectionEntry } from 'astro:content';
import { getSectionConceptArticles } from './articles';
import type { CurriculumTopic } from './curriculum-topics';

export {
  articleCodeLinks,
  isPublicVideo,
  publicRelatedShorts,
  publicRelatedVideos,
  type RelatedVideo,
} from './articles';

export type SpringArticle = CollectionEntry<'spring'>;

/**
 * Learning order of the concept articles on /spring/. Articles that are not
 * listed here follow, newest first.
 */
export const CONCEPT_ORDER = [
  'how-a-java-web-app-works',
  'spring-boot-4-from-zero',
  'starters-and-the-bom',
  'dependency-injection-and-the-container',
  'configuration-properties-profiles-and-spel',
  'bean-lifecycle',
  'how-spring-proxies-work',
  'circular-dependencies',
  'auto-configuration',
  'rest-apis-crud-errors-and-versioning',
] as const;

/** Published concept articles, in learning order. */
export async function getConceptArticles(): Promise<SpringArticle[]> {
  return (await getSectionConceptArticles('spring', CONCEPT_ORDER)) as SpringArticle[];
}

/**
 * Remaining SpringUniverse tutorials from the channel curriculum
 * (docs/CURRICULUM.md in mnafshin/springuniverse-channel), after the
 * modules that already have published articles (T0.1–T6.3). Listed as
 * upcoming on /spring/ until the matching article is written. Modules
 * 0–6 are not repeated here: those tutorials were combined or split
 * into the published articles, so a 1:1 list would not fit cleanly.
 */
export const SPRING_UPCOMING_CURRICULUM: readonly CurriculumTopic[] = [
  { id: 'T7.1', group: '7. Calling other services: RestClient and HTTP interfaces', title: 'RestClient and declarative HTTP Service Clients (@HttpExchange) with Boot 4 auto-configuration' },
  { id: 'T8.1', group: '8. Data access with JdbcClient', title: 'Plain SQL the modern way: JdbcClient, row mapping, exception translation, Flyway migrations' },
  { id: 'T9.1', group: '9. Spring Data JPA', title: 'Entities, repositories and derived queries with Hibernate 7' },
  { id: 'T9.2', group: '9. Spring Data JPA', title: 'Relationships, N+1, fetch strategies, projections, paging' },
  { id: 'T10.1', group: '10. Transactions', title: '@Transactional explained: boundaries, propagation, isolation, rollback rules, testing' },
  { id: 'T11.1', group: '11. Testing', title: 'Testing pyramid in Spring: JUnit 6, @SpringBootTest, test slices (@WebMvcTest, @DataJpaTest), @MockitoBean, RestTestClient' },
  { id: 'T11.2', group: '11. Testing', title: 'Real databases in tests with Testcontainers 2 and @ServiceConnection' },
  { id: 'T12.1', group: '12. AOP and cross-cutting concerns', title: 'AOP: problems it solves, aspects, pointcuts, advice types, and where Spring already uses it' },
  { id: 'T13.1', group: '13. Spring Security 7', title: 'Security basics: the filter chain, SecurityFilterChain bean, users, password encoding' },
  { id: 'T13.2', group: '13. Spring Security 7', title: 'Authorization: URL rules, method security, roles vs authorities' },
  { id: 'T13.3', group: '13. Spring Security 7', title: 'Stateless APIs: JWT resource server and OAuth2 login' },
  { id: 'T14.1', group: '14. Actuator and observability', title: 'Production-ready: Actuator endpoints, health, Micrometer metrics, tracing with the OpenTelemetry starter' },
  { id: 'T15.1', group: '15. Resilience and concurrency', title: 'Built-in resilience in Framework 7 (@Retryable, RetryTemplate, @ConcurrencyLimit) plus virtual threads in practice' },
  { id: 'T16.1', group: '16. Messaging', title: 'Spring for Apache Kafka 4: producers, @KafkaListener, errors and retries' },
  { id: 'T16.2', group: '16. Messaging', title: 'JMS with the new JmsClient, and when to choose a queue vs a log' },
  { id: 'T17.1', group: '17. Microservices with Spring Cloud', title: 'When (not) to split: a service pair with Config Server, discovery (Eureka) and Gateway' },
  { id: 'T17.2', group: '17. Microservices with Spring Cloud', title: 'Fault tolerance between services: circuit breaker, timeouts, tracing across services' },
  { id: 'T18.1', group: '18. Packaging and deployment', title: 'Executable JARs, container images with buildpacks, GraalVM native images, graceful shutdown' },
  { id: 'T19.1', group: '19. Upgrading to Boot 4 / Framework 7', title: 'Migrating a Boot 3.5 app to Boot 4: modules, Jackson 3, JUnit 6, renamed properties, OpenRewrite' },
];
