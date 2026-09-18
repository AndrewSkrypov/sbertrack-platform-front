package ru.itech.sbertrack.platform.news.domain.port

import ru.itech.sbertrack.platform.news.domain.model.NewsPost
import java.util.UUID

interface NewsDataPort {
    fun list(): List<NewsPost>
    fun findById(id: UUID): NewsPost?
    fun save(post: NewsPost): NewsPost
}
