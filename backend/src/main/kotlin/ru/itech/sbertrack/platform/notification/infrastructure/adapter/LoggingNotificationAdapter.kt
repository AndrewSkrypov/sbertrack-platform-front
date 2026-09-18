package ru.itech.sbertrack.platform.notification.infrastructure.adapter

import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Conditional
import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.notification.domain.port.NotificationPort

// Default notification adapter when spring.mail.host isn't configured — logs
// instead of sending, so the platform works without any SMTP setup.
@Component
@Conditional(SmtpDisabledCondition::class)
class LoggingNotificationAdapter : NotificationPort {
    private val log = LoggerFactory.getLogger(LoggingNotificationAdapter::class.java)

    override fun send(toEmail: String, subject: String, body: String) {
        log.info("[notification-stub] to={} subject=\"{}\" body={}", toEmail, subject, body)
    }
}
