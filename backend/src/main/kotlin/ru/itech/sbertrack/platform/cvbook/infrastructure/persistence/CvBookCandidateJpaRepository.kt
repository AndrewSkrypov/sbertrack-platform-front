package ru.itech.sbertrack.platform.cvbook.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface CvBookCandidateJpaRepository : JpaRepository<CvBookCandidateEntity, UUID> {
    fun findByStudentId(studentId: UUID): CvBookCandidateEntity?
}
