package ru.itech.sbertrack.platform.profiletraits.dto.response

import io.swagger.v3.oas.annotations.media.Schema
import java.util.UUID

@Schema(description = "Расширенные характеристики профиля студента")
data class ProfileTraitsResponse(
    val id: UUID,
    val studentId: UUID,
    val professionalTags: List<String>,
    val interests: List<String>,
    val motivations: List<String>,
    val abilities: List<AbilityResponse>,
    val selfRatedSkills: List<SelfRatedSkillResponse>,
    val psychotypeCompleted: Boolean,
)
