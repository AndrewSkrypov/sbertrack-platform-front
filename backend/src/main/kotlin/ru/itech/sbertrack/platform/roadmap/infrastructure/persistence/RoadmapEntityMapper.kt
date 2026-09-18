package ru.itech.sbertrack.platform.roadmap.infrastructure.persistence

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.roadmap.domain.model.RoadmapStep
import ru.itech.sbertrack.platform.roadmap.domain.model.StudentRoadmap

@Component
class RoadmapEntityMapper {
    fun toDomain(entity: RoadmapEntity, steps: List<RoadmapStep>): StudentRoadmap =
        StudentRoadmap(
            id = entity.id,
            studentId = entity.studentId,
            trajectoryId = entity.trajectoryId,
            title = entity.title,
            currentNodeId = entity.currentNodeId,
            progressPercent = entity.progressPercent,
            selectedAt = entity.selectedAt,
            expectedFinishDate = entity.expectedFinishDate,
            steps = steps,
        )

    fun toEntity(roadmap: StudentRoadmap): RoadmapEntity =
        RoadmapEntity(
            id = roadmap.id,
            studentId = roadmap.studentId,
            trajectoryId = roadmap.trajectoryId,
            title = roadmap.title,
            currentNodeId = roadmap.currentNodeId,
            progressPercent = roadmap.progressPercent,
            selectedAt = roadmap.selectedAt,
            expectedFinishDate = roadmap.expectedFinishDate,
        )

    fun toStepDomain(entity: RoadmapStepEntity): RoadmapStep =
        RoadmapStep(
            id = entity.id,
            roadmapId = entity.roadmapId,
            nodeId = entity.nodeId,
            title = entity.title,
            description = entity.description,
            status = entity.status,
            caseId = entity.caseId,
            orderIndex = entity.orderIndex,
        )

    fun toStepEntity(step: RoadmapStep): RoadmapStepEntity =
        RoadmapStepEntity(
            id = step.id,
            roadmapId = step.roadmapId,
            nodeId = step.nodeId,
            title = step.title,
            description = step.description,
            status = step.status,
            caseId = step.caseId,
            orderIndex = step.orderIndex,
        )
}
