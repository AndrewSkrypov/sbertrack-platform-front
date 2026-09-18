package ru.itech.sbertrack.platform.user.infrastructure.persistence

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.user.domain.model.User

@Component
class UserEntityMapper {
    fun toDomain(entity: UserEntity): User =
        User(
            id = entity.id,
            fullName = entity.fullName,
            email = entity.email,
            role = entity.role,
            organizationName = entity.organizationName,
            studentType = entity.studentType,
            status = entity.status,
            createdAt = entity.createdAt,
        )

    fun toEntity(user: User, passwordHash: String): UserEntity =
        UserEntity(
            id = user.id,
            fullName = user.fullName,
            email = user.email,
            role = user.role,
            organizationName = user.organizationName,
            studentType = user.studentType,
            status = user.status,
            passwordHash = passwordHash,
            createdAt = user.createdAt,
        )
}
