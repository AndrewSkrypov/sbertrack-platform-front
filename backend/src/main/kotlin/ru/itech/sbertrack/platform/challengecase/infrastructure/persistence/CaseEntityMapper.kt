package ru.itech.sbertrack.platform.challengecase.infrastructure.persistence

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.challengecase.domain.model.PracticalCase

@Component
class CaseEntityMapper {
    fun toDomain(entity: CaseEntity): PracticalCase =
        PracticalCase(
            id = entity.id,
            trackId = entity.trackId,
            title = entity.title,
            shortDescription = entity.shortDescription,
            fullDescription = entity.fullDescription,
            customerId = entity.customerId,
            customerName = entity.customerName,
            status = entity.status,
            difficulty = entity.difficulty,
            participantLimit = entity.participantLimit,
            expectedResult = entity.expectedResult,
            feedbackMode = entity.feedbackMode,
            competencyWeights = entity.competencyWeights,
            tags = entity.tags,
            deadline = entity.deadline,
            createdAt = entity.createdAt,
        )

    fun toEntity(practicalCase: PracticalCase): CaseEntity =
        CaseEntity(
            id = practicalCase.id,
            trackId = practicalCase.trackId,
            title = practicalCase.title,
            shortDescription = practicalCase.shortDescription,
            fullDescription = practicalCase.fullDescription,
            customerId = practicalCase.customerId,
            customerName = practicalCase.customerName,
            status = practicalCase.status,
            difficulty = practicalCase.difficulty,
            participantLimit = practicalCase.participantLimit,
            expectedResult = practicalCase.expectedResult,
            feedbackMode = practicalCase.feedbackMode,
            competencyWeights = practicalCase.competencyWeights,
            tags = practicalCase.tags,
            deadline = practicalCase.deadline,
            createdAt = practicalCase.createdAt,
        )
}
