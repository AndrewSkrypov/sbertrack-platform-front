package ru.itech.sbertrack.platform.challengecase.infrastructure.persistence

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import ru.itech.sbertrack.platform.challengecase.domain.model.CaseStatus
import ru.itech.sbertrack.platform.challengecase.domain.model.FeedbackMode
import ru.itech.sbertrack.platform.common.model.Competency
import ru.itech.sbertrack.platform.common.model.Difficulty
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

@Entity
@Table(name = "cases")
class CaseEntity(
    @Id
    val id: UUID,
    @Column(name = "track_id", nullable = false)
    val trackId: UUID,
    @Column(nullable = false)
    val title: String,
    @Column(name = "short_description", nullable = false)
    val shortDescription: String,
    @Column(name = "full_description", nullable = false)
    val fullDescription: String,
    @Column(name = "customer_id", nullable = false)
    val customerId: UUID,
    @Column(name = "customer_name", nullable = false)
    val customerName: String,
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    val status: CaseStatus,
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    val difficulty: Difficulty,
    @Column(name = "participant_limit", nullable = false)
    val participantLimit: Int,
    @Column(name = "expected_result", nullable = false)
    val expectedResult: String,
    @Enumerated(EnumType.STRING)
    @Column(name = "feedback_mode", nullable = false, length = 32)
    val feedbackMode: FeedbackMode,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "competency_weights", nullable = false)
    val competencyWeights: Map<Competency, Int>,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    val tags: List<String>,
    @Column(nullable = false)
    val deadline: LocalDate,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant,
)
