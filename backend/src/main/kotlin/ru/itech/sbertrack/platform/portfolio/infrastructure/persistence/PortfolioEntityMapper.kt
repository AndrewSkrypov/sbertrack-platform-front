package ru.itech.sbertrack.platform.portfolio.infrastructure.persistence

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.portfolio.domain.model.Portfolio

@Component
class PortfolioEntityMapper {
    fun toDomain(entity: PortfolioEntity): Portfolio =
        Portfolio(
            id = entity.id,
            studentId = entity.studentId,
            summary = entity.summary,
            completedCases = entity.completedCases,
            competencyProfile = entity.competencyProfile,
            artifacts = entity.artifacts,
            feedbackHighlights = entity.feedbackHighlights,
            cvBookIncluded = entity.cvBookIncluded,
        )

    fun toEntity(portfolio: Portfolio): PortfolioEntity =
        PortfolioEntity(
            id = portfolio.id,
            studentId = portfolio.studentId,
            summary = portfolio.summary,
            completedCases = portfolio.completedCases,
            competencyProfile = portfolio.competencyProfile,
            artifacts = portfolio.artifacts,
            feedbackHighlights = portfolio.feedbackHighlights,
            cvBookIncluded = portfolio.cvBookIncluded,
        )
}
