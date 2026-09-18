package ru.itech.sbertrack.platform.profiletraits.domain.model

data class Ability(
    val label: String,
    val percent: Int,
) {
    init {
        require(label.isNotBlank()) { "Название способности обязательно" }
        require(percent in 0..100) { "Процент способности должен быть в диапазоне 0..100" }
    }
}
