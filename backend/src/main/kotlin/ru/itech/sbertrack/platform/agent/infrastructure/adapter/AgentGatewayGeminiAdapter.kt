package ru.itech.sbertrack.platform.agent.infrastructure.adapter

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Conditional
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient
import ru.itech.sbertrack.platform.agent.domain.model.AgentDefinition
import ru.itech.sbertrack.platform.agent.domain.model.AgentMessage
import ru.itech.sbertrack.platform.agent.domain.model.AgentMessageRole
import ru.itech.sbertrack.platform.agent.domain.port.AgentDataPort
import ru.itech.sbertrack.platform.agent.domain.port.AgentGatewayPort

// Free-tier LLM-backed mentor responses via Google Gemini, active when
// GEMINI_API_KEY is set and ANTHROPIC_API_KEY is not (Anthropic takes
// priority when both are configured). Falls back to AgentGatewayMockAdapter
// when neither key is present.
@Component
@Conditional(GeminiKeyPresentCondition::class)
class AgentGatewayGeminiAdapter(
    private val agentDataPort: AgentDataPort,
    @Value("\${sbertrack.agent.gemini-api-key}") private val apiKey: String,
    @Value("\${sbertrack.agent.gemini-model:gemini-3.6-flash}") private val model: String,
) : AgentGatewayPort {
    private val log = LoggerFactory.getLogger(AgentGatewayGeminiAdapter::class.java)
    private val restClient = RestClient.builder()
        .baseUrl("https://generativelanguage.googleapis.com/v1beta/models")
        .defaultHeader("content-type", "application/json")
        .build()

    override fun generateAssistantResponse(
        agentDefinition: AgentDefinition,
        history: List<AgentMessage>,
        userMessage: String,
    ): String {
        val systemPrompt = agentDefinition.masterPromptId
            ?.let(agentDataPort::findMasterPromptById)
            ?.promptText
            ?: "Ты — ${agentDefinition.name}, наставник платформы обучения. ${agentDefinition.description} " +
                "Помогай студенту думать самостоятельно: задавай уточняющие вопросы, предлагай структуру, " +
                "но никогда не выполняй финальное решение за него."

        val contents = history.map {
            GeminiContent(
                role = if (it.role == AgentMessageRole.USER) "user" else "model",
                parts = listOf(GeminiPart(it.content)),
            )
        } + GeminiContent(role = "user", parts = listOf(GeminiPart(userMessage)))

        val request = GeminiRequest(
            systemInstruction = GeminiContent(role = "system", parts = listOf(GeminiPart(systemPrompt))),
            contents = contents,
        )

        repeat(MAX_ATTEMPTS) { attempt ->
            try {
                val response = restClient.post()
                    .uri("/{model}:generateContent?key={apiKey}", model, apiKey)
                    .body(request)
                    .retrieve()
                    .body(GeminiResponse::class.java)

                val text = response?.candidates?.firstOrNull()?.content?.parts?.firstOrNull()?.text?.takeIf { it.isNotBlank() }
                if (text != null) return text
                log.warn("Gemini returned an empty response for agent {} on attempt {}", agentDefinition.code, attempt + 1)
            } catch (exception: Exception) {
                log.warn("Gemini API call failed for agent {} on attempt {}: {}", agentDefinition.code, attempt + 1, exception.message)
            }
            if (attempt < MAX_ATTEMPTS - 1) Thread.sleep(RETRY_DELAY_MS)
        }
        return fallbackMessage(agentDefinition)
    }

    private fun fallbackMessage(agentDefinition: AgentDefinition): String =
        "${agentDefinition.name}: сейчас не получается ответить — попробуйте переформулировать вопрос или повторить чуть позже."

    companion object {
        private const val MAX_ATTEMPTS = 3
        private const val RETRY_DELAY_MS = 1500L
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private data class GeminiRequest(
        @param:JsonProperty("systemInstruction") val systemInstruction: GeminiContent,
        val contents: List<GeminiContent>,
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    private data class GeminiContent(
        val role: String,
        val parts: List<GeminiPart>,
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    private data class GeminiPart(
        val text: String,
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    private data class GeminiResponse(
        val candidates: List<GeminiCandidate> = emptyList(),
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    private data class GeminiCandidate(
        val content: GeminiResponseContent? = null,
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    private data class GeminiResponseContent(
        val parts: List<GeminiPart> = emptyList(),
    )
}
