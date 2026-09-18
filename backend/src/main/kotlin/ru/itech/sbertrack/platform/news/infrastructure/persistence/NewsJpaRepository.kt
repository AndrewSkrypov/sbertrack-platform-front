package ru.itech.sbertrack.platform.news.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface NewsJpaRepository : JpaRepository<NewsPostEntity, UUID>
