package ru.itech.sbertrack.platform.profiletraits.domain.port

import ru.itech.sbertrack.platform.profiletraits.domain.model.ProfileTraits
import java.util.UUID

interface ProfileTraitsDataPort {
    fun findByStudentId(studentId: UUID): ProfileTraits?
    fun save(traits: ProfileTraits): ProfileTraits
}
