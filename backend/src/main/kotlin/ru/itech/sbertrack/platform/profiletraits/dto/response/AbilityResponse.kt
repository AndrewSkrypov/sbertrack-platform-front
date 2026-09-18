package ru.itech.sbertrack.platform.profiletraits.dto.response

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Способность студента")
data class AbilityResponse(
    val label: String,
    val percent: Int,
)
