package ru.itech.sbertrack.platform.submission.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SubmissionJpaRepository : JpaRepository<SubmissionEntity, UUID>
