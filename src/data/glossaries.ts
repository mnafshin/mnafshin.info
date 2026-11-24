import type { SectionId } from '../lib/site';

/** One glossary term, always pointing at a published article in that section. */
export type CuratedTerm = {
  term: string;
  definition: string;
  articleId: string;
};

/**
 * Key terms for sections that do not use one article per term.
 * Termsplained is built from published concept articles instead
 * (see `loadSectionGlossary` in `src/lib/glossary.ts`).
 * Channel bots should add a row here when they publish an article
 * that introduces a named term; the build drops any row whose
 * article is missing, a draft, or a weekly review.
 */
export const CURATED_GLOSSARIES: Partial<Record<SectionId, CuratedTerm[]>> = {
  spring: [
    {
      term: 'Auto-configuration',
      articleId: 'auto-configuration',
      definition:
        'Spring Boot builds the usual beans from what is on the classpath. Start with --debug to see why each one applied or was skipped.',
    },
    {
      term: '@ConditionalOnMissingBean',
      articleId: 'auto-configuration',
      definition:
        'A condition that tells Boot to create its bean only if you have not already defined one, so your own bean wins in that place.',
    },
    {
      term: 'Bean lifecycle',
      articleId: 'bean-lifecycle',
      definition:
        'The path a Spring bean follows: the container constructs it, injects its dependencies, runs setup, hands it out, and runs cleanup when the container closes.',
    },
    {
      term: '@PostConstruct',
      articleId: 'bean-lifecycle',
      definition:
        'The usual place for setup that needs the finished bean. It runs after injection, not in a constructor that still has null fields.',
    },
    {
      term: 'Circular dependency',
      articleId: 'circular-dependencies',
      definition:
        'Two beans that need each other to be created. Spring Boot refuses the loop at startup; the sound fix is to extract the shared part or publish an event.',
    },
    {
      term: '@ConfigurationProperties',
      articleId: 'configuration-properties-profiles-and-spel',
      definition:
        'A type-safe way to bind a group of external settings to a record or class and validate them at startup, instead of reading keys one by one.',
    },
    {
      term: 'Profile',
      articleId: 'configuration-properties-profiles-and-spel',
      definition:
        'A named set of settings and beans, such as for tests or production. Profile files hold only what changes, and @Profile switches beans without an if in the code.',
    },
    {
      term: 'SpEL',
      articleId: 'configuration-properties-profiles-and-spel',
      definition:
        'The Spring Expression Language. Use it sparingly; @ConfigurationProperties does not evaluate it.',
    },
    {
      term: 'Dependency injection',
      articleId: 'dependency-injection-and-the-container',
      definition:
        'A class asks for the helpers it needs, usually in its constructor, instead of building them itself. The container creates those objects and passes them in.',
    },
    {
      term: 'Spring container',
      articleId: 'dependency-injection-and-the-container',
      definition:
        'The part of Spring that creates beans, injects their collaborators, and manages their lifecycle. A missing or duplicate bean fails at startup.',
    },
    {
      term: 'HTTP request',
      articleId: 'how-a-java-web-app-works',
      definition:
        'A client message that names a method and a path. The server answers with a status code and, often, a body such as JSON; the server never calls first.',
    },
    {
      term: 'REST API',
      articleId: 'rest-apis-crud-errors-and-versioning',
      definition:
        'An HTTP API where the URL picks the resource and the method picks the action, with status codes such as 200, 201, 204 and 404.',
    },
    {
      term: 'ProblemDetail',
      articleId: 'rest-apis-crud-errors-and-versioning',
      definition:
        'The standard JSON shape for an HTTP error body. One @RestControllerAdvice can turn exceptions into ProblemDetail responses that name what went wrong.',
    },
    {
      term: 'API versioning',
      articleId: 'rest-apis-crud-errors-and-versioning',
      definition:
        'Keeping the old contract when a response must change, and choosing the new one with a version in the path or a header.',
    },
    {
      term: 'Spring proxy',
      articleId: 'how-spring-proxies-work',
      definition:
        'A stand-in object Spring puts in front of a bean so annotations such as @Transactional and @Async can run. A call that does not go through the proxy skips that behaviour.',
    },
    {
      term: 'Self-call trap',
      articleId: 'how-spring-proxies-work',
      definition:
        'When a method on a bean calls another method on the same object with this, the call never goes through the proxy, so the annotation on the second method does not run.',
    },
    {
      term: 'JdbcClient',
      articleId: 'jdbcclient-and-flyway',
      definition:
        'The fluent SQL client Spring Boot builds for you. You write the SQL, bind parameters, and map each row to a record.',
    },
    {
      term: 'Flyway',
      articleId: 'jdbcclient-and-flyway',
      definition:
        'A tool that runs numbered SQL migration files, such as V1__create_products.sql in db/migration, when the application starts.',
    },
    {
      term: 'RestClient',
      articleId: 'restclient-and-http-service-clients',
      definition:
        'The HTTP client Spring Boot provides for calling another API. You set a base URL on the builder, then send requests with get(), uri() and retrieve().',
    },
    {
      term: 'HTTP Service Client',
      articleId: 'restclient-and-http-service-clients',
      definition:
        'An interface that describes HTTP calls with annotations such as @GetExchange. You register it in a named group and set that group\'s base URL in configuration.',
    },
    {
      term: '@SpringBootApplication',
      articleId: 'spring-boot-4-from-zero',
      definition:
        'The annotation on a Spring Boot main class that turns on auto-configuration, component scanning and configuration. Keep your classes in that package or below.',
    },
    {
      term: 'Starter',
      articleId: 'starters-and-the-bom',
      definition:
        'A list of dependencies, not code. Adding a starter, such as the web starter, decides which libraries arrive on the classpath.',
    },
    {
      term: 'BOM',
      articleId: 'starters-and-the-bom',
      definition:
        'The bill of materials: a list of version rules. With the Spring Boot BOM, you usually write no versions on managed dependencies, and one Boot upgrade moves the tested stack together.',
    },
  ],
  security: [
    { term: 'Asset', articleId: 'what-secure-software-means', definition: 'Something worth protecting in the software, such as a team\'s notes or a user\'s login.' },
    { term: 'Threat', articleId: 'what-secure-software-means', definition: 'Something that could harm an asset. It exists outside your code; you cannot fix it, only close the ways in.' },
    { term: 'Vulnerability', articleId: 'what-secure-software-means', definition: 'A weakness in your own software that a threat can use to reach an asset.' },
    { term: 'Risk', articleId: 'what-secure-software-means', definition: 'The chance that a threat will use a weakness, together with the harm that would follow.' },
    { term: 'Control', articleId: 'what-secure-software-means', definition: 'A measure that reduces a risk, usually to an acceptable level rather than to zero.' },
    { term: 'Broken access control', articleId: 'what-secure-software-means', definition: 'Letting a user read or change data they should not, such as another team\'s record. Number one in the OWASP Top 10:2025.' },
    { term: 'Secure by design', articleId: 'secure-by-design-lifecycle', definition: 'Building security into how software is planned, written, reviewed and maintained, instead of checking it at the end.' },
    { term: 'SSDF', articleId: 'secure-by-design-lifecycle', definition: 'NIST\'s Secure Software Development Framework (SP 800-218): four groups of practices, prepare, protect, produce and respond, added to any development process.' },
    { term: 'Definition of done', articleId: 'secure-by-design-lifecycle', definition: 'The team\'s list of what makes a feature finished. Adding a security line means no feature is done without it.' },
    { term: 'Threat modeling', articleId: 'threat-modeling-in-30-minutes', definition: 'A structured way to ask what could go wrong in a system and what to do about it, following four questions.' },
    { term: 'Data-flow diagram', articleId: 'threat-modeling-in-30-minutes', definition: 'A simple sketch of a system: boxes for its parts and arrows for the data that moves between them.' },
    { term: 'Trust boundary', articleId: 'threat-modeling-in-30-minutes', definition: 'The point where data crosses from places you do not control, such as the browser, into your own trusted code.' },
    { term: 'STRIDE', articleId: 'threat-modeling-in-30-minutes', definition: 'Six threat prompts: spoofing, tampering, repudiation, information disclosure, denial of service and elevation of privilege.' },
  ],
  db: [
    {
      term: 'Relational model',
      articleId: '01-relational-model-and-sql',
      definition:
        'Facts live in tables. A table holds one kind of fact, rows are the facts, columns are properties, and shared ids are the relationships between tables.',
    },
    {
      term: 'SQL',
      articleId: '01-relational-model-and-sql',
      definition:
        'The language you use to ask questions across those tables, including filters, joins and aggregates.',
    },
    {
      term: 'Join',
      articleId: '01-relational-model-and-sql',
      definition:
        'A way to combine rows from two tables. An inner join keeps only matching pairs; a left join keeps every left row and fills the gaps with NULL.',
    },
    {
      term: 'EXISTS',
      articleId: '01-relational-model-and-sql',
      definition:
        'A test that asks only whether a matching row exists in another table. Use a join when you need that table\'s columns, and EXISTS or NOT EXISTS when you only need a yes or no.',
    },
    {
      term: 'Primary key',
      articleId: '02-keys-constraints-normalization',
      definition:
        'The column, or columns, that uniquely identify a row. A surrogate key is a value created for that job; natural values such as email stay UNIQUE.',
    },
    {
      term: 'Constraint',
      articleId: '02-keys-constraints-normalization',
      definition:
        'A rule the database enforces on every write, such as NOT NULL, UNIQUE, CHECK or a foreign key. The database sees every write, including ones that skip the app.',
    },
    {
      term: 'Normalization',
      articleId: '02-keys-constraints-normalization',
      definition:
        'Designing tables so that, up to third normal form, each cell holds one value and every column depends on the key, the whole key, and nothing but the key.',
    },
  ],
  k8s: [
    {
      term: 'Container',
      articleId: 'containers-images-and-orchestration',
      definition:
        'An ordinary process with its own files, network view and resource limits, sharing the host\'s kernel.',
    },
    {
      term: 'Image',
      articleId: 'containers-images-and-orchestration',
      definition:
        'The read-only, layered package a container starts from. One image can start many containers. Tags can move; a digest always means the same content.',
    },
    {
      term: 'Orchestrator',
      articleId: 'containers-images-and-orchestration',
      definition:
        'A system, such as Kubernetes, that schedules, heals, scales and rolls out many containers across many machines, and helps them find each other.',
    },
  ],
  'system-design': [
    {
      term: 'Synchronous call',
      articleId: 'sd01-sync-vs-async',
      definition:
        'A request that waits for an answer before the caller can continue. Use it when the caller needs the result to give its own answer.',
    },
    {
      term: 'Asynchronous message',
      articleId: 'sd01-sync-vs-async',
      definition:
        'A message the sender hands off and then moves on, without waiting for a reply. Use it when the work only needs to know that something happened and can finish a little later.',
    },
    {
      term: 'Event',
      articleId: 'sd01-sync-vs-async',
      definition:
        'A record of a past fact, such as OrderAccepted. If you need a specific service to act, send a command instead.',
    },
    {
      term: 'REST',
      articleId: 'sd02-rest-vs-grpc-part1',
      definition:
        'An HTTP style that models resources, usually with JSON. It still fits browsers, public APIs and simple services with few callers.',
    },
    {
      term: 'gRPC',
      articleId: 'sd02-rest-vs-grpc-part1',
      definition:
        'A way to model function calls between services you own, with protobuf over HTTP/2, smaller messages, streaming and deadlines. Always set a deadline; there is none by default.',
    },
    {
      term: 'Protocol buffer',
      articleId: 'sd02-rest-vs-grpc-part1',
      definition:
        'The contract language for gRPC. Version the package, never reuse field numbers, keep _UNSPECIFIED = 0, and check breaking changes in CI.',
    },
    {
      term: 'gRPC-JSON transcoding',
      articleId: 'sd02-rest-vs-grpc-part2',
      definition:
        'A way for one gRPC service to also serve HTTP/JSON, using HTTP rules in the .proto file. A proxy such as Envoy or grpc-gateway does the translation.',
    },
    {
      term: 'Event bridge',
      articleId: 'sd02-rest-vs-grpc-part2',
      definition:
        'A component that turns facts from call-based services into events, and can turn events back into calls. Put it after the commit, in one owned place, with its event shape treated as a contract.',
    },
    {
      term: 'Queue',
      articleId: 'sd03-queues-vs-logs',
      definition:
        'A buffer that holds work until one consumer handles it and deletes it. Use a queue for jobs one team works through. It does not remove duplicates for you.',
    },
    {
      term: 'Log',
      articleId: 'sd03-queues-vs-logs',
      definition:
        'An append-only record of messages that many readers can replay, each tracking its own offset. Kafka is the usual example; use a log for shared facts that several teams read.',
    },
  ],
};
