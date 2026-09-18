package ru.itech.sbertrack.platform.user.infrastructure.persistence

import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.common.exception.ApiException
import ru.itech.sbertrack.platform.user.domain.model.User
import ru.itech.sbertrack.platform.user.domain.port.UserDataPort
import java.util.UUID

@Component
class UserJpaAdapter(
    private val repository: UserJpaRepository,
    private val mapper: UserEntityMapper,
    private val passwordEncoder: PasswordEncoder,
) : UserDataPort {
    override fun list(): List<User> =
        repository.findAll().sortedBy { it.createdAt }.map(mapper::toDomain)

    override fun findById(id: UUID): User? =
        repository.findById(id).orElse(null)?.let(mapper::toDomain)

    override fun findByEmail(email: String): User? =
        repository.findByEmail(email.lowercase())?.let(mapper::toDomain)

    override fun verifyPassword(email: String, password: String): Boolean {
        val entity = repository.findByEmail(email.lowercase()) ?: return false
        return passwordEncoder.matches(password, entity.passwordHash)
    }

    override fun save(user: User, password: String?): User {
        val passwordHash = password?.let(passwordEncoder::encode)
            ?: repository.findById(user.id).orElse(null)?.passwordHash
            ?: throw ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Невозможно сохранить пользователя без пароля")
        repository.save(mapper.toEntity(user, passwordHash))
        return user
    }
}
