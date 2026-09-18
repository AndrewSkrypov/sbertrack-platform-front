package ru.itech.sbertrack.platform.cvbook.infrastructure.persistence

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.cvbook.domain.model.CvBookCandidate

@Component
class CvBookCandidateEntityMapper {
    fun toDomain(entity: CvBookCandidateEntity): CvBookCandidate =
        CvBookCandidate(
            id = entity.id,
            studentId = entity.studentId,
            fullName = entity.fullName,
            organizationName = entity.organizationName,
            completedCasesCount = entity.completedCasesCount,
            averageScore = entity.averageScore,
            competencyProfile = entity.competencyProfile,
            tags = entity.tags,
            priorityStatus = entity.priorityStatus,
            lastActivityAt = entity.lastActivityAt,
        )

    fun toEntity(candidate: CvBookCandidate): CvBookCandidateEntity =
        CvBookCandidateEntity(
            id = candidate.id,
            studentId = candidate.studentId,
            fullName = candidate.fullName,
            organizationName = candidate.organizationName,
            completedCasesCount = candidate.completedCasesCount,
            averageScore = candidate.averageScore,
            competencyProfile = candidate.competencyProfile,
            tags = candidate.tags,
            priorityStatus = candidate.priorityStatus,
            lastActivityAt = candidate.lastActivityAt,
        )
}
