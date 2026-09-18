package ru.itech.sbertrack.platform.event.infrastructure.persistence

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.event.domain.model.PlatformEvent

@Component
class EventEntityMapper {
    fun toDomain(entity: EventEntity): PlatformEvent =
        PlatformEvent(
            id = entity.id,
            authorId = entity.authorId,
            title = entity.title,
            location = entity.location,
            startsAt = entity.startsAt,
            createdAt = entity.createdAt,
        )

    fun toEntity(event: PlatformEvent): EventEntity =
        EventEntity(
            id = event.id,
            authorId = event.authorId,
            title = event.title,
            location = event.location,
            startsAt = event.startsAt,
            createdAt = event.createdAt,
        )
}
