package ru.itech.sbertrack.platform.agent.infrastructure.persistence

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import ru.itech.sbertrack.platform.agent.domain.model.AgentCapability
import ru.itech.sbertrack.platform.agent.domain.model.AgentSpecialization
import ru.itech.sbertrack.platform.agent.domain.model.AgentStatus
import java.util.UUID

@Entity
@Table(name = "agents")
class AgentEntity(
    @Id
    val id: UUID,
    @Column(nullable = false, unique = true)
    val code: String,
    @Column(nullable = false)
    val name: String,
    @Column(nullable = false)
    val description: String,
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    val specialization: AgentSpecialization,
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    val status: AgentStatus,
    @Column(name = "master_prompt_id")
    val masterPromptId: UUID?,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    val capabilities: List<AgentCapability>,
)
