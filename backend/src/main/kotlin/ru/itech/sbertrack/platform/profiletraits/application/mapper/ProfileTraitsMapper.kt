package ru.itech.sbertrack.platform.profiletraits.application.mapper

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.profiletraits.domain.model.ProfileTraits
import ru.itech.sbertrack.platform.profiletraits.dto.response.AbilityResponse
import ru.itech.sbertrack.platform.profiletraits.dto.response.ProfileTraitsResponse
import ru.itech.sbertrack.platform.profiletraits.dto.response.SelfRatedSkillResponse

@Component
class ProfileTraitsMapper {
    fun toResponse(traits: ProfileTraits): ProfileTraitsResponse =
        ProfileTraitsResponse(
            id = traits.id,
            studentId = traits.studentId,
            professionalTags = traits.professionalTags,
            interests = traits.interests,
            motivations = traits.motivations,
            abilities = traits.abilities.map { AbilityResponse(it.label, it.percent) },
            selfRatedSkills = traits.selfRatedSkills.map { SelfRatedSkillResponse(it.label, it.level) },
            psychotypeCompleted = traits.psychotypeCompleted,
        )
}
