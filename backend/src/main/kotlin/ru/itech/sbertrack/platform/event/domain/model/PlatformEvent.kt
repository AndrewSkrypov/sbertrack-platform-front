package ru.itech.sbertrack.platform.event.domain.model

import java.time.Instant
import java.util.UUID

data class PlatformEvent(
    val id: UUID = UUID.randomUUID(),
    val authorId: UUID,
    val title: String,
    val location: String,
    val startsAt: Instant,
    val createdAt: Instant = Instant.now(),
) {
    init {
        require(title.isNotBlank()) { "Название события обязательно" }
        require(location.isNotBlank()) { "Место проведения обязательно" }
    }
}
