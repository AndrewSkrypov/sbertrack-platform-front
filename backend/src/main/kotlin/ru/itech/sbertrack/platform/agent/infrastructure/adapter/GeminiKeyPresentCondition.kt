package ru.itech.sbertrack.platform.agent.infrastructure.adapter

import org.springframework.context.annotation.Condition
import org.springframework.context.annotation.ConditionContext
import org.springframework.core.type.AnnotatedTypeMetadata

// Gemini is the free-tier fallback: active only when ANTHROPIC_API_KEY is absent
// (Anthropic takes priority when both are set) and GEMINI_API_KEY is present.
class GeminiKeyPresentCondition : Condition {
    override fun matches(context: ConditionContext, metadata: AnnotatedTypeMetadata): Boolean {
        val anthropicKey = context.environment.getProperty("sbertrack.agent.anthropic-api-key")
        val geminiKey = context.environment.getProperty("sbertrack.agent.gemini-api-key")
        return anthropicKey.isNullOrBlank() && !geminiKey.isNullOrBlank()
    }
}

class GeminiAndAnthropicKeyAbsentCondition : Condition {
    override fun matches(context: ConditionContext, metadata: AnnotatedTypeMetadata): Boolean {
        val anthropicKey = context.environment.getProperty("sbertrack.agent.anthropic-api-key")
        val geminiKey = context.environment.getProperty("sbertrack.agent.gemini-api-key")
        return anthropicKey.isNullOrBlank() && geminiKey.isNullOrBlank()
    }
}
