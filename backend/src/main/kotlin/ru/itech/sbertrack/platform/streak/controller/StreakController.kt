package ru.itech.sbertrack.platform.streak.controller

import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.itech.sbertrack.platform.streak.application.service.StreakService
import ru.itech.sbertrack.platform.streak.dto.response.StreakResponse

@Tag(name = "Streak")
@RestController
@RequestMapping("/api/v1/streak")
class StreakController(
    private val streakService: StreakService,
) {
    @GetMapping("/me")
    fun me(@RequestHeader("Authorization", required = false) authorization: String?): StreakResponse =
        streakService.current(authorization)
}
