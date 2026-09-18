package ru.itech.sbertrack.platform.profiletraits.controller

import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.itech.sbertrack.platform.profiletraits.application.service.ProfileTraitsService
import ru.itech.sbertrack.platform.profiletraits.dto.request.ProfileTraitsUpdateRequest
import ru.itech.sbertrack.platform.profiletraits.dto.response.ProfileTraitsResponse

@Tag(name = "ProfileTraits")
@RestController
@RequestMapping("/api/v1/profile-traits")
class ProfileTraitsController(
    private val profileTraitsService: ProfileTraitsService,
) {
    @GetMapping("/me")
    fun me(@RequestHeader("Authorization", required = false) authorization: String?): ProfileTraitsResponse =
        profileTraitsService.current(authorization)

    @PutMapping("/me")
    fun updateMe(
        @Valid @RequestBody request: ProfileTraitsUpdateRequest,
        @RequestHeader("Authorization", required = false) authorization: String?,
    ): ProfileTraitsResponse =
        profileTraitsService.updateCurrent(request, authorization)
}
