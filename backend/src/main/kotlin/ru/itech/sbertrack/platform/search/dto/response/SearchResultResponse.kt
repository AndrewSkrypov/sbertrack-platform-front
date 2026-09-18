package ru.itech.sbertrack.platform.search.dto.response

import io.swagger.v3.oas.annotations.media.Schema
import java.util.UUID

@Schema(description = "Результат поиска по платформе")
data class SearchResultResponse(
    val id: UUID,
    val type: SearchResultType,
    val title: String,
    val subtitle: String,
)
