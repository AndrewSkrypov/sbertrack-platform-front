package ru.itech.sbertrack.platform.profiletraits.domain.model

import java.util.UUID

data class ProfileTraits(
    val id: UUID = UUID.randomUUID(),
    val studentId: UUID,
    val professionalTags: List<String> = emptyList(),
    val interests: List<String> = emptyList(),
    val motivations: List<String> = emptyList(),
    val abilities: List<Ability> = emptyList(),
    val selfRatedSkills: List<SelfRatedSkill> = emptyList(),
    val psychotypeCompleted: Boolean = false,
) {
    fun update(
        professionalTags: List<String>,
        interests: List<String>,
        motivations: List<String>,
    ): ProfileTraits = copy(
        professionalTags = professionalTags,
        interests = interests,
        motivations = motivations,
    )
}
