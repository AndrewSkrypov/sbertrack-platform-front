package ru.itech.sbertrack.platform.portfolio.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface PortfolioJpaRepository : JpaRepository<PortfolioEntity, UUID> {
    fun findByStudentId(studentId: UUID): PortfolioEntity?
}
