package ru.itech.sbertrack.platform.agent.infrastructure.adapter

import org.springframework.context.annotation.Conditional
import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.agent.domain.model.AgentCapability
import ru.itech.sbertrack.platform.agent.domain.model.AgentDefinition
import ru.itech.sbertrack.platform.agent.domain.model.AgentMessage
import ru.itech.sbertrack.platform.agent.domain.port.AgentGatewayPort

// Default gateway when neither ANTHROPIC_API_KEY nor GEMINI_API_KEY is
// configured — see AgentGatewayAnthropicAdapter and AgentGatewayGeminiAdapter
// for the real LLM-backed implementations.
@Component
@Conditional(GeminiAndAnthropicKeyAbsentCondition::class)
class AgentGatewayMockAdapter : AgentGatewayPort {
    override fun generateAssistantResponse(
        agentDefinition: AgentDefinition,
        history: List<AgentMessage>,
        userMessage: String,
    ): String {
        val capability = agentDefinition.capabilities.firstOrNull()
        val prompt = capability?.let(::promptFor) ?: "Расскажите подробнее, что вас беспокоит в этой задаче?"
        return "${agentDefinition.name}: $prompt"
    }

    private fun promptFor(capability: AgentCapability): String = when (capability) {
        AgentCapability.STRUCTURE_SOLUTION -> "Давайте разложим решение на этапы — с чего вы планируете начать?"
        AgentCapability.ASK_CHECK_QUESTIONS -> "Уточните, пожалуйста: какие альтернативы вы уже рассматривали?"
        AgentCapability.REVIEW_ASSUMPTIONS -> "Какие предположения лежат в основе вашего подхода и как вы их проверяли?"
        AgentCapability.SUGGEST_NEXT_STEPS -> "Хорошее начало. Следующий шаг — зафиксировать критерии успеха этого этапа."
        AgentCapability.FORM_FEEDBACK -> "Опишите, что получилось лучше всего, а что вызвало наибольшие сложности."
    }
}
