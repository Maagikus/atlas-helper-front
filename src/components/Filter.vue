<template>
    <div class="filter__item">
        <div class="filter__icon _icon-filter">
            <div class="tooltip filter-tooltip">
                <div class="tooltip__polygon">
                    <div class="triangle-container">
                        <div class="triangle"></div>
                    </div>
                </div>
                <ul class="tooltip__list checkbox-list">
                    <li v-for="(value, name, parentIndex) in props.filters" :key="parentIndex" class="tooltip__item checkbox-list__item item-checkbox">
                        <div class="item-checkbox__title">{{ name }}</div>
                        <ul class="item-checkbox__items">
                            <li class="filter-tooltip__checkbox checkbox-filter" v-for="(filter, index) in value" :key="index">
                                <input
                                    :id="'c_' + parentIndex + '_' + index"
                                    class="checkbox-filter__input checkbox__input"
                                    type="checkbox"
                                    :value="filter"
                                    @input="onSelect($event, filter)"
                                    name="form[]"
                                />
                                <label :for="'c_' + parentIndex + '_' + index" class="checkbox__label checkbox-filter__label"
                                    ><span class="checkbox-filter__text checkbox__text">{{ filter }}</span></label
                                >
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="filter__results">
        <span v-if="!props.modelValue.length">{{ "All" }}</span>

        <span v-for="(filter, index) in modelValue" :key="filter"> {{ filter }}<span v-if="index < modelValue.length - 1">,</span><span v-if="index === modelValue.length - 1">;</span> </span>
    </div>
</template>
<script setup>
const props = defineProps(["filters", "modelValue"])
const emit = defineEmits(["update:modelValue"])
const onSelect = (event, filter) => {
    const isChecked = event.target.checked
    let newValue

    if (isChecked) {
        newValue = [...props.modelValue, filter]
    } else {
        newValue = props.modelValue.filter((item) => item !== filter)
    }

    emit("update:modelValue", newValue)
}
</script>
