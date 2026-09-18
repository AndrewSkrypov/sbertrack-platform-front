package ru.itech.sbertrack.platform.profiletraits.infrastructure.persistence

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import ru.itech.sbertrack.platform.profiletraits.domain.model.Ability
import ru.itech.sbertrack.platform.profiletraits.domain.model.SelfRatedSkill
import java.util.UUID

@Entity
@Table(name = "profile_traits")
class ProfileTraitsEntity(
    @Id
    val id: UUID,
    @Column(name = "student_id", nullable = false, unique = true)
    val studentId: UUID,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "professional_tags", nullable = false)
    val professionalTags: List<String>,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    val interests: List<String>,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    val motivations: List<String>,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    val abilities: List<Ability>,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "self_rated_skills", nullable = false)
    val selfRatedSkills: List<SelfRatedSkill>,
    @Column(name = "psychotype_completed", nullable = false)
    val psychotypeCompleted: Boolean,
)
