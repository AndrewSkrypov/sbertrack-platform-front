package ru.itech.sbertrack.platform.search.application.service

import org.springframework.stereotype.Service
import ru.itech.sbertrack.platform.challengecase.domain.port.CaseDataPort
import ru.itech.sbertrack.platform.search.dto.response.SearchResultResponse
import ru.itech.sbertrack.platform.search.dto.response.SearchResultType
import ru.itech.sbertrack.platform.track.domain.port.TrackDataPort
import ru.itech.sbertrack.platform.user.domain.port.UserDataPort

@Service
class SearchService(
    private val caseDataPort: CaseDataPort,
    private val trackDataPort: TrackDataPort,
    private val userDataPort: UserDataPort,
) {
    fun search(query: String, limit: Int = 20): List<SearchResultResponse> {
        val trimmed = query.trim()
        if (trimmed.length < 2) return emptyList()

        val cases = caseDataPort.list()
            .filter { it.title.contains(trimmed, ignoreCase = true) || it.tags.any { tag -> tag.contains(trimmed, ignoreCase = true) } }
            .map { SearchResultResponse(it.id, SearchResultType.CASE, it.title, it.customerName) }

        val tracks = trackDataPort.list()
            .filter { it.title.contains(trimmed, ignoreCase = true) }
            .map { SearchResultResponse(it.id, SearchResultType.TRACK, it.title, it.customerName) }

        val people = userDataPort.list()
            .filter { it.fullName.contains(trimmed, ignoreCase = true) || it.email.contains(trimmed, ignoreCase = true) }
            .map { SearchResultResponse(it.id, SearchResultType.PERSON, it.fullName, it.organizationName ?: it.email) }

        return (cases + tracks + people).take(limit)
    }
}
