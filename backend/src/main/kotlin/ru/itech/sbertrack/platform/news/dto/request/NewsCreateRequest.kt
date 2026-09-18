package ru.itech.sbertrack.platform.news.dto.request

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank
import ru.itech.sbertrack.platform.news.domain.model.NewsCategory

@Schema(description = "Создание новости платформы")
data class NewsCreateRequest(
    val category: NewsCategory,
    val pinned: Boolean = false,
    @field:NotBlank
    val title: String,
    @field:NotBlank
    val body: String,
    val imageLabels: List<String> = emptyList(),
)
