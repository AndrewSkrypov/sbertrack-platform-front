package ru.itech.sbertrack.platform.track.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface TrackJpaRepository : JpaRepository<TrackEntity, UUID>
