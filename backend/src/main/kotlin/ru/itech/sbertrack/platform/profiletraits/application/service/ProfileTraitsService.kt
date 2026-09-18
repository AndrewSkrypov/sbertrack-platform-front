package ru.itech.sbertrack.platform.profiletraits.application.service

import org.springframework.stereotype.Service
import ru.itech.sbertrack.platform.auth.application.service.AuthService
import ru.itech.sbertrack.platform.profiletraits.application.mapper.ProfileTraitsMapper
import ru.itech.sbertrack.platform.profiletraits.domain.model.ProfileTraits
import ru.itech.sbertrack.platform.profiletraits.domain.port.ProfileTraitsDataPort
import ru.itech.sbertrack.platform.profiletraits.dto.request.ProfileTraitsUpdateRequest
import ru.itech.sbertrack.platform.profiletraits.dto.response.ProfileTraitsResponse
import java.util.UUID

@Service
class ProfileTraitsService(
    private val profileTraitsDataPort: ProfileTraitsDataPort,
    private val profileTraitsMapper: ProfileTraitsMapper,
    private val authService: AuthService,
) {
    fun current(authorization: String?): ProfileTraitsResponse {
        val user = authService.currentUser(authorization)
        return profileTraitsMapper.toResponse(findOrCreate(user.id))
    }

    fun updateCurrent(request: ProfileTraitsUpdateRequest, authorization: String?): ProfileTraitsResponse {
        val user = authService.currentUser(authorization)
        val updated = findOrCreate(user.id).update(
            professionalTags = request.professionalTags,
            interests = request.interests,
            motivations = request.motivations,
        )
        return profileTraitsMapper.toResponse(profileTraitsDataPort.save(updated))
    }

    private fun findOrCreate(studentId: UUID): ProfileTraits =
        profileTraitsDataPort.findByStudentId(studentId)
            ?: profileTraitsDataPort.save(ProfileTraits(studentId = studentId))
}
