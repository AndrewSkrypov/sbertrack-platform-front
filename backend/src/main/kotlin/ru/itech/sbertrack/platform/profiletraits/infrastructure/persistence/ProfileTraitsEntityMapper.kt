package ru.itech.sbertrack.platform.profiletraits.infrastructure.persistence

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.profiletraits.domain.model.ProfileTraits

@Component
class ProfileTraitsEntityMapper {
    fun toDomain(entity: ProfileTraitsEntity): ProfileTraits =
        ProfileTraits(
            id = entity.id,
            studentId = entity.studentId,
            professionalTags = entity.professionalTags,
            interests = entity.interests,
            motivations = entity.motivations,
            abilities = entity.abilities,
            selfRatedSkills = entity.selfRatedSkills,
            psychotypeCompleted = entity.psychotypeCompleted,
        )

    fun toEntity(traits: ProfileTraits): ProfileTraitsEntity =
        ProfileTraitsEntity(
            id = traits.id,
            studentId = traits.studentId,
            professionalTags = traits.professionalTags,
            interests = traits.interests,
            motivations = traits.motivations,
            abilities = traits.abilities,
            selfRatedSkills = traits.selfRatedSkills,
            psychotypeCompleted = traits.psychotypeCompleted,
        )
}
