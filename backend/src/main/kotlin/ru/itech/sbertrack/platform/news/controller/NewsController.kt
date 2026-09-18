package ru.itech.sbertrack.platform.news.controller

import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import ru.itech.sbertrack.platform.news.application.service.NewsService
import ru.itech.sbertrack.platform.news.domain.model.NewsCategory
import ru.itech.sbertrack.platform.news.dto.request.NewsCreateRequest
import ru.itech.sbertrack.platform.news.dto.response.NewsResponse
import java.util.UUID

@Tag(name = "News")
@RestController
@RequestMapping("/api/v1/news")
class NewsController(
    private val newsService: NewsService,
) {
    @GetMapping
    fun list(@RequestParam(required = false) category: NewsCategory?): List<NewsResponse> =
        newsService.list(category)

    @GetMapping("/{id}")
    fun get(@PathVariable id: UUID): NewsResponse =
        newsService.get(id)

    @PostMapping
    fun create(
        @Valid @RequestBody request: NewsCreateRequest,
        @RequestHeader("Authorization", required = false) authorization: String?,
    ): NewsResponse =
        newsService.create(request, authorization)
}
