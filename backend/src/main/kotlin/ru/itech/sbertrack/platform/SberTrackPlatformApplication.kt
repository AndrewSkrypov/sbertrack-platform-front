package ru.itech.sbertrack.platform

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class SberTrackPlatformApplication

fun main(args: Array<String>) {
    runApplication<SberTrackPlatformApplication>(*args)
}
