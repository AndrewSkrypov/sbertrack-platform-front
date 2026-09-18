package ru.itech.sbertrack.platform.challengecase.application.mapper

import kotlin.test.Test
import kotlin.test.assertEquals
import ru.itech.sbertrack.platform.challengecase.domain.model.CaseStatus
import ru.itech.sbertrack.platform.challengecase.domain.model.FeedbackMode
import ru.itech.sbertrack.platform.challengecase.domain.model.PracticalCase
import ru.itech.sbertrack.platform.common.model.Competency
import ru.itech.sbertrack.platform.common.model.Difficulty
import java.time.LocalDate
import java.util.UUID

class CaseMapperTest {
    @Test
    fun `case mapper exposes domain fields in response`() {
        val practicalCase = PracticalCase(
            trackId = UUID.randomUUID(),
            title = "Спроектировать backend",
            shortDescription = "Короткое описание",
            fullDescription = "Полное описание",
            customerId = UUID.randomUUID(),
            customerName = "Сбер",
            status = CaseStatus.PUBLISHED,
            difficulty = Difficulty.ADVANCED,
            participantLimit = 20,
            expectedResult = "Архитектурная схема",
            feedbackMode = FeedbackMode.MIXED,
            competencyWeights = mapOf(Competency.ABSTRACT_THINKING to 25, Competency.AUTONOMY to 20),
            tags = listOf("backend", "architecture"),
            deadline = LocalDate.of(2026, 9, 15),
        )

        val response = CaseMapper().toResponse(practicalCase)

        assertEquals(practicalCase.id, response.id)
        assertEquals(practicalCase.title, response.title)
        assertEquals(practicalCase.competencyWeights, response.competencyWeights)
    }
}
