package ru.itech.sbertrack.platform.track.infrastructure.persistence

import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.track.domain.model.Track
import ru.itech.sbertrack.platform.track.domain.port.TrackDataPort
import java.util.UUID

@Component
class TrackJpaAdapter(
    private val repository: TrackJpaRepository,
    private val mapper: TrackEntityMapper,
) : TrackDataPort {
    override fun list(): List<Track> =
        repository.findAll().map(mapper::toDomain)

    override fun findById(id: UUID): Track? =
        repository.findById(id).orElse(null)?.let(mapper::toDomain)

    override fun save(track: Track): Track {
        repository.save(mapper.toEntity(track))
        return track
    }
}
