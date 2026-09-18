package ru.itech.sbertrack.platform.reflection.infrastructure.persistence

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.reflection.domain.model.Reflection
import ru.itech.sbertrack.platform.reflection.domain.port.ReflectionDataPort
import java.util.UUID

@Component
class ReflectionJpaAdapter(
    private val repository: ReflectionJpaRepository,
    private val mapper: ReflectionEntityMapper,
) : ReflectionDataPort {
    override fun findBySubmissionId(submissionId: UUID): Reflection? =
        repository.findBySubmissionId(submissionId)?.let(mapper::toDomain)

    override fun save(reflection: Reflection): Reflection {
        repository.save(mapper.toEntity(reflection))
        return reflection
    }
}
