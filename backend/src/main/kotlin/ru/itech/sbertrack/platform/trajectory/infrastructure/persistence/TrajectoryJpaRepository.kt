package ru.itech.sbertrack.platform.trajectory.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface TrajectoryJpaRepository : JpaRepository<TrajectoryEntity, UUID>

interface TrajectoryNodeJpaRepository : JpaRepository<TrajectoryNodeEntity, UUID> {
    fun findByTrajectoryId(trajectoryId: UUID): List<TrajectoryNodeEntity>
}
