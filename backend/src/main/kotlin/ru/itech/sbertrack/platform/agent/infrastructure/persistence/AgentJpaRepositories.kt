package ru.itech.sbertrack.platform.agent.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface AgentJpaRepository : JpaRepository<AgentEntity, UUID>

interface MasterPromptJpaRepository : JpaRepository<MasterPromptEntity, UUID>

interface AgentSessionJpaRepository : JpaRepository<AgentSessionEntity, UUID> {
    fun findFirstByStudentIdAndAgentIdAndCaseIdOrderByCreatedAtDesc(
        studentId: UUID,
        agentId: UUID,
        caseId: UUID,
    ): AgentSessionEntity?

    fun findFirstByStudentIdAndAgentIdAndCaseIdIsNullOrderByCreatedAtDesc(
        studentId: UUID,
        agentId: UUID,
    ): AgentSessionEntity?
}

interface AgentMessageJpaRepository : JpaRepository<AgentMessageEntity, UUID> {
    fun findBySessionIdOrderByCreatedAt(sessionId: UUID): List<AgentMessageEntity>
}
