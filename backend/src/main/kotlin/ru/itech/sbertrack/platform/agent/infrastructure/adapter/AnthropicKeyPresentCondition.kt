package ru.itech.sbertrack.platform.agent.infrastructure.adapter

import org.springframework.context.annotation.Condition
import org.springframework.context.annotation.ConditionContext
import org.springframework.core.type.AnnotatedTypeMetadata

class AnthropicKeyPresentCondition : Condition {
    override fun matches(context: ConditionContext, metadata: AnnotatedTypeMetadata): Boolean =
        !context.environment.getProperty("sbertrack.agent.anthropic-api-key").isNullOrBlank()
}

class AnthropicKeyAbsentCondition : Condition {
    override fun matches(context: ConditionContext, metadata: AnnotatedTypeMetadata): Boolean =
        context.environment.getProperty("sbertrack.agent.anthropic-api-key").isNullOrBlank()
}
