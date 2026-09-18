package ru.itech.sbertrack.platform.reflection.infrastructure.persistence

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "reflections")
class ReflectionEntity(
    @Id
    val id: UUID,
    @Column(name = "submission_id", nullable = false, unique = true)
    val submissionId: UUID,
    @Column(name = "student_id", nullable = false)
    val studentId: UUID,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    val answers: Map<String, String>,
    @Column(nullable = false)
    val summary: String,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant,
)
