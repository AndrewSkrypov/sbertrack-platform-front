package ru.itech.sbertrack.platform.event.infrastructure.persistence

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "events")
class EventEntity(
    @Id
    val id: UUID,
    @Column(name = "author_id", nullable = false)
    val authorId: UUID,
    @Column(nullable = false)
    val title: String,
    @Column(nullable = false)
    val location: String,
    @Column(name = "starts_at", nullable = false)
    val startsAt: Instant,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant,
)
