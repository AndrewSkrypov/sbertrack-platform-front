package ru.itech.sbertrack.platform.news.dto.response

import io.swagger.v3.oas.annotations.media.Schema
import ru.itech.sbertrack.platform.news.domain.model.NewsCategory
import java.time.Instant
import java.util.UUID

@Schema(description = "Новость платформы")
data class NewsResponse(
    val id: UUID,
    val authorId: UUID,
    val authorName: String,
    val authorInitial: String,
    val category: NewsCategory,
    val pinned: Boolean,
    val title: String,
    val body: String,
    val imageLabels: List<String>,
    val likes: Int,
    val comments: Int,
    val views: Int,
    val publishedAt: Instant,
)
