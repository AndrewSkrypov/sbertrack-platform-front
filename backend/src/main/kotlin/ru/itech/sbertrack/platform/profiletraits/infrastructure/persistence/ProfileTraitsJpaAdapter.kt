package ru.itech.sbertrack.platform.profiletraits.infrastructure.persistence

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.profiletraits.domain.model.ProfileTraits
import ru.itech.sbertrack.platform.profiletraits.domain.port.ProfileTraitsDataPort
import java.util.UUID

@Component
class ProfileTraitsJpaAdapter(
    private val repository: ProfileTraitsJpaRepository,
    private val mapper: ProfileTraitsEntityMapper,
) : ProfileTraitsDataPort {
    override fun findByStudentId(studentId: UUID): ProfileTraits? =
        repository.findByStudentId(studentId)?.let(mapper::toDomain)

    override fun save(traits: ProfileTraits): ProfileTraits {
        repository.save(mapper.toEntity(traits))
        return traits
    }
}
