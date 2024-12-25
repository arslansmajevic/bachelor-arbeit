# Backend Service Documentation

## Overview
- **Name**: `data-exchange-project`
- **Version**: `0.0.1-SNAPSHOT`
- **Description**: A platform for the exchange and representation of medical data, built using Spring Boot and Java.
- **Purpose**: Provides RESTful APIs to manage and exchange medical data securely and efficiently.

---

## Key Features
- **REST API**: Built with Spring Boot, offering endpoints for data management.
- **Database Integration**: Uses H2 as the database for lightweight, in-memory persistence, used for user storage.
- **Security**: Incorporates Spring Security for authentication and authorization, with support for JWT-based authentication.
- **Validation**: Ensures input validation using `spring-boot-starter-validation`.
- **OpenAPI Documentation**: Auto-generates API documentation using SpringDoc OpenAPI UI available at `http://localhost:8080/api/v1/swagger-ui`;
- **Mapping and Conversions**: Simplifies object mapping using MapStruct.
- **SPARQL and RDF Integration**: Supports RDF-based data querying and modeling with RDF4J.

---

## Dependencies

### Core Dependencies
- `spring-boot-starter`: Base dependency for building Spring Boot applications.
- `spring-boot-starter-web`: Provides support for REST APIs.
- `spring-boot-starter-data-jpa`: Simplifies database operations with JPA.

### Validation
- `spring-boot-starter-validation`: Provides validation annotations (e.g., `@NotNull`, `@Email`) and custom validation.

### Database
- `h2`: Embedded database for development and testing.
- `spring-boot-starter-data-jpa`: Works with H2 for ORM and repository support.

### Security
- `spring-boot-starter-security`: Adds authentication and authorization capabilities.
- `jjwt`: Provides support for JSON Web Token (JWT) handling.

### API Documentation
- `springdoc-openapi-starter-webmvc-ui`: Automatically generates OpenAPI documentation and exposes Swagger UI.

### Data Mapping
- `mapstruct` and `mapstruct-processor`: Simplifies object-to-object mapping for DTOs and entities.

### RDF and SPARQL
- `rdf4j-model`, `rdf4j-sparqlbuilder`, `rdf4j-client`: Provides support for RDF modeling and SPARQL queries, allowing integration with semantic web data formats.
- The config for the RDF Triplestore is stored in H2 and is filled on initial startup.
- The RDF Triplestore is expected to be an external service. 

### Testing
- `spring-boot-starter-test`: Provides testing utilities for Spring Boot applications.
- `spring-security-test`: Adds test support for security configurations.

---

## Build Configuration

### Java Version
- The service uses **Java 22**, specified in the `pom.xml` under `<java.version>`.

### Checkstyle
- Enforces coding standards using the **Maven Checkstyle Plugin**:
    - Configuration file: `checkstyle.xml`
    - Runs during the `validate` phase of the Maven lifecycle.
    - Outputs violations in the console and fails the build if violations exist.

### Build and Run, Maven Commands
- Cleans the build directory, compiles code, runs tests, packages the application, and installs it locally.
```bash
mvn clean install
```
- Runs the application directly from the source without packaging, using the default profile.
```bash 
mvn spring-boot:run
```
- Runs the application with a specific Spring profile, overriding the default profile behavior.
- These are the `UserDataGenerator.java` and `GraphDBConfigGenerator.java`
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=generateData
```
- Deletes all files generated during the build (e.g., target directory).
```bash
mvn clean
```
- Compiles the source code in src/main/java but doesn’t run tests or package the application.
```bash
mvn compile
```
- Compiles, runs tests, and packages the application into a JAR/WAR file, which is placed in the target directory.
```bash
mvn package
```
- Does everything mvn package does and installs the packaged artifact (JAR/WAR) into your local Maven repository (~/.m2/repository).
```bash
mvn install
```
- Displays a tree of all dependencies, including transitive ones, to help identify potential conflicts.
```bash
mvn dependency:tree
```
- Analyzes your dependencies and reports unused or missing dependencies.
```bash
mvn dependency:analyze
```
- Generates a project documentation site based on the POM and any additional reporting plugins.
```bash
mvn site
```
