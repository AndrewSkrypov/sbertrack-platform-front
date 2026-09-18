package ru.itech.sbertrack.platform.challengecase.infrastructure.persistence

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.challengecase.domain.model.PracticalCase
import ru.itech.sbertrack.platform.challengecase.domain.port.CaseDataPort
import java.util.UUID

@Component
class CaseJpaAdapter(
    private val repository: CaseJpaRepository,
    private val mapper: CaseEntityMapper,
) : CaseDataPort {
    override fun list(): List<PracticalCase> =
        repository.findAll().map(mapper::toDomain)

    override fun findById(id: UUID): PracticalCase? =
        repository.findById(id).orElse(null)?.let(mapper::toDomain)

    override fun save(practicalCase: PracticalCase): PracticalCase {
        repository.save(mapper.toEntity(practicalCase))
        return practicalCase
    }
}
