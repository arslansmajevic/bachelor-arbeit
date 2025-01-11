# Stage 1: Build
FROM maven:3.9.4-eclipse-temurin-17 AS builder

# Set the working directory
WORKDIR /app

# Copy the pom.xml and dependencies to the container
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# Copy the entire project to the container
COPY . ./

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jdk-jammy

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the application's port
EXPOSE 8080

# Add an environment variable for the Spring profile
ENV SPRING_PROFILES_ACTIVE=generateData

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

# docker run -e SPRING_PROFILES_ACTIVE=generateData -p 8080:8080 spring-boot-app