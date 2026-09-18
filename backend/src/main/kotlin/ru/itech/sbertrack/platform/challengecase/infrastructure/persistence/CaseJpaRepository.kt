package ru.itech.sbertrack.platform.challengecase.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface CaseJpaRepository : JpaRepository<CaseEntity, UUID>
