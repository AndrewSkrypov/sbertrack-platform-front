package ru.itech.sbertrack.platform.news.application.service

import org.springframework.stereotype.Service
import ru.itech.sbertrack.platform.auth.application.service.AuthService
import ru.itech.sbertrack.platform.common.exception.NotFoundException
import ru.itech.sbertrack.platform.news.application.mapper.NewsMapper
import ru.itech.sbertrack.platform.news.domain.model.NewsCategory
import ru.itech.sbertrack.platform.news.domain.model.NewsPost
import ru.itech.sbertrack.platform.news.domain.port.NewsDataPort
import ru.itech.sbertrack.platform.news.dto.request.NewsCreateRequest
import ru.itech.sbertrack.platform.news.dto.response.NewsResponse
import ru.itech.sbertrack.platform.user.domain.model.User
import ru.itech.sbertrack.platform.user.domain.model.UserRole
import ru.itech.sbertrack.platform.user.domain.port.UserDataPort
import java.util.UUID

@Service
class NewsService(
    private val newsDataPort: NewsDataPort,
    private val userDataPort: UserDataPort,
    private val newsMapper: NewsMapper,
    private val authService: AuthService,
) {
    fun list(category: NewsCategory?): List<NewsResponse> =
        newsDataPort.list()
            .filter { category == null || it.category == category }
            .sortedWith(compareByDescending<NewsPost> { it.pinned }.thenByDescending { it.publishedAt })
            .map(newsMapper::toResponse)

    fun get(id: UUID): NewsResponse =
        newsDataPort.findById(id)?.let(newsMapper::toResponse)
            ?: throw NotFoundException("Новость не найдена")

    fun create(request: NewsCreateRequest, authorization: String?): NewsResponse {
        val author = resolveAuthor(authorization)
        val post = NewsPost(
            authorId = author.id,
            authorName = author.organizationName ?: author.fullName,
            authorInitial = author.fullName.first().uppercase(),
            category = request.category,
            pinned = request.pinned,
            title = request.title,
            body = request.body,
            imageLabels = request.imageLabels,
        )
        return newsMapper.toResponse(newsDataPort.save(post))
    }

    private fun resolveAuthor(authorization: String?): User {
        val current = authService.tryCurrentUser(authorization)
        if (current != null && current.role in setOf(UserRole.MODERATOR, UserRole.CUSTOMER, UserRole.ADMIN)) {
            return current
        }
        return userDataPort.list().first { it.role == UserRole.MODERATOR }
    }
}
