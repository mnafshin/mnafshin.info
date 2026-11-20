// Check-yourself questions for every published article and weekly review.
// Keys are `{section}/{id}` (Spring weekly videos use the public `spring/` path).
// Each entry must have 2 or 3 questions. `scripts/check-quizzes.mjs` fails the
// build if a published page is missing them.

export type CheckQuestion = {
  prompt: string;
  choices: string[];
  answer: number;
  explain: string;
};

export const CHECK_QUESTIONS: Record<string, CheckQuestion[]> = {
  'db/01-relational-model-and-sql': [
    {
      prompt: 'In the relational model, what are tables, rows and columns?',
      choices: ['Tables are queries, rows are indexes, columns are joins', 'A table holds one kind of fact; rows are facts, columns are properties, and shared ids are the relationships', 'A table is only a file, with no structure'],
      answer: 1,
      explain: 'A table holds one kind of fact; rows are facts, columns are properties, and shared ids are the relationships.',
    },
    {
      prompt: 'What is the difference between an inner join and a left join?',
      choices: ['There is no difference', 'An inner join keeps only matching pairs; a left join keeps every left row and fills the gaps with NULL', 'A left join drops every left row that has a match'],
      answer: 1,
      explain: 'An inner join keeps only matching pairs; a left join keeps every left row and fills the gaps with NULL. Put filters on the right table in ON, not WHERE.',
    },
    {
      prompt: 'When should you use EXISTS rather than a join?',
      choices: ['When you need the other table\'s columns in the result', 'When you only need a yes or no about the other table', 'When you are grouping with HAVING'],
      answer: 1,
      explain: 'Use a join when you need the other table\'s columns, and EXISTS / NOT EXISTS when you only need a yes or no. WHERE filters rows before grouping; HAVING filters groups after aggregates.',
    },
  ],
  'db/02-keys-constraints-normalization': [
    {
      prompt: 'How should you treat a surrogate primary key and a natural value such as email?',
      choices: ['Use the email as the only primary key, and never add a surrogate', 'Use a surrogate primary key, and keep natural values like email and SKU as UNIQUE', 'Store emails without any uniqueness'],
      answer: 1,
      explain: 'Use a surrogate primary key, and keep natural values like email and SKU as UNIQUE.',
    },
    {
      prompt: 'Why do NOT NULL, UNIQUE and CHECK belong in the database, not only in the app?',
      choices: ['The database is slower, so it should do less', 'The database sees every write and handles simultaneous requests', 'The app never sees those constraints anyway'],
      answer: 1,
      explain: 'NOT NULL, UNIQUE and CHECK belong in the database, because it sees every write and handles simultaneous requests. Foreign keys stop references to missing rows; cascade only for parts of a whole.',
    },
    {
      prompt: 'What does 3NF ask, in one line?',
      choices: ['Duplicate every column for speed first', 'One value per cell, and every column depends on the key, the whole key, and nothing but the key', 'Store all facts in a single wide table'],
      answer: 1,
      explain: '1NF to 3NF in one line: one value per cell, and every column depends on the key, the whole key, and nothing but the key. A snapshot like unit_price is a separate fact, not a duplicate.',
    },
  ],
  'k8s/containers-images-and-orchestration': [
    {
      prompt: 'What is a container, in this article\'s terms?',
      choices: ['A full virtual machine with its own kernel', 'An ordinary process with its own files, network view and resource limits, sharing the host\'s kernel', 'A Git repository'],
      answer: 1,
      explain: 'A container is an ordinary process with its own files, network view and resource limits, sharing the host\'s kernel.',
    },
    {
      prompt: 'What is an image, relative to a container?',
      choices: ['The running process itself', 'The read-only, layered package a container starts from; one image can start many containers', 'The host\'s kernel'],
      answer: 1,
      explain: 'An image is the read-only, layered package a container starts from; one image can start many containers. Tags can move; a digest always means the same content.',
    },
    {
      prompt: 'Why do we need an orchestrator such as Kubernetes?',
      choices: ['A single docker run already schedules work across many machines', 'Many containers on many machines need scheduling, self-healing, scaling, rollouts and service discovery', 'Orchestrators replace images entirely'],
      answer: 1,
      explain: 'Many containers on many machines need scheduling, self-healing, scaling, rollouts and service discovery: the job of an orchestrator like Kubernetes.',
    },
  ],
  'spring/auto-configuration': [
    {
      prompt: 'How does auto-configuration decide which beans to build?',
      choices: ['It always builds every possible bean', 'It builds the usual beans from what is on the classpath', 'It reads your @RestController methods'],
      answer: 1,
      explain: 'Auto-configuration builds the usual beans from what is on the classpath; --debug prints why each one applied or was skipped.',
    },
    {
      prompt: 'When does your own bean replace Boot\'s auto-configured one?',
      choices: ['Always, for every auto-configured type', 'Only where Boot\'s bean has @ConditionalOnMissingBean', 'Never; you must exclude the class first'],
      answer: 1,
      explain: 'Prefer a property, then a customizer. Your own bean wins only where Boot\'s bean has @ConditionalOnMissingBean.',
    },
    {
      prompt: 'How do you turn one auto-configuration off?',
      choices: ['Delete the starter from the internet', 'Use spring.autoconfigure.exclude or exclude with the exact class name', 'Set @Lazy on your main class'],
      answer: 1,
      explain: 'Turn one auto-configuration off with spring.autoconfigure.exclude or exclude, using the exact class name.',
    },
  ],
  'spring/bean-lifecycle': [
    {
      prompt: 'When should you do setup that needs the finished, injected bean?',
      choices: ['In the constructor, before injection finishes', 'In @PostConstruct, after the bean is constructed and injected', 'Only in @PreDestroy'],
      answer: 1,
      explain: 'Don\'t do setup in a constructor that needs injected fields. Prefer constructor injection, and @PostConstruct for work that needs the finished bean.',
    },
    {
      prompt: 'What does @Lazy change?',
      choices: ['It skips injection', 'It delays creation, so a broken lazy bean fails only when first used', 'It prevents the bean from ever being destroyed'],
      answer: 1,
      explain: '@Lazy delays creation, so a broken lazy bean fails only when first used.',
    },
    {
      prompt: 'When do destroy callbacks run?',
      choices: ['Whenever a request ends', 'When the container closes; a kill -9 skips that cleanup', 'At a random interval'],
      answer: 1,
      explain: 'Destroy callbacks run only when the container closes. Spring Boot registers a shutdown hook, but kill -9 skips cleanup.',
    },
  ],
  'spring/circular-dependencies': [
    {
      prompt: 'What is a circular dependency in Spring?',
      choices: ['Two beans that need each other to be created', 'A bean that depends on a property file', 'A starter that imports another starter'],
      answer: 0,
      explain: 'A circular dependency is two beans that need each other to be created. Spring Boot refuses it by default.',
    },
    {
      prompt: 'What is the first fix you should try?',
      choices: ['Set allow-circular-references and use field injection', 'Extract the shared part into its own bean', 'Add @Lazy on every constructor'],
      answer: 1,
      explain: 'First choice: extract the shared part into its own bean. The flag and @Lazy only hide the cycle.',
    },
    {
      prompt: 'Why is allow-circular-references a poor fix for a constructor cycle?',
      choices: ['It cannot break a constructor cycle, and with field injection it can hand out a half-built bean', 'It always works and is the recommended default', 'It only fails in tests'],
      answer: 0,
      explain: 'allow-circular-references cannot break a constructor cycle, and with field injection it can hand out a half-built bean.',
    },
  ],
  'spring/configuration-properties-profiles-and-spel': [
    {
      prompt: 'How should you bind a group of settings in Spring Boot?',
      choices: ['Read System.getProperty in every class', 'Bind a group of keys to a @ConfigurationProperties record and validate it at startup', 'Parse application.yml by hand with a YAML library'],
      answer: 1,
      explain: 'Keep settings outside the code. Bind a group of keys to a @ConfigurationProperties record and validate it at startup.',
    },
    {
      prompt: 'Which sources beat values in committed files?',
      choices: ['Nothing; the file always wins', 'Environment variables and command-line arguments, key by key', 'Only @Value annotations'],
      answer: 1,
      explain: 'Stronger sources override weaker ones; environment variables and command-line arguments beat files.',
    },
    {
      prompt: 'Does @ConfigurationProperties evaluate SpEL?',
      choices: ['Yes, every ${} and #{} expression is evaluated', 'No; use SpEL sparingly, and not here', 'Only for secrets'],
      answer: 1,
      explain: 'Use SpEL sparingly. @ConfigurationProperties does not evaluate it. Also keep secrets out of committed files.',
    },
  ],
  'spring/dependency-injection-and-the-container': [
    {
      prompt: 'What does dependency injection ask a class to do?',
      choices: ['Build the objects it needs inside the constructor', 'Ask for what it needs in its constructor, and not build those objects itself', 'Look up beans from a static registry in every method'],
      answer: 1,
      explain: 'A class asks for what it needs in its constructor; it does not build those objects itself.',
    },
    {
      prompt: 'When does a single constructor need @Autowired?',
      choices: ['Always', 'Never; a single constructor needs no @Autowired', 'Only if the class is a @RestController'],
      answer: 1,
      explain: 'The container creates the beans and passes them in. A single constructor needs no @Autowired.',
    },
    {
      prompt: 'When should you use a @Bean method instead of @Component?',
      choices: ['For every class you write', 'For library types, or anything that needs setup, rather than your own simple classes', 'Only for tests'],
      answer: 1,
      explain: 'Use @Component for your own classes and a @Bean method for library types or anything that needs setup.',
    },
  ],
  'spring/how-a-java-web-app-works': [
    {
      prompt: 'In a typical web app, who starts the conversation?',
      choices: ['The server calls the client first', 'The client asks and the server answers', 'The database sends the first request'],
      answer: 1,
      explain: 'A client asks and a server answers. The server never calls first.',
    },
    {
      prompt: 'In a REST API, what does the URL usually name, and what does the HTTP method name?',
      choices: ['The URL names the action; the method names the resource', 'The URL names the resource; the method names the action', 'Both name the status code'],
      answer: 1,
      explain: 'REST gives each resource a URL and uses the HTTP method as the action.',
    },
    {
      prompt: 'What does an HTTP response start with?',
      choices: ['A status code, and it may also carry a body such as JSON', 'Only a JSON body', 'The client\'s method and path, repeated'],
      answer: 0,
      explain: 'The response starts with a status code and may carry a JSON body.',
    },
  ],
  'spring/how-spring-proxies-work': [
    {
      prompt: 'Why does a self-call on this skip @Transactional or similar advice?',
      choices: ['Annotations never work on public methods', 'The call does not go through the proxy', 'CGLIB deletes the method'],
      answer: 1,
      explain: 'When an annotation seems to do nothing, ask: did this call go through the proxy? A self-call on this skips the proxy.',
    },
    {
      prompt: 'Which methods can a CGLIB proxy not reach?',
      choices: ['Public methods on a non-final class', 'Final methods, final classes, or private methods', 'Package-private methods only'],
      answer: 1,
      explain: 'A CGLIB proxy cannot reach final methods, final classes or private methods. Keep proxied methods public and not final.',
    },
    {
      prompt: 'Spring Boot uses CGLIB by default. What is different about a JDK proxy?',
      choices: ['It subclasses the class', 'It implements interfaces, so you should ask for the interface, not the class', 'It can proxy private methods'],
      answer: 1,
      explain: 'A JDK proxy implements interfaces, so ask for the interface, not the class.',
    },
  ],
  'spring/jdbcclient-and-flyway': [
    {
      prompt: 'Where should a Flyway migration file live, and how should it be named?',
      choices: ['Anywhere, with any name', 'In db/migration, named like V1__create_products.sql', 'In src/main/resources/static as migration.json'],
      answer: 1,
      explain: 'Put a numbered SQL file in db/migration, named like V1__create_products.sql. Flyway runs it when the app starts.',
    },
    {
      prompt: 'How do you map each row to a record with JdbcClient?',
      choices: ['Call sql(), then query(YourRecord.class), then list()', 'Parse the ResultSet in a static method', 'Return a String and split it yourself'],
      answer: 0,
      explain: 'Inject the JdbcClient Spring Boot builds. Call sql(), then query(YourRecord.class), then list() to map each row to a record.',
    },
    {
      prompt: 'What does Spring do if the SQL fails?',
      choices: ['It returns null and logs nothing', 'It translates the database error into a DataAccessException', 'It restarts the JVM'],
      answer: 1,
      explain: 'If the SQL fails, Spring translates the database error into a DataAccessException.',
    },
  ],
  'spring/rest-apis-crud-errors-and-versioning': [
    {
      prompt: 'Which status codes fit a successful GET, a successful POST that created something, and a successful DELETE with no body?',
      choices: ['200, 201, 204', '200, 200, 200', '201, 204, 404'],
      answer: 0,
      explain: 'Answer with the right status code: 200, 201, 204, and 404 when the resource is missing.',
    },
    {
      prompt: 'How should a Spring Boot 4 API report a useful error body?',
      choices: ['Return a plain string from every catch block', 'Use ProblemDetail and one @RestControllerAdvice so error bodies name what went wrong', 'Put the stack trace in the URL'],
      answer: 1,
      explain: 'Use ProblemDetail and one @RestControllerAdvice so error bodies name what went wrong. Validate input so a bad request gets 400 first.',
    },
    {
      prompt: 'When a response must change, what should you keep?',
      choices: ['Only the new contract; old clients should break', 'The old contract, and choose the response with an API version in the path or a header', 'A new port for every version'],
      answer: 1,
      explain: 'When a response must change, keep the old contract. An API version, in the path or a header, chooses which response the caller gets.',
    },
  ],
  'spring/restclient-and-http-service-clients': [
    {
      prompt: 'How do you build a RestClient in Spring Boot?',
      choices: ['Call new RestClient() and pass a URL each time', 'Inject the RestClient.Builder Spring Boot provides, set a base URL, and call build()', 'Open a raw socket'],
      answer: 1,
      explain: 'Inject the RestClient.Builder Spring Boot provides, set a base URL, and call build().',
    },
    {
      prompt: 'For later calls, where should the base URL live when you use @GetExchange?',
      choices: ['On every method of the interface', 'Off the interface; set it on a named group with spring.http.serviceclient.<group>.base-url', 'In a system property only'],
      answer: 1,
      explain: 'Leave the address off the interface. Register the interface with @ImportHttpServices in a named group, and set that group\'s base URL with the property.',
    },
    {
      prompt: 'What does the client throw when the other app answers 404?',
      choices: ['A plain NullPointerException', 'HttpClientErrorException.NotFound', 'A checked SQLException'],
      answer: 1,
      explain: 'When the other app answers 404, the client throws HttpClientErrorException.NotFound. Catch it if you want to pass that 404 along.',
    },
  ],
  'spring/spring-boot-4-from-zero': [
    {
      prompt: 'What does @SpringBootApplication turn on?',
      choices: ['Only the embedded server', 'Auto-configuration, component scanning and configuration', 'A database and a security filter'],
      answer: 1,
      explain: '@SpringBootApplication turns on auto-configuration, component scanning and configuration.',
    },
    {
      prompt: 'Where should your @RestController class live so component scanning finds it?',
      choices: ['In any package on the classpath', 'In the main class\'s package or a package below it', 'Only in a package named "controller"'],
      answer: 1,
      explain: 'Keep your classes in the main class\'s package or below, or component scanning will not find them.',
    },
    {
      prompt: 'How do you run the app after ./mvnw package?',
      choices: ['With java -jar on the executable jar it built', 'By deploying a WAR to an external Tomcat first', 'Only from the IDE'],
      answer: 0,
      explain: './mvnw package builds one executable jar that runs with java -jar.',
    },
  ],
  'spring/starters-and-the-bom': [
    {
      prompt: 'What is a Spring Boot starter, really?',
      choices: ['A library full of your application code', 'A list of dependencies that decides which libraries arrive, not code of its own', 'A tool that writes your controllers'],
      answer: 1,
      explain: 'A starter is a list of dependencies, not code; it decides which libraries arrive.',
    },
    {
      prompt: 'Who decides the versions of those libraries?',
      choices: ['You must type a version on every dependency', 'The BOM, through dependency management rules', 'Maven Central picks them at download time'],
      answer: 1,
      explain: 'The BOM decides the versions. Dependency management is a set of rules, not downloads.',
    },
    {
      prompt: 'If you need to override one managed version, what should you do?',
      choices: ['Hand-write versions on every managed dependency', 'Override it through its property, and only for a while', 'Copy the library source into your project'],
      answer: 1,
      explain: 'Override one version through its property, and only for a while. Never hand-write versions on managed dependencies.',
    },
  ],
  'system-design/sd01-sync-vs-async': [
    {
      prompt: 'What is the difference between a synchronous call and an asynchronous message?',
      choices: ['There is no difference', 'A synchronous call waits for an answer; an asynchronous message is sent and the sender moves on', 'Asynchronous messages are always faster and simpler'],
      answer: 1,
      explain: 'A synchronous call waits for an answer; an asynchronous message is sent and the sender moves on.',
    },
    {
      prompt: 'When should you use a call rather than an event?',
      choices: ['Whenever work can finish a little later', 'When the caller needs the result to give its own answer', 'When you want to hide failures'],
      answer: 1,
      explain: 'Use a call when the caller needs the result to give its own answer. Use an event when the work only needs to know that something happened and can finish a little later.',
    },
    {
      prompt: 'What should an event state?',
      choices: ['A command telling a specific service what to do next', 'A past fact', 'A future hope'],
      answer: 1,
      explain: 'An event states a past fact. If you need a specific service to act, send a command. Events also add delay, harder tracing, a broker, and duplicates.',
    },
  ],
  'system-design/sd02-rest-vs-grpc-part1': [
    {
      prompt: 'How do REST and gRPC differ at the modelling level?',
      choices: ['They are the same protocol with different names', 'REST models resources over plain HTTP with JSON; gRPC models function calls with protobuf over HTTP/2', 'gRPC only works in browsers'],
      answer: 1,
      explain: 'REST models resources over plain HTTP with JSON; gRPC models function calls with protobuf over HTTP/2.',
    },
    {
      prompt: 'When is gRPC the better fit?',
      choices: ['For public APIs aimed at browsers', 'For fast, frequent calls between services you own', 'For a simple service with few callers and no contract needs'],
      answer: 1,
      explain: 'For fast, frequent calls between services you own, gRPC gives a strict contract, smaller messages, streaming and deadlines. REST is still better for browsers, public APIs and simple services with few callers.',
    },
    {
      prompt: 'What should you always set on a gRPC call?',
      choices: ['Nothing; there is a default deadline', 'A deadline; there is none by default', 'A JSON content type'],
      answer: 1,
      explain: 'Always set a deadline on a gRPC call; there is none by default. Version the package, use _UNSPECIFIED = 0, and never reuse field numbers.',
    },
  ],
  'system-design/sd02-rest-vs-grpc-part2': [
    {
      prompt: 'What is the edge in this article?',
      choices: ['The database replica farthest from the writer', 'Where outside traffic enters; outside callers usually speak HTTP/JSON', 'The last gRPC hop inside the mesh'],
      answer: 1,
      explain: 'The edge is where outside traffic enters; outside callers usually speak HTTP/JSON.',
    },
    {
      prompt: 'How can one gRPC service also serve HTTP/JSON?',
      choices: ['By rewriting every client in protobuf', 'With gRPC-JSON transcoding, using HTTP rules in the .proto file, often through a proxy such as Envoy or grpc-gateway', 'By opening a second port that ignores the contract'],
      answer: 1,
      explain: 'gRPC-JSON transcoding lets one gRPC service also serve HTTP/JSON, using HTTP rules in the .proto file. A proxy such as Envoy or grpc-gateway does the translation.',
    },
    {
      prompt: 'Where should an event bridge sit?',
      choices: ['Before the commit, in every service, with an informal shape', 'After the commit, in one owned place, with its event shape treated as a contract', 'Only in the browser'],
      answer: 1,
      explain: 'Put the bridge after the commit, in one owned place, with its event shape treated as a contract. An event bridge turns facts from call-based services into events, and can turn events back into calls.',
    },
  ],
  'system-design/sd03-queues-vs-logs': [
    {
      prompt: 'What is the core difference between a queue and a log?',
      choices: ['A queue keeps records forever; a log deletes each message after one read', 'A queue holds work until one consumer handles and deletes it; a log keeps records, and each reader tracks its own offset', 'They are two names for the same thing'],
      answer: 1,
      explain: 'A queue holds work until one consumer handles and deletes it; a log keeps records, and each reader tracks its own offset.',
    },
    {
      prompt: 'When should you pick a log such as Kafka?',
      choices: ['For jobs that only one team works through', 'For shared facts that many teams read or replay', 'Whenever you want SNS + SQS filters'],
      answer: 1,
      explain: 'Use a log for shared facts that many teams read or replay; use a queue for jobs one team works through. Kafka keeps order inside a partition, chosen by key.',
    },
    {
      prompt: 'Do queues or logs remove duplicates for you?',
      choices: ['Yes, both guarantee exactly-once delivery', 'No; neither removes duplicates for you, so readers must handle the same event arriving twice', 'Only Kafka does, always'],
      answer: 1,
      explain: 'Neither removes duplicates for you; readers must handle the same event arriving twice.',
    },
  ],
  'terms/agent-vs-agentic-vs-chatbot': [
    {
      prompt: 'How does a chatbot behave?',
      choices: ['It picks its own tools and acts in a loop', 'It talks: text in, text out, then it waits for you', 'It always follows a written workflow of tools'],
      answer: 1,
      explain: 'A chatbot talks: text in, text out, then it waits for you.',
    },
    {
      prompt: 'What does an agent do that a workflow does not?',
      choices: ['It only fills in blanks in steps a developer wrote', 'It picks its own steps and acts, in a think, act, observe loop', 'It never uses tools'],
      answer: 1,
      explain: 'A workflow follows steps a developer wrote; an agent picks its own steps and acts, in a think, act, observe loop.',
    },
    {
      prompt: 'What is agentic AI, in this article\'s terms?',
      choices: ['A brand name for one chatbot', 'The umbrella for systems that act; you should still ask how much it decides on its own', 'Any model with a large parameter count'],
      answer: 1,
      explain: 'Agentic AI is the umbrella for systems that act; ask how much it decides on its own.',
    },
  ],
  'terms/ai-vs-ml-vs-dl-vs-genai': [
    {
      prompt: 'Which statement about AI is right?',
      choices: ['Every AI system learns from data', 'AI is the broad field; some AI systems reason from written knowledge and learn nothing', 'AI is a smaller circle inside deep learning'],
      answer: 1,
      explain: 'AI is the broad field; some AI systems reason from written knowledge and learn nothing.',
    },
    {
      prompt: 'What is deep learning, relative to machine learning?',
      choices: ['A completely separate field', 'Machine learning with a neural network of many layers', 'Any program that generates text'],
      answer: 1,
      explain: 'Deep learning is machine learning with a neural network of many layers. Machine learning is AI that improves at a task from data.',
    },
    {
      prompt: 'What does generative AI name?',
      choices: ['A smaller circle inside deep learning', 'The job of producing new content; it is not a smaller circle inside deep learning', 'Only systems that never use layers'],
      answer: 1,
      explain: 'Generative AI names the job, producing new content; it is not a smaller circle inside deep learning.',
    },
  ],
  'terms/fine-tuning-vs-rag-vs-prompting': [
    {
      prompt: 'What should you usually try first?',
      choices: ['Fine-tuning the model', 'Changing the prompt: what you tell the model', 'Building a new model from scratch'],
      answer: 1,
      explain: 'A prompt changes what you tell the model; start there.',
    },
    {
      prompt: 'When is RAG the right lever?',
      choices: ['When you want to change the model\'s tone forever', 'When you need facts, especially facts that change', 'When you have no documents at all'],
      answer: 1,
      explain: 'RAG changes what the model reads; use it for facts, especially facts that change. Fine-tuning is for habits such as tone and format.',
    },
    {
      prompt: 'Why is training a changing fact into the model a bad idea?',
      choices: ['It is always cheaper than lookup', 'A fact trained into a model goes stale and can even beat a fresh page in the prompt', 'Fine-tuning cannot change a model at all'],
      answer: 1,
      explain: 'A fact trained into a model goes stale and can even beat a fresh page in the prompt. Train the habits, look up the facts.',
    },
  ],
  'terms/grounding-and-citations': [
    {
      prompt: 'Does having the right page make an answer grounded?',
      choices: ['Yes, that is enough', 'No; having the right page does not make an answer grounded by itself', 'Yes, if the page is long'],
      answer: 1,
      explain: 'Having the right page does not make an answer grounded. A rule in the prompt helps, but you cannot take it on trust.',
    },
    {
      prompt: 'What do citations need to show?',
      choices: ['Only that a source list exists at the end', 'Which line each sentence came from', 'The model\'s training cutoff date'],
      answer: 1,
      explain: 'Citations show which line each sentence came from; the app can add them in code. A check should block sentences with no line behind them.',
    },
    {
      prompt: 'What should you do before you trust a citation?',
      choices: ['Assume the link is correct', 'Keep sources owned and dated, and open citations before you trust them', 'Ask the model if it is sure'],
      answer: 1,
      explain: 'A grounded answer is only as good as its page: keep sources owned and dated, and open citations before you trust them.',
    },
  ],
  'terms/how-ai-learns-from-data': [
    {
      prompt: 'What is the difference that defines the three classic ways of learning?',
      choices: ['The brand of the chip', 'What comes with the data: marked answers, no answers, or a score for each try', 'Whether the model can speak'],
      answer: 1,
      explain: 'Supervised learning uses examples with the right answers marked; unsupervised finds groups with no answers; reinforcement learning learns from a score for each try.',
    },
    {
      prompt: 'What does unsupervised learning not do for you?',
      choices: ['Find groups in the examples', 'Name those groups; a person still chooses how many groups, and the program names none of them', 'Run without labelled answers'],
      answer: 1,
      explain: 'Unsupervised learning finds groups in examples with no answers; a person still chooses how many groups, and the program names none of them.',
    },
    {
      prompt: 'Do real systems pick only one of the three?',
      choices: ['Yes, a system must use exactly one', 'No; real systems often mix all three', 'Only reinforcement learning is used in production'],
      answer: 1,
      explain: 'Real systems, from music apps to chatbots, often mix all three.',
    },
  ],
  'terms/mixture-of-experts': [
    {
      prompt: 'In a normal dense model, which parameters does each token use?',
      choices: ['Almost all of them', 'Only one expert, chosen at random', 'None of the parameters'],
      answer: 0,
      explain: 'In a normal model, every token uses almost all of the parameters.',
    },
    {
      prompt: 'What does the router in an MoE model do?',
      choices: ['Deletes unused experts from memory', 'Picks a few experts for each token, so only those experts do the math', 'Trains a smaller model from scratch'],
      answer: 1,
      explain: 'An MoE model splits many parameters into experts, and a router picks a few experts for each token. Only the picked experts do the math.',
    },
    {
      prompt: 'Does mixture of experts mean a smaller model in memory?',
      choices: ['Yes; unused experts are unloaded', 'No; any expert can be needed next, so all of them stay in memory. It means less math per token, not a smaller model', 'Yes, the total parameter count shrinks automatically'],
      answer: 1,
      explain: 'Any expert can be needed next, so all of them stay in memory: the total sets the memory. Mixture of experts means less math for every token, not a smaller model.',
    },
  ],
  'terms/what-is-a-context-window': [
    {
      prompt: 'What is a context window?',
      choices: ['The model\'s long-term memory of every chat you have ever had', 'All the text a model can look at while it writes one answer, measured in tokens', 'The size of your screen'],
      answer: 1,
      explain: 'The context window is the model\'s working memory for one answer, measured in tokens.',
    },
    {
      prompt: 'What happens when the window is full?',
      choices: ['The model remembers everything forever', 'The app resends the chat each turn, and old parts are dropped or summarised', 'The app refuses to answer ever again'],
      answer: 1,
      explain: 'The app resends the chat every turn; when the window is full, old parts are dropped or summarised.',
    },
    {
      prompt: 'What is a practical habit when the window is tight?',
      choices: ['Paste the whole archive and hope', 'Start a new chat for a new task, restate key facts near your question, and paste only the part you need', 'Raise temperature to 2'],
      answer: 1,
      explain: 'Start a new chat for a new task, restate key facts near your question, and paste only the part of a document you need. Bigger windows help, but the middle of a long input is read less reliably.',
    },
  ],
  'terms/what-is-a-system-prompt': [
    {
      prompt: 'What is a system prompt?',
      choices: ['The question you type', 'The briefing the app gives the AI before your first message', 'A secret key stored in the model'],
      answer: 1,
      explain: 'Your prompt is the question you type; the system prompt is the briefing the app gave the AI before you arrived.',
    },
    {
      prompt: 'Is a system prompt a hard switch that always wins?',
      choices: ['Yes, it cannot be overridden', 'No; it is a strong request, and it can lose a clash with the user\'s message', 'Yes, but only on small models'],
      answer: 1,
      explain: 'It shapes tone, length, role and format, but it is a strong request, not a switch. It can lose a clash with the user\'s message, especially on small models.',
    },
    {
      prompt: 'Should you put secrets and access rules in the system prompt?',
      choices: ['Yes, that is the safe place for them', 'No; keep secrets and access rules out of it and enforce them in code', 'Yes, if you mark them as confidential in the text'],
      answer: 1,
      explain: 'It is not a safe: keep secrets and access rules out of it and enforce them in code.',
    },
  ],
  'terms/what-is-a-token': [
    {
      prompt: 'What is a token?',
      choices: ['Always exactly one English word', 'A chunk of text, often a piece of a word, that a model treats as one unit', 'A password the API checks'],
      answer: 1,
      explain: 'A token is a chunk of text, often a piece of a word; in English, about three quarters of a word.',
    },
    {
      prompt: 'How do models bill you?',
      choices: ['Per word, in every language', 'In tokens; input and output are billed separately, and output usually costs more', 'A flat fee per question, with no count'],
      answer: 1,
      explain: 'Models read, write and bill in tokens. Input and output are billed separately, and output usually costs more.',
    },
    {
      prompt: 'Is the token count of the same text always the same?',
      choices: ['Yes, every tokenizer agrees', 'No; it differs by language and by tokenizer', 'It differs only for punctuation'],
      answer: 1,
      explain: 'The same text gives a different count in different languages and with different tokenizers. Run a sample through the provider\'s token counter before you budget.',
    },
  ],
  'terms/what-is-ai-governance': [
    {
      prompt: 'What is AI governance?',
      choices: ['A single law that bans all AI', 'The rules, roles and routines that decide which AI a company uses, for what, and who answers for it', 'A vendor\'s brand name'],
      answer: 1,
      explain: 'AI governance is the rules, roles and routines that decide which AI a company uses, for what, and who answers for it.',
    },
    {
      prompt: 'Why start with an inventory?',
      choices: ['It is required only by marketing', 'You cannot manage a tool you do not know exists', 'Inventories replace the need for owners'],
      answer: 1,
      explain: 'Start with an inventory: you cannot manage a tool you do not know exists. Give every tool an accountable owner.',
    },
    {
      prompt: 'How should the checks relate to risk?',
      choices: ['Every tool gets the same heavy process', 'Match the checks to the risk; the EU AI Act sorts AI the same way', 'Only banned tools need any checks'],
      answer: 1,
      explain: 'Match the checks to the risk; the EU AI Act sorts AI the same way. Governance makes a clear yes possible, with limits and a way to switch a tool off.',
    },
  ],
  'terms/what-is-ai-slop': [
    {
      prompt: 'What is AI slop?',
      choices: ['Any text a person wrote with help from AI', 'Low-quality AI content made in bulk, unchecked and unasked for', 'A kind of neural network'],
      answer: 1,
      explain: 'AI slop is low-quality AI content made in bulk, unchecked and unasked for. AI use alone does not make content slop; a human standing behind it is the difference.',
    },
    {
      prompt: 'Who pays the cost of slop?',
      choices: ['Only the author, because it is expensive to make', 'The receiver: it is cheap to make and expensive to read', 'Nobody; slop is free for everyone'],
      answer: 1,
      explain: 'It is cheap to make and expensive to read: the work moves to the receiver.',
    },
    {
      prompt: 'What should you do before sending AI-assisted work?',
      choices: ['Send it as soon as it looks polished', 'Read it all, check every name, number and source, and trim it', 'Raise the temperature and generate more of it'],
      answer: 1,
      explain: 'Before sending AI-assisted work: read it all, check every name, number and source, and trim it.',
    },
  ],
  'terms/what-is-an-ai-copilot': [
    {
      prompt: 'What does Copilot with a capital C refer to?',
      choices: ['One single product that does everything', 'A brand that covers many different products', 'Any AI that takes several steps on its own'],
      answer: 1,
      explain: 'Copilot with a capital C is a brand that covers many different products. Microsoft 365 Copilot is for office work; GitHub Copilot is a separate coding tool with its own licence.',
    },
    {
      prompt: 'As an idea, what does a copilot mean?',
      choices: ['The AI takes several steps on its own without asking', 'The AI suggests and a human decides each step', 'The AI replaces the human entirely'],
      answer: 1,
      explain: 'As an idea, a copilot means the AI suggests and a human decides each step. When the AI takes several steps on its own, it has become an agent, even if the name stays.',
    },
    {
      prompt: 'What should you ask at work when someone says "we have a copilot"?',
      choices: ['Only whether the logo is official', 'Whether they mean a product or the idea, which product, who approves each action, what it can see, and who checks the output', 'Only the price'],
      answer: 1,
      explain: 'At work, ask: product or idea, which product, who approves each action, what can it see, and who checks the output.',
    },
  ],
  'terms/what-is-an-ai-hallucination': [
    {
      prompt: 'What is an AI hallucination?',
      choices: ['A hardware fault in the GPU', 'A confident answer that is false', 'Any answer that is longer than one sentence'],
      answer: 1,
      explain: 'A hallucination is a confident answer that is false. The model predicts likely words; a guess can sound as sure as a fact.',
    },
    {
      prompt: 'Is asking "are you sure?" a reliable check?',
      choices: ['Yes, the model will always correct itself', 'No, it is not a reliable check', 'Yes, but only at temperature 0'],
      answer: 1,
      explain: 'Asking "are you sure?" is not a reliable check. Check names, numbers, quotes and sources yourself.',
    },
    {
      prompt: 'Can grounding and "I don\'t know" end hallucinations?',
      choices: ['Yes, they make them impossible', 'They make hallucinations rarer, not impossible', 'They make hallucinations more common'],
      answer: 1,
      explain: 'Sources, permission to say "I don\'t know" and a quote per claim make hallucinations rarer, not impossible.',
    },
  ],
  'terms/what-is-an-llm': [
    {
      prompt: 'What is an LLM, at heart?',
      choices: ['A search engine that looks up every answer', 'A giant next-token predictor that learned how language usually goes', 'A database of true facts'],
      answer: 1,
      explain: 'An LLM is a giant next-token predictor that learned how language usually goes from huge amounts of text.',
    },
    {
      prompt: 'How does it write an answer?',
      choices: ['It plans the whole paragraph, then types it', 'It writes one token at a time, always picking a likely next token', 'It copies a document word for word'],
      answer: 1,
      explain: 'It writes an answer one token at a time, always picking a likely next token.',
    },
    {
      prompt: 'Why must you still check facts, numbers and recent events?',
      choices: ['The model looks everything up on the live web by default', 'It predicts what sounds likely, not what is true, and does not look anything up on its own', 'It is only trained on numbers, not text'],
      answer: 1,
      explain: 'It predicts what sounds likely, not what is true, and does not look anything up on its own.',
    },
  ],
  'terms/what-is-mcp': [
    {
      prompt: 'What is MCP?',
      choices: ['A new language model from one vendor', 'An open standard plug between AI apps and outside tools and data, not a model', 'A replacement for every API'],
      answer: 1,
      explain: 'MCP is an open standard plug between AI apps and outside tools and data, not a model. It does not replace APIs; it gives them one common description.',
    },
    {
      prompt: 'In MCP, what are hosts, servers and clients?',
      choices: ['Hosts are models, servers are GPUs, clients are users', 'Hosts are the apps, servers offer tools, resources and prompts, and clients connect the two', 'All three words mean the same process'],
      answer: 1,
      explain: 'Hosts are the apps, servers offer tools, resources and prompts, and clients connect the two.',
    },
    {
      prompt: 'Does MCP make a connection safe on its own?',
      choices: ['Yes; any MCP server is safe to connect', 'No; connect only servers you trust, and check what each one may do', 'Yes, if the server has a logo'],
      answer: 1,
      explain: 'It does not make anything safe on its own: connect only servers you trust, and check what each one may do.',
    },
  ],
  'terms/what-is-rag': [
    {
      prompt: 'What does RAG do, and what does it not change?',
      choices: ['It retrains the model on your documents', 'It looks documents up first, then answers from what was found; the model itself does not change', 'It raises temperature so the model guesses more'],
      answer: 1,
      explain: 'RAG means look it up first, then answer from what was found; the model itself does not change.',
    },
    {
      prompt: 'How do you update what a RAG system knows?',
      choices: ['Retrain the model from scratch', 'Update the documents; no retraining is needed', 'Change the system prompt only'],
      answer: 1,
      explain: 'To update what it knows, update the documents; no retraining needed. Documents are cut into chunks and searched by meaning with embeddings.',
    },
    {
      prompt: 'Does RAG end hallucinations?',
      choices: ['Yes, completely', 'It makes them rarer, not impossible; when it is wrong, check the search step and the documents first', 'No, it makes them more common'],
      answer: 1,
      explain: 'It makes hallucinations rarer, not impossible: when it is wrong, check the search step and the documents first.',
    },
  ],
  'terms/what-is-temperature': [
    {
      prompt: 'What does temperature decide?',
      choices: ['How hard the model tries', 'How often a language model takes a less likely word', 'How many tokens it may write'],
      answer: 1,
      explain: 'Every next word is a weighted dice roll; temperature decides how weighted it is. It is not a creativity or effort dial.',
    },
    {
      prompt: 'What happens at temperature 0?',
      choices: ['The model refuses to answer', 'The model takes the top choice, so the favourite almost always wins', 'The model picks entirely at random'],
      answer: 1,
      explain: 'Low temperature is predictable: the favourite almost always wins. At 0, the model takes the top choice.',
    },
    {
      prompt: 'What should you do past about 1.5?',
      choices: ['Expect cleaner factual answers', 'Expect answers to start slipping into nonsense; keep it low for facts and code', 'Turn it up further for legal advice'],
      answer: 1,
      explain: 'High temperature is varied, and past about 1.5 answers start to slip into nonsense. Keep it low for facts and code.',
    },
  ],
  'terms/what-parameters-mean': [
    {
      prompt: 'What does the B in 8B or 70B count?',
      choices: ['Billions of documents in the training set', 'Billions of parameters, each one a number set during training', 'Billions of tokens in one answer'],
      answer: 1,
      explain: 'A parameter is one number in a model that is set during training; the B counts them in billions.',
    },
    {
      prompt: 'What does a bigger B mainly set, at about two bytes per knob?',
      choices: ['How true the answers are', 'The memory you need, and more math per token', 'The length of the context window only'],
      answer: 1,
      explain: 'At about two bytes per knob, the B sets the memory you need, and more knobs mean more math per token.',
    },
    {
      prompt: 'Does a bigger B promise a better model?',
      choices: ['Yes, always', 'No; enough training data matters too', 'Only if the B is a multiple of 8'],
      answer: 1,
      explain: 'A bigger B does not promise a better model; enough training data matters too.',
    },
  ],
  'terms/ai-assistants-agents-and-bots-map': [
    {
      prompt: 'How do an assistant, an agent and a bot differ?',
      choices: ['They are three names for the same thing', 'An assistant answers, an agent acts, and a bot is the chat-app face of either', 'A bot is always smarter than an agent'],
      answer: 1,
      explain: 'They sit on one scale: an assistant answers, an agent takes actions, and a bot is just how either one shows up in a chat app.',
    },
    {
      prompt: 'Which two questions place any AI helper on the map?',
      choices: ['Who made it, and what colour is its logo?', 'How many languages it speaks, and how fast it types', 'Does it answer or act, and whose computer does it run on?'],
      answer: 2,
      explain: 'Ask whether it only answers, acts when asked or acts on its own schedule, and whether it runs on the company\'s cloud, your computer, your server or your code editor.',
    },
    {
      prompt: 'Why are OpenRouter and Copilot not on the agent map as agents?',
      choices: ['OpenRouter is plumbing that connects you to models, and Copilot is a brand name for several products', 'Both are banned in Europe', 'Both only work offline'],
      answer: 0,
      explain: 'OpenRouter routes your requests to many models, and Copilot is a name used for several different products. Neither is one agent.',
    },
  ],
  'terms/what-is-an-ai-agent-made-of': [
    {
      prompt: 'What turns a language model into an agent?',
      choices: ['A bigger model', 'A loop (harness) that calls the model, runs tools and repeats until the task is done', 'A longer system prompt'],
      answer: 1,
      explain: 'The model only produces text. The loop around it reads that text, runs the tools it asks for, feeds the results back and repeats.',
    },
    {
      prompt: 'What is a file such as AGENTS.md or SKILL.md?',
      choices: ['Plain-text instructions the loop reads', 'The agent itself', 'A secret key for the model'],
      answer: 0,
      explain: 'These files are instructions in plain text. The loop reads them to know how to behave; changing them changes behaviour, but they are not the program.',
    },
    {
      prompt: 'How is a subagent different from a multi-agent setup?',
      choices: ['They are the same', 'A multi-agent setup is just one agent with more memory', 'A subagent is a helper for one side task; a multi-agent setup is a team of agents with a lead'],
      answer: 2,
      explain: 'A subagent does one side job and hands back a summary. A multi-agent setup has several named agents with their own jobs, coordinated by a lead.',
    },
  ],
  'terms/hosted-ai-agents': [
    {
      prompt: 'Why can a hosted agent keep working when your laptop is off?',
      choices: ['It runs on the company\'s cloud computer, not on your device', 'It saves battery by pausing', 'It only works while your laptop is on'],
      answer: 0,
      explain: 'A hosted agent has its own computer in the company\'s cloud, so it keeps going while your devices sleep.',
    },
    {
      prompt: 'What is the main trade-off of a hosted agent?',
      choices: ['You must update the software yourself every week', 'No upkeep for you, but shared usage limits and trusting the company with your data', 'It can never use the web'],
      answer: 1,
      explain: 'You pay a subscription and maintain nothing, but you live within the plan\'s limits and the company handles your data.',
    },
    {
      prompt: 'ChatGPT dots and OpenDot do a similar job. What is the key difference?',
      choices: ['OpenDot only answers questions', 'dots is free software you install', 'dots is a managed cloud service; OpenDot is free software that runs on your own computer'],
      answer: 2,
      explain: 'Same idea, opposite trade-offs: dots is run for you in the cloud, while OpenDot runs on your machine and you look after it.',
    },
  ],
  'terms/what-is-an-api-key': [
    {
      prompt: 'Why does a self-hosted agent usually ask you for an API key?',
      choices: ['It brings the loop but not the model, so it needs your key to use a model on your account', 'To prove you are over 18', 'Because it cannot work without the internet'],
      answer: 0,
      explain: 'The agent is the program around the model. The key lets it call a model provider and charge the usage to your account.',
    },
    {
      prompt: 'Sara pays for a chat subscription. Does that cover API use?',
      choices: ['Yes, every subscription includes unlimited API use', 'Usually not; API use is billed separately, though some higher plans include API credits', 'Only on weekends'],
      answer: 1,
      explain: 'Chat plans and the API are billed separately. Some tools let you sign in with your subscription instead, and some higher plans include credits.',
    },
    {
      prompt: 'A key was pasted into a public chat by mistake. What should Sara do?',
      choices: ['Nothing; keys cannot be misused', 'Change its name', 'Delete it and make a new one (rotate it), and check the spending limits'],
      answer: 2,
      explain: 'Treat a key like a password. If it leaks, revoke it and create a new one; spending limits cap the damage.',
    },
  ],
  'terms/which-ai-model-should-i-use': [
    {
      prompt: 'What is the best way to judge which model is good for you?',
      choices: ['Pick whatever tops a public ranking', 'Test a few models on your own real tasks, using rankings only as a shortlist', 'Always pick the newest model'],
      answer: 1,
      explain: 'Rankings measure general tests. Your own tasks show which model actually works for you.',
    },
    {
      prompt: 'Which is a sensible starting rule?',
      choices: ['Start with a mid-priced model, move up for hard work and down for simple, high-volume work', 'Always use the most expensive model', 'Always use the cheapest model'],
      answer: 0,
      explain: 'A mid-priced model handles most jobs. Spend more only where quality matters, and use small models where volume matters.',
    },
    {
      prompt: 'Why might someone run an open-weights model on their own computer?',
      choices: ['It is always smarter than closed models', 'It needs no computer at all', 'For privacy and no per-token cost, at the price of using their own hardware'],
      answer: 2,
      explain: 'Tools like Ollama run open-weights models locally, so your text stays at home and there is no token bill, but your hardware limits speed and size.',
    },
  ],
  'terms/self-hosted-ai-agents': [
    {
      prompt: 'Why might Sara move her self-hosted agent from her PC to a small server?',
      choices: ['Servers are always free', 'Her PC sleeps or turns off, while a small server runs all day', 'A PC cannot run software'],
      answer: 1,
      explain: 'An agent on your PC stops when the PC sleeps. A small rented server keeps it running around the clock.',
    },
    {
      prompt: 'The software is free. What are the real costs?',
      choices: ['The model, the server and your time', 'Nothing at all', 'Only a one-time licence fee'],
      answer: 0,
      explain: 'You pay for model use, maybe a server, and the time you spend on setup and upkeep.',
    },
    {
      prompt: 'With a self-hosted agent, who handles updates, keys and approvals?',
      choices: ['The company that made the chat app', 'Nobody; it handles itself', 'You do'],
      answer: 2,
      explain: 'Control comes with responsibility: you update the software, guard the keys, set up a sandbox and decide what needs approval.',
    },
  ],
  'terms/what-is-openrouter': [
    {
      prompt: 'What problem does OpenRouter solve?',
      choices: ['It writes your prompts for you', 'It gives you one account, one key and one balance for hundreds of models', 'It makes every model free'],
      answer: 1,
      explain: 'Instead of separate accounts and keys for each provider, you use one key and one balance to reach many models.',
    },
    {
      prompt: 'What is a fallback?',
      choices: ['A backup: if one provider fails, the request is retried with another provider or model', 'A cheaper copy of a model', 'A way to delete old chats'],
      answer: 0,
      explain: 'Fallbacks keep requests working when a provider errors or slows down.',
    },
    {
      prompt: 'What should you keep in mind about privacy?',
      choices: ['OpenRouter never sees your prompts', 'Privacy only matters for images', 'Your prompts pass through OpenRouter, so check its settings and the provider\'s policy too'],
      answer: 2,
      explain: 'A router sits in the middle. Use its privacy settings and check what each provider does with your data.',
    },
  ],
  'terms/coding-agents-app-builders-and-workflow-agents': [
    {
      prompt: 'How does a coding agent usually hand back its work?',
      choices: ['It changes the live website straight away', 'As a pull request that a person reviews before merging', 'It emails a zip file'],
      answer: 1,
      explain: 'The agent works on a copy and proposes a pull request. A person reviews it and decides whether to merge.',
    },
    {
      prompt: 'Sara wants a booking page but does not code. Which kind of tool fits best?',
      choices: ['An app builder that turns a description into a hosted app', 'A workflow tool', 'A coding agent in a terminal'],
      answer: 0,
      explain: 'App builders let non-coders describe an app and get a working, hosted one. She should still review anything important.',
    },
    {
      prompt: 'When is a workflow tool with only a little AI a better choice than a full agent?',
      choices: ['Never', 'When the job needs creative writing', 'When it is the same steps every time, with judgement needed only at one point'],
      answer: 2,
      explain: 'Plain automation is cheaper and more predictable for repeated steps. Add an AI step only where judgement is needed.',
    },
  ],
  'terms/how-to-choose-an-ai-agent': [
    {
      prompt: 'Sara mostly asks questions and drafts text. What does she need?',
      choices: ['A chat assistant is enough', 'A self-hosted agent on a server', 'A coding agent'],
      answer: 0,
      explain: 'The first question is answers or actions. If you only want answers, a chat assistant does the job.',
    },
    {
      prompt: 'Which choice fits someone who wants zero maintenance?',
      choices: ['A self-hosted agent', 'A hosted agent, ideally from a company whose plan they already pay for', 'Building their own agent from scratch'],
      answer: 1,
      explain: 'Hosted agents need no upkeep. Self-hosting gives control but costs time.',
    },
    {
      prompt: 'Which of these is a common trap?',
      choices: ['Reading prices on the official page', 'Giving an agent only the access it needs', 'Paying twice for overlapping tools, or forgetting a server that keeps billing'],
      answer: 2,
      explain: 'Watch for overlapping subscriptions, too much access, forgotten servers, usage limits and regions. Most people need one assistant and at most one agent.',
    },
  ],
  'terms/copilot-explained-microsoft-vs-github': [
    {
      prompt: 'What does the name Copilot refer to?',
      choices: ['One tool that does everything', 'A brand covering several different products', 'Only a coding tool'],
      answer: 1,
      explain: 'Copilot is a brand. Microsoft Copilot, Copilot in Microsoft 365 and GitHub Copilot are different products.',
    },
    {
      prompt: 'Sara wants help inside Word and Outlook with her own documents. Which Copilot fits?',
      choices: ['GitHub Copilot', 'Any of them; they are identical', 'Copilot in Microsoft 365'],
      answer: 2,
      explain: 'Copilot in Microsoft 365 works inside Word, Excel, Outlook and Teams. GitHub Copilot is for code.',
    },
    {
      prompt: 'Is Copilot an assistant or an agent?',
      choices: ['Partly both: most features suggest and wait, but some, like GitHub Copilot\'s coding agent, work through many steps on their own', 'Always a fully independent agent', 'Neither; it is a search engine'],
      answer: 0,
      explain: 'The name stays the same while products move along the scale from assistant to agent.',
    },
  ],
  'terms/r01-ai-news-oct-24-30': [
    {
      prompt: 'What is GPT-6.1 Terra built to do?',
      choices: ['Only write long essays', 'Look at a screen and click, type and scroll like a person would (computer use)', 'Train other models overnight'],
      answer: 1,
      explain: 'Terra is a fast model for computer use: it looks at a screen and clicks, types and scrolls. OpenAI still reported wrong answers on about one prompt in six at low effort.',
    },
    {
      prompt: 'How can Mistral Large 4 have about a trillion parameters but only around 49 billion work on each token?',
      choices: ['It deletes the rest of the weights at boot', 'It is a mixture of experts: a router picks a few experts per token, plus one shared expert that always runs', 'The extra parameters are only used for images'],
      answer: 1,
      explain: 'Inside are 128 expert networks. A router picks 4 of them per token, and 1 shared expert always runs. That is a mixture of experts.',
    },
    {
      prompt: 'What does the proposed robots.txt group User-Agent: __usage_ai-training do?',
      choices: ['It encrypts the site so crawlers cannot read it', 'It is a shared preference signal for whether a site may be used as AI training data, not a technical lock', 'It blocks all search-engine crawlers, including Google Search'],
      answer: 1,
      explain: 'The IETF draft adds one shared signal for training-data consent. Disallow and Allow work as usual, a wildcard User-Agent group must not be read as this signal, and it remains a preference rather than a lock.',
    },
  ],
  'terms/r02-ai-news-oct-31-nov-6': [
    {
      prompt: 'What does authorized scope mean for GPT-6 Cyber?',
      choices: ['The model may act on any system it can reach', 'The model may act, but only inside the job and systems the researcher named', 'The model may only answer questions, never act'],
      answer: 1,
      explain: 'OpenAI trained the model to stay in scope: the list of systems the researcher named. That is authorized scope.',
    },
    {
      prompt: 'What is provable inference, as FlashProve uses the term?',
      choices: ['A watermark stamped into the prose of a reply', 'A check that this answer came from a committed set of weights, without showing those weights', 'A promise that the answer is factually true'],
      answer: 1,
      explain: 'FlashProve builds a small proof that a reply came from a committed set of weights. It does not by itself prove the answer is true.',
    },
    {
      prompt: 'What is a coding agent in the dsh-superagent write-up?',
      choices: ['A chatbot that only explains code and never changes it', 'An AI that changes code and hands the work back for a person to review', 'A compiler plugin that rewrites bytecode'],
      answer: 1,
      explain: 'dsh-superagent is described as a coding agent: it does the job when asked, and may open a pull request for a person to review before it is merged.',
    },
  ],
  'spring/w44-this-week-in-java-and-spring': [
    {
      prompt: 'Why does updating Chrome not, by itself, fix a Java app that may still trust the compromised eMudhra certificates?',
      choices: ['Java shares Chrome\'s certificate list automatically', 'A Java runtime has its own trust store (cacerts), and by default Java does not check whether a certificate was revoked', 'The certificates only affect Android, not the JDK'],
      answer: 1,
      explain: 'Java keeps its own list of trusted roots in cacerts, and revocation checking is off by default. Updating the browser does not update the JDK.',
    },
    {
      prompt: 'What does JEP 544 add to the AOT cache in JDK 28?',
      choices: ['A new garbage collector', 'The native code the JIT produced during the training run, so the next start can begin with compiled code', 'A replacement for the jar format'],
      answer: 1,
      explain: 'The AOT file can now store compiled native code as well as what earlier caches stored. The production machine needs the same CPU features and the same garbage collector, or the JVM compiles as usual.',
    },
    {
      prompt: 'What is the first thing this week\'s recap asks you to do?',
      choices: ['Upgrade Kotlin and Maven immediately', 'Check your Java trust store and update your JDK', 'Turn off HTTPS in production'],
      answer: 1,
      explain: 'The recap leads with the trust-store work: check cacerts and update the JDK. Temurin had already shipped fixed builds for several current LTS and current lines.',
    },
  ],
  'spring/w45-this-week-in-java-and-spring': [
    {
      prompt: 'What changed for Redis in Spring Boot 4.2 RC2?',
      choices: ['Redis support was removed', 'The database setting (or the database segment of the Redis URL) is now applied to master and replica connections; before, the factory silently used database 0', 'Redis is now the only supported session store'],
      answer: 1,
      explain: 'The spring data redis database setting was previously ignored, so the factory always used database 0. RC2 applies it to master and replica connections.',
    },
    {
      prompt: 'What is HTTP QUERY in Spring Framework 7.1?',
      choices: ['A SQL dialect Spring runs for you', 'The new idempotent HTTP method with a body, defined in RFC 10008, which you can map like any other method', 'Another name for GET with query parameters'],
      answer: 1,
      explain: 'QUERY is an idempotent HTTP method with a body. Framework 7.1 lets you map it like the other methods and call it with curl.',
    },
    {
      prompt: 'What happens to RestTemplate in Framework 7.1, and what should you move to?',
      choices: ['It becomes the default client for new apps', 'It is formally deprecated for removal in Framework 8; the migration path is RestClient or the HTTP Interface Client', 'It replaces WebClient'],
      answer: 1,
      explain: 'RestTemplate and related types are deprecated for removal in Framework 8. The write-up points you to RestClient, or the HTTP Interface Client.',
    },
  ],
};

export function questionsFor(section: string, id: string): CheckQuestion[] | undefined {
  return CHECK_QUESTIONS[`${section}/${id}`];
}

