package ru.itech.sbertrack.platform.file.controller

import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.core.io.Resource
import org.springframework.core.io.UrlResource
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import ru.itech.sbertrack.platform.file.application.service.FileStorageService
import ru.itech.sbertrack.platform.file.dto.response.UploadedFileResponse

@Tag(name = "Files")
@RestController
@RequestMapping("/api/v1/files")
class FileController(
    private val fileStorageService: FileStorageService,
) {
    @PostMapping(consumes = ["multipart/form-data"])
    fun upload(@RequestParam("file") file: MultipartFile): UploadedFileResponse =
        fileStorageService.store(file)

    @GetMapping("/{storedName}")
    fun download(@PathVariable storedName: String): ResponseEntity<Resource> {
        val path = fileStorageService.resolve(storedName)
        val resource: Resource = UrlResource(path.toUri())
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"${path.fileName}\"")
            .body(resource)
    }
}
