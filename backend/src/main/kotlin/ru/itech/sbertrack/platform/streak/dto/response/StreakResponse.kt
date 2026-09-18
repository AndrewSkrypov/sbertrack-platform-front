package ru.itech.sbertrack.platform.streak.dto.response

import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDate

@Schema(description = "Серия дней активности студента подряд")
data class StreakResponse(
    val currentStreakDays: Int,
    val lastActiveDate: LocalDate?,
    val activeToday: Boolean,
)
