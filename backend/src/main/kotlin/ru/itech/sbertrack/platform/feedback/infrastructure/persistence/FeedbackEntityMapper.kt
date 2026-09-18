package ru.itech.sbertrack.platform.feedback.infrastructure.persistence

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.feedback.domain.model.Feedback

@Component
class FeedbackEntityMapper {
    fun toDomain(entity: FeedbackEntity): Feedback =
        Feedback(
            id = entity.id,
            submissionId = entity.submissionId,
            authorType = entity.authorType,
            authorName = entity.authorName,
            text = entity.text,
            recommendations = entity.recommendations,
            competencyDelta = entity.competencyDelta,
            createdAt = entity.createdAt,
        )

    fun toEntity(feedback: Feedback): FeedbackEntity =
        FeedbackEntity(
            id = feedback.id,
            submissionId = feedback.submissionId,
            authorType = feedback.authorType,
            authorName = feedback.authorName,
            text = feedback.text,
            recommendations = feedback.recommendations,
            competencyDelta = feedback.competencyDelta,
            createdAt = feedback.createdAt,
        )
}
