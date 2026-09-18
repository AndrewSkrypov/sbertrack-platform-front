pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
    }
    plugins {
        id("org.jetbrains.kotlin.jvm") version "2.1.21"
        id("org.jetbrains.kotlin.plugin.spring") version "2.1.21"
        id("org.jetbrains.kotlin.plugin.jpa") version "2.1.21"
        id("org.springframework.boot") version "3.5.3"
        id("io.spring.dependency-management") version "1.1.7"
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        mavenCentral()
    }
}

rootProject.name = "sbertrack-platform"

include("backend")
