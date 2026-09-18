package ru.itech.sbertrack.platform.auth.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import kotlin.test.Test

// Runs against the dev Postgres instance (same DB_HOST/PORT/NAME defaults as
// application.yml) seeded by the Flyway migrations — relies on the
// student@example.com seed user created there, not on Testcontainers, since
// Docker isn't guaranteed to be available wherever this runs.
@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerIntegrationTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @Test
    fun `sign-in issues a JWT that unlocks a protected endpoint`() {
        val signInResponse = mockMvc.perform(
            post("/api/v1/auth/sign-in")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"email":"student@example.com","password":"password"}"""),
        )
            .andExpect(status().isOk)
            .andReturn().response.contentAsString

        val token = Regex("\"token\":\"([^\"]+)\"").find(signInResponse)!!.groupValues[1]

        mockMvc.perform(
            get("/api/v1/portfolio/me").header("Authorization", "Bearer $token"),
        ).andExpect(status().isOk)
    }

    @Test
    fun `sign-in with wrong password is rejected`() {
        mockMvc.perform(
            post("/api/v1/auth/sign-in")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"email":"student@example.com","password":"wrong-password"}"""),
        ).andExpect(status().isUnauthorized)
    }

    @Test
    fun `protected endpoint without a token is rejected`() {
        mockMvc.perform(get("/api/v1/portfolio/me")).andExpect(status().isUnauthorized)
    }

    @Test
    fun `protected endpoint with a forged legacy token is rejected`() {
        mockMvc.perform(
            get("/api/v1/portfolio/me").header("Authorization", "Bearer fake-token-1252bd86-4b43-3453-9706-e48ddeaa484b"),
        ).andExpect(status().isUnauthorized)
    }
}
