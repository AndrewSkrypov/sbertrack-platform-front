package ru.itech.sbertrack.platform.profiletraits.dto.request

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Обновление редактируемых характеристик профиля")
data class ProfileTraitsUpdateRequest(
    val professionalTags: List<String>,
    val interests: List<String>,
    val motivations: List<String>,
)
