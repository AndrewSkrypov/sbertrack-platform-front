package ru.itech.sbertrack.platform.profiletraits.dto.response

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Навык студента с самооценкой")
data class SelfRatedSkillResponse(
    val label: String,
    val level: Int,
)
