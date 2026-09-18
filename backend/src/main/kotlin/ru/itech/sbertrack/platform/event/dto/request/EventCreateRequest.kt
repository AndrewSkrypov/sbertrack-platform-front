package ru.itech.sbertrack.platform.event.dto.request

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank
import java.time.Instant

@Schema(description = "Создание события платформы")
data class EventCreateRequest(
    @field:NotBlank
    val title: String,
    @field:NotBlank
    val location: String,
    val startsAt: Instant,
)
