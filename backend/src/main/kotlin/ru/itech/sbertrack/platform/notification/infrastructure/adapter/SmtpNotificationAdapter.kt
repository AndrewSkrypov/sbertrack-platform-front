package ru.itech.sbertrack.platform.notification.infrastructure.adapter

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Conditional
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Component
import ru.itech.sbertrack.platform.notification.domain.port.NotificationPort

@Component
@Conditional(SmtpEnabledCondition::class)
class SmtpNotificationAdapter(
    private val mailSender: JavaMailSender,
    @Value("\${sbertrack.notification.from-email:noreply@sbertrack.local}") private val fromEmail: String,
) : NotificationPort {
    private val log = LoggerFactory.getLogger(SmtpNotificationAdapter::class.java)

    override fun send(toEmail: String, subject: String, body: String) {
        try {
            val message = SimpleMailMessage()
            message.setFrom(fromEmail)
            message.setTo(toEmail)
            message.setSubject(subject)
            message.setText(body)
            mailSender.send(message)
        } catch (exception: Exception) {
            log.warn("Failed to send email to {}: {}", toEmail, exception.message)
        }
    }
}
