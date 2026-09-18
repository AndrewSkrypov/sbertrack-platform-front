package ru.itech.sbertrack.platform.portfolio.infrastructure.persistence

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import ru.itech.sbertrack.platform.common.model.Competency
import java.util.UUID

@Entity
@Table(name = "portfolios")
class PortfolioEntity(
    @Id
    val id: UUID,
    @Column(name = "student_id", nullable = false, unique = true)
    val studentId: UUID,
    @Column(nullable = false)
    val summary: String,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "completed_cases", nullable = false)
    val completedCases: List<String>,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "competency_profile", nullable = false)
    val competencyProfile: Map<Competency, Int>,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    val artifacts: List<String>,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "feedback_highlights", nullable = false)
    val feedbackHighlights: List<String>,
    @Column(name = "cv_book_included", nullable = false)
    val cvBookIncluded: Boolean,
)
