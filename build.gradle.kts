plugins {
    base
    id("org.jetbrains.kotlin.jvm") apply false
    id("org.jetbrains.kotlin.plugin.spring") apply false
    id("org.springframework.boot") apply false
    id("io.spring.dependency-management") apply false
}

group = "ru.itech.sbertrack.platform"
version = "0.1.0-SNAPSHOT"

tasks.register("buildBackend") {
    group = "verification"
    dependsOn(":backend:build")
}
