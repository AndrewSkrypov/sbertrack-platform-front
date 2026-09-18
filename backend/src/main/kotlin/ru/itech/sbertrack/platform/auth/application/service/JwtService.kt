package ru.itech.sbertrack.platform.auth.application.service

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.env.Environment
import org.springframework.stereotype.Service
import ru.itech.sbertrack.platform.common.exception.UnauthorizedException
import java.time.Duration
import java.time.Instant
import java.util.Date
import java.util.UUID
import javax.crypto.SecretKey

@Service
class JwtService(
    @Value("\${sbertrack.auth.jwt-secret}") secret: String,
    @Value("\${sbertrack.auth.jwt-ttl-hours:24}") private val ttlHours: Long,
    environment: Environment,
) {
    init {
        val isProd = environment.activeProfiles.contains("prod")
        require(!isProd || secret != DEV_DEFAULT_SECRET) {
            "JWT_SECRET is still the dev placeholder while running with the 'prod' profile. " +
                "Set a real secret (openssl rand -base64 48) before deploying."
        }
        require(secret.toByteArray(Charsets.UTF_8).size >= 32) {
            "JWT_SECRET must be at least 32 bytes for HS256."
        }
    }

    private val key: SecretKey = Keys.hmacShaKeyFor(secret.toByteArray(Charsets.UTF_8))

    companion object {
        const val DEV_DEFAULT_SECRET = "dev-only-insecure-secret-change-me-32bytes+"
    }

    fun issue(userId: UUID): String {
        val now = Instant.now()
        return Jwts.builder()
            .subject(userId.toString())
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plus(Duration.ofHours(ttlHours))))
            .signWith(key)
            .compact()
    }

    fun parseUserId(token: String): UUID {
        val claims = try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token).payload
        } catch (exception: Exception) {
            throw UnauthorizedException("Недействительный или истёкший токен")
        }
        return UUID.fromString(claims.subject)
    }
}
