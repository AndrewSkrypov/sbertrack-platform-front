package ru.itech.sbertrack.platform.event.application.mapper

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.event.domain.model.PlatformEvent
import ru.itech.sbertrack.platform.event.dto.response.EventResponse

@Component
class EventMapper {
    fun toResponse(event: PlatformEvent): EventResponse =
        EventResponse(
            id = event.id,
            authorId = event.authorId,
            title = event.title,
            location = event.location,
            startsAt = event.startsAt,
        )
}
