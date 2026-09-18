package ru.itech.sbertrack.platform.notification.infrastructure.adapter

import org.springframework.context.annotation.Condition
import org.springframework.context.annotation.ConditionContext
import org.springframework.core.type.AnnotatedTypeMetadata

class SmtpEnabledCondition : Condition {
    override fun matches(context: ConditionContext, metadata: AnnotatedTypeMetadata): Boolean =
        !context.environment.getProperty("spring.mail.host").isNullOrBlank()
}

class SmtpDisabledCondition : Condition {
    override fun matches(context: ConditionContext, metadata: AnnotatedTypeMetadata): Boolean =
        context.environment.getProperty("spring.mail.host").isNullOrBlank()
}
