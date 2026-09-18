package ru.itech.sbertrack.platform.reflection.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface ReflectionJpaRepository : JpaRepository<ReflectionEntity, UUID> {
    fun findBySubmissionId(submissionId: UUID): ReflectionEntity?
}
