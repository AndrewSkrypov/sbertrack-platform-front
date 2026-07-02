FROM gradle:8.10.2-jdk21 AS build
WORKDIR /workspace
COPY --chown=gradle:gradle . .
RUN --mount=type=cache,target=/home/gradle/.gradle,sharing=locked ./gradlew :backend:bootJar --no-daemon --no-watch-fs

FROM eclipse-temurin:21-jre-jammy
RUN apt-get update && apt-get install -y --no-install-recommends curl fonts-dejavu-core && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /workspace/backend/build/libs/*.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
