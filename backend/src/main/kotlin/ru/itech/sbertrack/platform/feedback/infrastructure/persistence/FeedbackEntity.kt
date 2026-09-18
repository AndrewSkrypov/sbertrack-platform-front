package ru.itech.sbertrack.platform.feedback.infrastructure.persistence

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import ru.itech.sbertrack.platform.common.model.Competency
import ru.itech.sbertrack.platform.feedback.domain.model.FeedbackAuthorType
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "feedback")
class FeedbackEntity(
    @Id
    val id: UUID,
    @Column(name = "submission_id", nullable = false)
    val submissionId: UUID,
    @Enumerated(EnumType.STRING)
    @Column(name = "author_type", nullable = false, length = 32)
    val authorType: FeedbackAuthorType,
    @Column(name = "author_name", nullable = false)
    val authorName: String,
    @Column(nullable = false)
    val text: String,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    val recommendations: List<String>,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "competency_delta", nullable = false)
    val competencyDelta: Map<Competency, Int>,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant,
)
