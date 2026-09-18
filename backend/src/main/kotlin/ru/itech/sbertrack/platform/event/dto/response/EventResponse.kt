package ru.itech.sbertrack.platform.event.dto.response

import io.swagger.v3.oas.annotations.media.Schema
import java.time.Instant
import java.util.UUID

@Schema(description = "Событие платформы")
data class EventResponse(
    val id: UUID,
    val authorId: UUID,
    val title: String,
    val location: String,
    val startsAt: Instant,
)
