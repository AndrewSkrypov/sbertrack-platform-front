package ru.itech.sbertrack.platform.profiletraits.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface ProfileTraitsJpaRepository : JpaRepository<ProfileTraitsEntity, UUID> {
    fun findByStudentId(studentId: UUID): ProfileTraitsEntity?
}
