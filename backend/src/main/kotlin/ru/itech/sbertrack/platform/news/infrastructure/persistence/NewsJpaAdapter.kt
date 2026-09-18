package ru.itech.sbertrack.platform.news.infrastructure.persistence

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.news.domain.model.NewsPost
import ru.itech.sbertrack.platform.news.domain.port.NewsDataPort
import java.util.UUID

@Component
class NewsJpaAdapter(
    private val repository: NewsJpaRepository,
    private val mapper: NewsEntityMapper,
) : NewsDataPort {
    override fun list(): List<NewsPost> =
        repository.findAll().map(mapper::toDomain)

    override fun findById(id: UUID): NewsPost? =
        repository.findById(id).orElse(null)?.let(mapper::toDomain)

    override fun save(post: NewsPost): NewsPost {
        repository.save(mapper.toEntity(post))
        return post
    }
}
