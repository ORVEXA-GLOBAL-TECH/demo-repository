# Stage 1: Build Java Microservices
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY alleviare-common/pom.xml alleviare-common/
COPY api-gateway/pom.xml api-gateway/
COPY user-service/pom.xml user-service/
COPY master-catalog-service/pom.xml master-catalog-service/
COPY dcr-visit-service/pom.xml dcr-visit-service/
COPY order-service/pom.xml order-service/
COPY expense-service/pom.xml expense-service/

# Copy all source code
COPY . .

# Package the microservices
RUN mvn clean package -DskipTests

# Stage 2: Runtime Image (User Service & Auth)
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy the built jar (default: user-service which handles all authentication & user management)
COPY --from=build /app/user-service/target/user-service-1.0.0-SNAPSHOT.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
