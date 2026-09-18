package ru.itech.sbertrack.platform.agent.infrastructure.persistence

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import ru.itech.sbertrack.platform.agent.domain.model.MasterPromptStatus
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "master_prompts")
class MasterPromptEntity(
    @Id
    val id: UUID,
    @Column(name = "agent_id", nullable = false)
    val agentId: UUID,
    @Column(nullable = false)
    val title: String,
    @Column(name = "prompt_text", nullable = false)
    val promptText: String,
    @Column(nullable = false)
    val version: Int,
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    val status: MasterPromptStatus,
    @Column(name = "created_by", nullable = false)
    val createdBy: UUID,
    @Column(name = "updated_at", nullable = false)
    val updatedAt: Instant,
)
