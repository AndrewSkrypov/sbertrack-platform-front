package ru.itech.sbertrack.platform.news.application.mapper

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.news.domain.model.NewsPost
import ru.itech.sbertrack.platform.news.dto.response.NewsResponse

@Component
class NewsMapper {
    fun toResponse(post: NewsPost): NewsResponse =
        NewsResponse(
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
