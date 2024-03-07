<template>
    <div class="process__target">
        <ul class="process__list">
            <li class="process__item">
                Fleet <span>{{ props.fleet.fleet }}</span>
            </li>
            <li class="process__item">
                Status <span>{{ props.fleet.status }}</span>
            </li>
            <li class="process__item">
                Action <span>{{ props.fleet.action }}</span>
            </li>
            <li class="process__item">
                Message <span>{{ props.fleet.mess }}</span>
            </li>
        </ul>
        <div @click="executeMovement" class="move">двигаться</div>
    </div>
    <h2>status</h2>
</template>
<script setup props="props">
import { onMounted, ref } from "vue"

const props = defineProps({
    fleet: Object,
})
const emit = defineEmits(["execute-movement"])
const data = ref([])
onMounted(() => {
    data.value.push(props.fleet.dataForRepeating)
})
const executeMovement = () => {
    console.log(emit)
    emit("execute-movement")
}
</script>
<style scoped>
.process__target {
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    gap: 50px;
}
ul,
li {
    list-style: none;
    margin: 0;
}
.process__list {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 25px;
}
.process__item {
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.move {
    align-self: center;
}
</style>
