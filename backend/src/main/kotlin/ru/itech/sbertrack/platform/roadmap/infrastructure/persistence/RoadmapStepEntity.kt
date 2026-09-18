package ru.itech.sbertrack.platform.roadmap.infrastructure.persistence

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import ru.itech.sbertrack.platform.trajectory.domain.model.TrajectoryNodeStatus
import java.util.UUID

@Entity
@Table(name = "roadmap_steps")
class RoadmapStepEntity(
    @Id
    val id: UUID,
    @Column(name = "roadmap_id", nullable = false)
    val roadmapId: UUID,
    @Column(name = "node_id", nullable = false)
    val nodeId: UUID,
    @Column(nullable = false)
    val title: String,
    @Column(nullable = false)
    val description: String,
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    val status: TrajectoryNodeStatus,
    @Column(name = "case_id")
    val caseId: UUID?,
    @Column(name = "order_index", nullable = false)
    val orderIndex: Int,
)
