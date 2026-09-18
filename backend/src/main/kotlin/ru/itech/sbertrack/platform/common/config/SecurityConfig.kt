package ru.itech.sbertrack.platform.common.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain

@Configuration
class SecurityConfig {
    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    // Endpoint-level authorization stays in each service via AuthService.currentUser,
    // which now validates a signed JWT instead of the old "fake-token-{uuid}" string.
    // This chain only disables Spring Security's default basic-auth/CSRF behaviour so
    // requests keep reaching the controllers unauthenticated at the HTTP layer, same
    // as before spring-boot-starter-security was added.
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http {
            csrf { disable() }
            sessionManagement { sessionCreationPolicy = org.springframework.security.config.http.SessionCreationPolicy.STATELESS }
            authorizeHttpRequests {
                authorize(anyRequest, permitAll)
            }
            httpBasic { disable() }
            formLogin { disable() }
        }
        return http.build()
    }
}
