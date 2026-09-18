package ru.itech.sbertrack.platform.event.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface EventJpaRepository : JpaRepository<EventEntity, UUID>
