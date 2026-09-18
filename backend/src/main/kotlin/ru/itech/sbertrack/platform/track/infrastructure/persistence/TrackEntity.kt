package ru.itech.sbertrack.platform.track.infrastructure.persistence

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import ru.itech.sbertrack.platform.common.model.Difficulty
import ru.itech.sbertrack.platform.track.domain.model.TrackStatus
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "tracks")
class TrackEntity(
    @Id
    val id: UUID,
    @Column(nullable = false)
    val title: String,
    @Column(nullable = false)
    val description: String,
    @Column(name = "customer_id", nullable = false)
    val customerId: UUID,
    @Column(name = "customer_name", nullable = false)
    val customerName: String,
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    val difficulty: Difficulty,
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    val status: TrackStatus,
    @Column(name = "target_audience", nullable = false)
    val targetAudience: String,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "case_ids", nullable = false)
    val caseIds: List<UUID>,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant,
)
