package ru.itech.sbertrack.platform.roadmap.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface RoadmapJpaRepository : JpaRepository<RoadmapEntity, UUID> {
    fun findByStudentId(studentId: UUID): RoadmapEntity?
}

interface RoadmapStepJpaRepository : JpaRepository<RoadmapStepEntity, UUID> {
    fun findByRoadmapIdOrderByOrderIndex(roadmapId: UUID): List<RoadmapStepEntity>

    fun deleteByRoadmapId(roadmapId: UUID)
}
