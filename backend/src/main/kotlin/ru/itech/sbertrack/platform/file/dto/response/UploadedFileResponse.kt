package ru.itech.sbertrack.platform.file.dto.response

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Загруженный файл-артефакт")
data class UploadedFileResponse(
    val fileName: String,
    val url: String,
    val sizeBytes: Long,
)
