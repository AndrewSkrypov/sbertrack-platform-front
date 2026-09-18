package ru.itech.sbertrack.platform.event.domain.port

import ru.itech.sbertrack.platform.event.domain.model.PlatformEvent
import java.util.UUID

interface EventDataPort {
    fun list(): List<PlatformEvent>
    fun findById(id: UUID): PlatformEvent?
    fun save(event: PlatformEvent): PlatformEvent
}
