# Use an official OpenJDK runtime as a parent image
FROM openjdk:23-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the built JAR file into the container
COPY target/comment-service-0.0.1-SNAPSHOT.jar /app/userInfo-service.jar

# Expose the port the application runs on
EXPOSE 8084

# Run the JAR file
ENTRYPOINT ["java", "-jar", "/app/userInfo-service.jar"]