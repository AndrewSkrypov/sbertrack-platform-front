package ru.itech.sbertrack.platform.trajectory.infrastructure.persistence

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import ru.itech.sbertrack.platform.common.model.Difficulty
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "trajectories")
class TrajectoryEntity(
    @Id
    val id: UUID,
    @Column(nullable = false)
    val title: String,
    @Column(nullable = false)
    val description: String,
    @Column(name = "target_role_title", nullable = false)
    val targetRoleTitle: String,
    @Column(name = "target_role_description", nullable = false)
    val targetRoleDescription: String,
    @Column(nullable = false)
    val direction: String,
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    val difficulty: Difficulty,
    @Column(name = "estimated_duration_weeks", nullable = false)
    val estimatedDurationWeeks: Int,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant,
)
