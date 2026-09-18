package ru.itech.sbertrack.platform.event.controller

import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.itech.sbertrack.platform.event.application.service.EventService
import ru.itech.sbertrack.platform.event.dto.request.EventCreateRequest
import ru.itech.sbertrack.platform.event.dto.response.EventResponse
import java.util.UUID

@Tag(name = "Events")
@RestController
@RequestMapping("/api/v1/events")
class EventController(
    private val eventService: EventService,
) {
    @GetMapping
    fun listUpcoming(): List<EventResponse> =
        eventService.listUpcoming()

    @GetMapping("/{id}")
    fun get(@PathVariable id: UUID): EventResponse =
        eventService.get(id)

    @PostMapping
    fun create(
        @Valid @RequestBody request: EventCreateRequest,
        @RequestHeader("Authorization", required = false) authorization: String?,
    ): EventResponse =
        eventService.create(request, authorization)
}
