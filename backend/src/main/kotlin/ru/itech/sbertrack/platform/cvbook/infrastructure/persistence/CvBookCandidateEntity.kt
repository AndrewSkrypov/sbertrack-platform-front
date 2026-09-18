package ru.itech.sbertrack.platform.cvbook.infrastructure.persistence

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import ru.itech.sbertrack.platform.common.model.Competency
import ru.itech.sbertrack.platform.cvbook.domain.model.PriorityStatus
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "cvbook_candidates")
class CvBookCandidateEntity(
    @Id
    val id: UUID,
    @Column(name = "student_id", nullable = false, unique = true)
    val studentId: UUID,
    @Column(name = "full_name", nullable = false)
    val fullName: String,
    @Column(name = "organization_name")
    val organizationName: String?,
    @Column(name = "completed_cases_count", nullable = false)
    val completedCasesCount: Int,
    @Column(name = "average_score", nullable = false)
    val averageScore: Int,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "competency_profile", nullable = false)
    val competencyProfile: Map<Competency, Int>,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    val tags: List<String>,
    @Enumerated(EnumType.STRING)
    @Column(name = "priority_status", nullable = false, length = 32)
    val priorityStatus: PriorityStatus,
    @Column(name = "last_activity_at", nullable = false)
    val lastActivityAt: Instant,
)
