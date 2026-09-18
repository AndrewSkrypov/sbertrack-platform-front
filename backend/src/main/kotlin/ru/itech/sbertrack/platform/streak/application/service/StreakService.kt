package ru.itech.sbertrack.platform.streak.application.service

import org.springframework.stereotype.Service
import ru.itech.sbertrack.platform.auth.application.service.AuthService
import ru.itech.sbertrack.platform.streak.dto.response.StreakResponse
import ru.itech.sbertrack.platform.submission.domain.port.SubmissionDataPort
import java.time.LocalDate
import java.time.ZoneOffset

@Service
class StreakService(
    private val submissionDataPort: SubmissionDataPort,
    private val authService: AuthService,
) {
    fun current(authorization: String?): StreakResponse {
        val user = authService.currentUser(authorization)
        val activeDates = (
            submissionDataPort.list()
                .filter { it.studentId == user.id }
                .mapNotNull { it.submittedAt } + listOf(user.createdAt)
            )
            .map { it.atZone(ZoneOffset.UTC).toLocalDate() }
            .toSortedSet()

        val today = LocalDate.now(ZoneOffset.UTC)
        val lastActiveDate = activeDates.lastOrNull()
        val activeToday = lastActiveDate == today

        var streak = 0
        var cursor = if (activeToday) today else today.minusDays(1)
        while (cursor in activeDates) {
            streak++
            cursor = cursor.minusDays(1)
        }

        return StreakResponse(
            currentStreakDays = streak,
            lastActiveDate = lastActiveDate,
            activeToday = activeToday,
        )
    }
}
