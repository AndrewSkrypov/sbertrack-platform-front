package ru.itech.sbertrack.platform.roadmap.infrastructure.persistence

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

@Entity
@Table(name = "roadmaps")
class RoadmapEntity(
    @Id
    val id: UUID,
    @Column(name = "student_id", nullable = false, unique = true)
    val studentId: UUID,
    @Column(name = "trajectory_id", nullable = false)
    val trajectoryId: UUID,
    @Column(nullable = false)
    val title: String,
    @Column(name = "current_node_id", nullable = false)
    val currentNodeId: UUID,
    @Column(name = "progress_percent", nullable = false)
    val progressPercent: Int,
    @Column(name = "selected_at", nullable = false)
    val selectedAt: Instant,
    @Column(name = "expected_finish_date", nullable = false)
    val expectedFinishDate: LocalDate,
)
