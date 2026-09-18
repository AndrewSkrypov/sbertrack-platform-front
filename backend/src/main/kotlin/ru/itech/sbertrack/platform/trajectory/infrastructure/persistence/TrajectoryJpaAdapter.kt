package ru.itech.sbertrack.platform.trajectory.infrastructure.persistence

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.trajectory.domain.model.Trajectory
import ru.itech.sbertrack.platform.trajectory.domain.model.TrajectoryNode
import ru.itech.sbertrack.platform.trajectory.domain.port.TrajectoryDataPort
import java.util.UUID

@Component
class TrajectoryJpaAdapter(
    private val trajectoryRepository: TrajectoryJpaRepository,
    private val nodeRepository: TrajectoryNodeJpaRepository,
    private val mapper: TrajectoryEntityMapper,
) : TrajectoryDataPort {
    override fun list(): List<Trajectory> =
        trajectoryRepository.findAll().map { toDomain(it) }

    override fun findById(id: UUID): Trajectory? =
        trajectoryRepository.findById(id).orElse(null)?.let { toDomain(it) }

    override fun listNodes(trajectoryId: UUID): List<TrajectoryNode> =
        nodeRepository.findByTrajectoryId(trajectoryId).map(mapper::toNodeDomain)

    override fun findNodeById(id: UUID): TrajectoryNode? =
        nodeRepository.findById(id).orElse(null)?.let(mapper::toNodeDomain)

    private fun toDomain(entity: TrajectoryEntity): Trajectory {
        val nodeIds = nodeRepository.findByTrajectoryId(entity.id).map { it.id }
        return mapper.toDomain(entity, nodeIds)
    }
}
