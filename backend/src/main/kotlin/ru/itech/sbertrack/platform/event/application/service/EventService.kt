package ru.itech.sbertrack.platform.event.application.service

import org.springframework.stereotype.Service
import ru.itech.sbertrack.platform.auth.application.service.AuthService
import ru.itech.sbertrack.platform.common.exception.NotFoundException
import ru.itech.sbertrack.platform.event.application.mapper.EventMapper
import ru.itech.sbertrack.platform.event.domain.model.PlatformEvent
import ru.itech.sbertrack.platform.event.domain.port.EventDataPort
import ru.itech.sbertrack.platform.event.dto.request.EventCreateRequest
import ru.itech.sbertrack.platform.event.dto.response.EventResponse
import ru.itech.sbertrack.platform.user.domain.model.User
import ru.itech.sbertrack.platform.user.domain.model.UserRole
import ru.itech.sbertrack.platform.user.domain.port.UserDataPort
import java.time.Instant
import java.util.UUID

@Service
class EventService(
    private val eventDataPort: EventDataPort,
    private val userDataPort: UserDataPort,
    private val eventMapper: EventMapper,
    private val authService: AuthService,
) {
    fun listUpcoming(): List<EventResponse> =
        eventDataPort.list()
            .filter { it.startsAt.isAfter(Instant.now()) }
            .sortedBy { it.startsAt }
            .map(eventMapper::toResponse)

    fun get(id: UUID): EventResponse =
        eventDataPort.findById(id)?.let(eventMapper::toResponse)
            ?: throw NotFoundException("Событие не найдено")

    fun create(request: EventCreateRequest, authorization: String?): EventResponse {
        val author = resolveAuthor(authorization)
        val event = PlatformEvent(
            authorId = author.id,
            title = request.title,
            location = request.location,
            startsAt = request.startsAt,
        )
        return eventMapper.toResponse(eventDataPort.save(event))
    }

    private fun resolveAuthor(authorization: String?): User {
        val current = authService.tryCurrentUser(authorization)
        if (current != null && current.role in setOf(UserRole.MODERATOR, UserRole.CUSTOMER, UserRole.ADMIN)) {
            return current
        }
        return userDataPort.list().first { it.role == UserRole.MODERATOR }
    }
}
