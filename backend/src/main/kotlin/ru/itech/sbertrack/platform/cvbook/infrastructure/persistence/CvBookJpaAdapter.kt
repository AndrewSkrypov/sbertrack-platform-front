package ru.itech.sbertrack.platform.cvbook.infrastructure.persistence

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.cvbook.domain.model.CvBookCandidate
import ru.itech.sbertrack.platform.cvbook.domain.port.CvBookDataPort
import java.util.UUID

@Component
class CvBookJpaAdapter(
    private val repository: CvBookCandidateJpaRepository,
    private val mapper: CvBookCandidateEntityMapper,
) : CvBookDataPort {
    override fun list(): List<CvBookCandidate> =
        repository.findAll().map(mapper::toDomain)

    override fun findById(id: UUID): CvBookCandidate? =
        repository.findById(id).orElse(null)?.let(mapper::toDomain)

    override fun findByStudentId(studentId: UUID): CvBookCandidate? =
        repository.findByStudentId(studentId)?.let(mapper::toDomain)

    override fun save(candidate: CvBookCandidate): CvBookCandidate {
        repository.save(mapper.toEntity(candidate))
        return candidate
    }
}
