package ru.itech.sbertrack.platform.roadmap.infrastructure.persistence

import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import ru.itech.sbertrack.platform.roadmap.domain.model.StudentRoadmap
import ru.itech.sbertrack.platform.roadmap.domain.port.RoadmapDataPort
import java.util.UUID

@Component
class RoadmapJpaAdapter(
    private val roadmapRepository: RoadmapJpaRepository,
    private val stepRepository: RoadmapStepJpaRepository,
    private val mapper: RoadmapEntityMapper,
) : RoadmapDataPort {
    override fun findById(id: UUID): StudentRoadmap? =
        roadmapRepository.findById(id).orElse(null)?.let { toDomain(it) }

    override fun findByStudentId(studentId: UUID): StudentRoadmap? =
        roadmapRepository.findByStudentId(studentId)?.let { toDomain(it) }

    @Transactional
    override fun save(roadmap: StudentRoadmap): StudentRoadmap {
        roadmapRepository.save(mapper.toEntity(roadmap))
        stepRepository.deleteByRoadmapId(roadmap.id)
        stepRepository.saveAll(roadmap.steps.map(mapper::toStepEntity))
        return roadmap
    }

    private fun toDomain(entity: RoadmapEntity): StudentRoadmap {
        val steps = stepRepository.findByRoadmapIdOrderByOrderIndex(entity.id).map(mapper::toStepDomain)
        return mapper.toDomain(entity, steps)
    }
}
