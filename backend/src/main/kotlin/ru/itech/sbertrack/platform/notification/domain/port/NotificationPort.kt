package ru.itech.sbertrack.platform.notification.domain.port

interface NotificationPort {
    fun send(toEmail: String, subject: String, body: String)
}
