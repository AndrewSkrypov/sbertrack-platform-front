package ru.itech.sbertrack.platform.event.infrastructure.persistence

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.event.domain.model.PlatformEvent
import ru.itech.sbertrack.platform.event.domain.port.EventDataPort
import java.util.UUID

@Component
class EventJpaAdapter(
    private val repository: EventJpaRepository,
    private val mapper: EventEntityMapper,
) : EventDataPort {
    override fun list(): List<PlatformEvent> =
        repository.findAll().map(mapper::toDomain)

    override fun findById(id: UUID): PlatformEvent? =
        repository.findById(id).orElse(null)?.let(mapper::toDomain)

    override fun save(event: PlatformEvent): PlatformEvent {
        repository.save(mapper.toEntity(event))
        return event
    }
}
