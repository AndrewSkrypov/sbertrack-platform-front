package ru.itech.sbertrack.platform.search.controller

import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import ru.itech.sbertrack.platform.search.application.service.SearchService
import ru.itech.sbertrack.platform.search.dto.response.SearchResultResponse

@Tag(name = "Search")
@RestController
@RequestMapping("/api/v1/search")
class SearchController(
    private val searchService: SearchService,
) {
    @GetMapping
    fun search(@RequestParam query: String): List<SearchResultResponse> =
        searchService.search(query)
}
