package ru.itech.sbertrack.platform.trajectory.infrastructure.persistence

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.trajectory.domain.model.Trajectory
import ru.itech.sbertrack.platform.trajectory.domain.model.TrajectoryNode

@Component
class TrajectoryEntityMapper {
    fun toDomain(entity: TrajectoryEntity, nodeIds: List<java.util.UUID>): Trajectory =
        Trajectory(
            id = entity.id,
            title = entity.title,
            description = entity.description,
            targetRoleTitle = entity.targetRoleTitle,
            targetRoleDescription = entity.targetRoleDescription,
            direction = entity.direction,
            difficulty = entity.difficulty,
            estimatedDurationWeeks = entity.estimatedDurationWeeks,
            nodeIds = nodeIds,
            createdAt = entity.createdAt,
        )

    fun toNodeDomain(entity: TrajectoryNodeEntity): TrajectoryNode =
        TrajectoryNode(
            id = entity.id,
            trajectoryId = entity.trajectoryId,
            title = entity.title,
            description = entity.description,
            type = entity.type,
            positionX = entity.positionX,
            positionY = entity.positionY,
            trackId = entity.trackId,
            caseId = entity.caseId,
            requiredCompetencies = entity.requiredCompetencies,
            status = entity.status,
            nextNodeIds = entity.nextNodeIds,
        )
}
