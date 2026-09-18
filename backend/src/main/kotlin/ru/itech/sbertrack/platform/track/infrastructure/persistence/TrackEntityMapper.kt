package ru.itech.sbertrack.platform.track.infrastructure.persistence

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.track.domain.model.Track

@Component
class TrackEntityMapper {
    fun toDomain(entity: TrackEntity): Track =
        Track(
            id = entity.id,
            title = entity.title,
            description = entity.description,
            customerId = entity.customerId,
            customerName = entity.customerName,
            difficulty = entity.difficulty,
            status = entity.status,
            targetAudience = entity.targetAudience,
            caseIds = entity.caseIds,
            createdAt = entity.createdAt,
        )

    fun toEntity(track: Track): TrackEntity =
        TrackEntity(
            id = track.id,
            title = track.title,
            description = track.description,
            customerId = track.customerId,
            customerName = track.customerName,
            difficulty = track.difficulty,
            status = track.status,
            targetAudience = track.targetAudience,
            caseIds = track.caseIds,
            createdAt = track.createdAt,
        )
}
