package ru.itech.sbertrack.platform.news.infrastructure.persistence

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.news.domain.model.NewsPost

@Component
class NewsEntityMapper {
    fun toDomain(entity: NewsPostEntity): NewsPost =
        NewsPost(
            id = entity.id,
            authorId = entity.authorId,
            authorName = entity.authorName,
            authorInitial = entity.authorInitial,
            category = entity.category,
            pinned = entity.pinned,
            title = entity.title,
            body = entity.body,
            imageLabels = entity.imageLabels,
            likes = entity.likes,
            comments = entity.comments,
            views = entity.views,
            publishedAt = entity.publishedAt,
        )

    fun toEntity(post: NewsPost): NewsPostEntity =
        NewsPostEntity(
            id = post.id,
            authorId = post.authorId,
            authorName = post.authorName,
            authorInitial = post.authorInitial,
            category = post.category,
            pinned = post.pinned,
            title = post.title,
            body = post.body,
            imageLabels = post.imageLabels,
            likes = post.likes,
            comments = post.comments,
            views = post.views,
            publishedAt = post.publishedAt,
        )
}
