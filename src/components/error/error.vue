<template>
    <div class="error-wrapper">
        <transition-group name="slide-fade">
            <div class="error" v-for="(item, index) in error" :key="index">
                <div class="error__count">{{ item.status }}</div>
                <div class="error__message">{{ item.text }}</div>
            </div>
        </transition-group>
    </div>
</template>
<script setup>
defineProps({
    error: {
        type: Array,
        required: true,
    },
})
</script>
<style scoped lang="scss">
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}
.error-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: absolute;
    min-width: 320px;
    //height: 40px;
    bottom: 10px;
    left: 40px;
}
.error {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: red;
    gap: 50px;
    &__count {
        color: #fff;
        font-size: 14px;
    }
    &__message {
        color: #fff;
        font-size: 14px;
    }
}
</style>
