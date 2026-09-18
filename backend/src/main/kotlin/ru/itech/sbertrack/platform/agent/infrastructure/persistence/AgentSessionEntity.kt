package ru.itech.sbertrack.platform.agent.infrastructure.persistence

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "agent_sessions")
class AgentSessionEntity(
    @Id
    val id: UUID,
    @Column(name = "student_id", nullable = false)
    val studentId: UUID,
    @Column(name = "case_id")
    val caseId: UUID?,
    @Column(name = "agent_id", nullable = false)
    val agentId: UUID,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant,
)
