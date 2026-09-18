package ru.itech.sbertrack.platform.news.domain.model

import java.time.Instant
import java.util.UUID

data class NewsPost(
    val id: UUID = UUID.randomUUID(),
    val authorId: UUID,
    val authorName: String,
    val authorInitial: String,
    val category: NewsCategory,
    val pinned: Boolean = false,
    val title: String,
    val body: String,
    val imageLabels: List<String> = emptyList(),
    val likes: Int = 0,
    val comments: Int = 0,
    val views: Int = 0,
    val publishedAt: Instant = Instant.now(),
) {
    init {
        require(title.isNotBlank()) { "Заголовок новости обязателен" }
        require(body.isNotBlank()) { "Текст новости обязателен" }
        require(authorName.isNotBlank()) { "Автор новости обязателен" }
    }
}
