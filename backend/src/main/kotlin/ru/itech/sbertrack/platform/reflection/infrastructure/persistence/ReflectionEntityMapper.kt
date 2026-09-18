package ru.itech.sbertrack.platform.reflection.infrastructure.persistence

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.reflection.domain.model.Reflection

@Component
class ReflectionEntityMapper {
    fun toDomain(entity: ReflectionEntity): Reflection =
        Reflection(
            id = entity.id,
            submissionId = entity.submissionId,
            studentId = entity.studentId,
            answers = entity.answers,
            summary = entity.summary,
            createdAt = entity.createdAt,
        )

    fun toEntity(reflection: Reflection): ReflectionEntity =
        ReflectionEntity(
            id = reflection.id,
            submissionId = reflection.submissionId,
            studentId = reflection.studentId,
            answers = reflection.answers,
            summary = reflection.summary,
            createdAt = reflection.createdAt,
        )
}
