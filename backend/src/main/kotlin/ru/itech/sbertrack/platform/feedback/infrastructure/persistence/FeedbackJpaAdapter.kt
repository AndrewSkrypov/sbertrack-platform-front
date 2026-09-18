package ru.itech.sbertrack.platform.feedback.infrastructure.persistence

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.feedback.domain.model.Feedback
import ru.itech.sbertrack.platform.feedback.domain.port.FeedbackDataPort
import java.util.UUID

@Component
class FeedbackJpaAdapter(
    private val repository: FeedbackJpaRepository,
    private val mapper: FeedbackEntityMapper,
) : FeedbackDataPort {
    override fun list(): List<Feedback> =
        repository.findAll().map(mapper::toDomain)

    override fun findById(id: UUID): Feedback? =
        repository.findById(id).orElse(null)?.let(mapper::toDomain)

    override fun listBySubmissionId(submissionId: UUID): List<Feedback> =
        repository.findBySubmissionId(submissionId).map(mapper::toDomain)

    override fun save(feedback: Feedback): Feedback {
        repository.save(mapper.toEntity(feedback))
        return feedback
    }
}
