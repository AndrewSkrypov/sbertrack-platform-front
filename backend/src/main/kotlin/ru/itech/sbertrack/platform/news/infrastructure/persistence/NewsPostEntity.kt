package ru.itech.sbertrack.platform.news.infrastructure.persistence

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import ru.itech.sbertrack.platform.news.domain.model.NewsCategory
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "news_posts")
class NewsPostEntity(
    @Id
    val id: UUID,
    @Column(name = "author_id", nullable = false)
    val authorId: UUID,
    @Column(name = "author_name", nullable = false)
    val authorName: String,
    @Column(name = "author_initial", nullable = false)
    val authorInitial: String,
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    val category: NewsCategory,
    @Column(nullable = false)
    val pinned: Boolean,
    @Column(nullable = false)
    val title: String,
    @Column(nullable = false)
    val body: String,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "image_labels", nullable = false)
    val imageLabels: List<String>,
    @Column(nullable = false)
    val likes: Int,
    @Column(nullable = false)
    val comments: Int,
    @Column(nullable = false)
    val views: Int,
    @Column(name = "published_at", nullable = false)
    val publishedAt: Instant,
)
