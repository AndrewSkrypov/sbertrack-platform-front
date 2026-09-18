package ru.itech.sbertrack.platform.trajectory.infrastructure.persistence

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import ru.itech.sbertrack.platform.common.model.Competency
import ru.itech.sbertrack.platform.trajectory.domain.model.TrajectoryNodeStatus
import ru.itech.sbertrack.platform.trajectory.domain.model.TrajectoryNodeType
import java.util.UUID

@Entity
@Table(name = "trajectory_nodes")
class TrajectoryNodeEntity(
    @Id
    val id: UUID,
    @Column(name = "trajectory_id", nullable = false)
    val trajectoryId: UUID,
    @Column(nullable = false)
    val title: String,
    @Column(nullable = false)
    val description: String,
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    val type: TrajectoryNodeType,
    @Column(name = "position_x", nullable = false)
    val positionX: Int,
    @Column(name = "position_y", nullable = false)
    val positionY: Int,
    @Column(name = "track_id")
    val trackId: UUID?,
    @Column(name = "case_id")
    val caseId: UUID?,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "required_competencies", nullable = false)
    val requiredCompetencies: Map<Competency, Int>,
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    val status: TrajectoryNodeStatus,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "next_node_ids", nullable = false)
    val nextNodeIds: List<UUID>,
)
