# Use OpenJDK image
FROM openjdk:23-jdk-slim

# Set working directory
WORKDIR /app

# Copy the built jar file
COPY target/eureka-server-0.0.1-SNAPSHOT.jar /app/eureka-server.jar

# Expose port
EXPOSE 8761

# Run the jar
ENTRYPOINT ["java", "-jar", "/app/eureka-server.jar"]