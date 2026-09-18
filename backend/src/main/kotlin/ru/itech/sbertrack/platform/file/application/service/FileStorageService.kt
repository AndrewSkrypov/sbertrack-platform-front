package ru.itech.sbertrack.platform.file.application.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import ru.itech.sbertrack.platform.common.exception.BadRequestException
import ru.itech.sbertrack.platform.file.dto.response.UploadedFileResponse
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.StandardCopyOption
import java.util.UUID

@Service
class FileStorageService(
    @Value("\${sbertrack.storage.upload-dir}") uploadDir: String,
    @Value("\${sbertrack.storage.max-size-bytes:20971520}") private val maxSizeBytes: Long,
) {
    private val root: Path = Path.of(uploadDir).toAbsolutePath().normalize()

    init {
        Files.createDirectories(root)
    }

    fun store(file: MultipartFile): UploadedFileResponse {
        if (file.isEmpty) throw BadRequestException("Файл пустой")
        if (file.size > maxSizeBytes) throw BadRequestException("Файл превышает лимит в ${maxSizeBytes / (1024 * 1024)} МБ")

        val originalName = file.originalFilename?.substringAfterLast('/')?.substringAfterLast('\\') ?: "file"
        val extension = originalName.substringAfterLast('.', missingDelimiterValue = "").lowercase()
        if (extension !in ALLOWED_EXTENSIONS) {
            throw BadRequestException("Недопустимый тип файла: .$extension")
        }

        val storedName = "${UUID.randomUUID()}.$extension"
        val target = root.resolve(storedName).normalize()
        if (!target.startsWith(root)) throw BadRequestException("Недопустимое имя файла")

        file.inputStream.use { input ->
            Files.copy(input, target, StandardCopyOption.REPLACE_EXISTING)
        }

        return UploadedFileResponse(
            fileName = originalName,
            url = "/api/v1/files/$storedName",
            sizeBytes = file.size,
        )
    }

    fun resolve(storedName: String): Path {
        val safeName = Path.of(storedName).fileName.toString()
        val target = root.resolve(safeName).normalize()
        if (!target.startsWith(root) || !Files.exists(target)) {
            throw BadRequestException("Файл не найден")
        }
        return target
    }

    private companion object {
        val ALLOWED_EXTENSIONS = setOf(
            "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
            "png", "jpg", "jpeg", "gif", "svg",
            "zip", "txt", "md", "csv",
        )
    }
}
