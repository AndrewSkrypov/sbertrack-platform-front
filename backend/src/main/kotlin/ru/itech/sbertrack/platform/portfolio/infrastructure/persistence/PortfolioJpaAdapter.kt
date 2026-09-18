package ru.itech.sbertrack.platform.portfolio.infrastructure.persistence

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.portfolio.domain.model.Portfolio
import ru.itech.sbertrack.platform.portfolio.domain.port.PortfolioDataPort
import java.util.UUID

@Component
class PortfolioJpaAdapter(
    private val repository: PortfolioJpaRepository,
    private val mapper: PortfolioEntityMapper,
) : PortfolioDataPort {
    override fun list(): List<Portfolio> =
        repository.findAll().map(mapper::toDomain)

    override fun findByStudentId(studentId: UUID): Portfolio? =
        repository.findByStudentId(studentId)?.let(mapper::toDomain)

    override fun save(portfolio: Portfolio): Portfolio {
        repository.save(mapper.toEntity(portfolio))
        return portfolio
    }
}
