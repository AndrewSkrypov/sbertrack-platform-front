package ru.itech.sbertrack.platform.user.infrastructure.persistence

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import ru.itech.sbertrack.platform.user.domain.model.StudentType
import ru.itech.sbertrack.platform.user.domain.model.UserRole
import ru.itech.sbertrack.platform.user.domain.model.UserStatus
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "users")
class UserEntity(
    @Id
    val id: UUID,
    @Column(name = "full_name", nullable = false)
    val fullName: String,
    @Column(nullable = false, unique = true)
    val email: String,
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    val role: UserRole,
    @Column(name = "organization_name")
    val organizationName: String?,
    @Enumerated(EnumType.STRING)
    @Column(name = "student_type", nullable = false, length = 32)
    val studentType: StudentType,
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    val status: UserStatus,
    @Column(name = "password_hash", nullable = false)
    val passwordHash: String,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant,
)
