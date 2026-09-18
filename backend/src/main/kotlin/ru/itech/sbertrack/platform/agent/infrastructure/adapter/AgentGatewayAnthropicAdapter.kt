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

// Real LLM-backed mentor responses, active only when ANTHROPIC_API_KEY is set
// (sbertrack.agent.anthropic-api-key). Falls back to AgentGatewayMockAdapter
// otherwise, so the platform works without any external API key configured.
@Component
@Conditional(AnthropicKeyPresentCondition::class)
class AgentGatewayAnthropicAdapter(
    private val agentDataPort: AgentDataPort,
    @Value("\${sbertrack.agent.anthropic-api-key}") private val apiKey: String,
    @Value("\${sbertrack.agent.anthropic-model:claude-haiku-4-5-20251001}") private val model: String,
) : AgentGatewayPort {
    private val log = LoggerFactory.getLogger(AgentGatewayAnthropicAdapter::class.java)
    private val restClient = RestClient.builder()
        .baseUrl("https://api.anthropic.com/v1/messages")
        .defaultHeader("x-api-key", apiKey)
        .defaultHeader("anthropic-version", "2023-06-01")
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

        val messages = history.map {
            AnthropicMessage(role = if (it.role == AgentMessageRole.USER) "user" else "assistant", content = it.content)
        } + AnthropicMessage(role = "user", content = userMessage)

        return try {
            val response = restClient.post()
                .body(AnthropicRequest(model = model, maxTokens = 1024, system = systemPrompt, messages = messages))
                .retrieve()
                .body(AnthropicResponse::class.java)

            response?.content?.firstOrNull()?.text?.takeIf { it.isNotBlank() }
                ?: fallbackMessage(agentDefinition)
        } catch (exception: Exception) {
            log.warn("Anthropic API call failed for agent {}: {}", agentDefinition.code, exception.message)
            fallbackMessage(agentDefinition)
        }
    }

    private fun fallbackMessage(agentDefinition: AgentDefinition): String =
        "${agentDefinition.name}: сейчас не получается ответить — попробуйте переформулировать вопрос или повторить чуть позже."

    @JsonIgnoreProperties(ignoreUnknown = true)
    private data class AnthropicRequest(
        val model: String,
        @param:JsonProperty("max_tokens") val maxTokens: Int,
        val system: String,
        val messages: List<AnthropicMessage>,
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    private data class AnthropicMessage(
        val role: String,
        val content: String,
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    private data class AnthropicResponse(
        val content: List<AnthropicContentBlock> = emptyList(),
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    private data class AnthropicContentBlock(
        val text: String? = null,
    )
}
