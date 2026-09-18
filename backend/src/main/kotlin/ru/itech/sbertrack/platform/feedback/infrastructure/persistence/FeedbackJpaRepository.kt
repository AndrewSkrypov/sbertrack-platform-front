package ru.itech.sbertrack.platform.feedback.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface FeedbackJpaRepository : JpaRepository<FeedbackEntity, UUID> {
    fun findBySubmissionId(submissionId: UUID): List<FeedbackEntity>
}
