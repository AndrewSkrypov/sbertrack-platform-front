package ru.itech.sbertrack.platform.profiletraits.domain.model

data class SelfRatedSkill(
    val label: String,
    val level: Int,
) {
    init {
        require(label.isNotBlank()) { "Название навыка обязательно" }
        require(level in 1..4) { "Уровень навыка должен быть в диапазоне 1..4" }
    }
}
