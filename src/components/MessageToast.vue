<template>
  <Transition name="toast">
    <div 
      v-if="visible" 
      class="message-toast"
      :class="type"
    >
      <div class="toast-content">
        <v-icon 
          :name="iconName" 
          class="toast-icon"
        />
        <span>{{ message }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { OhVueIcon as VIcon } from 'oh-vue-icons'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'info', 'warning'].includes(value)
  }
})

const iconName = computed(() => {
  const iconMap = {
    success: 'ri-check-line',
    error: 'ri-close-circle-line',
    info: 'ri-information-line',
    warning: 'ri-alert-line'
  }
  return iconMap[props.type]
})
</script>

<style scoped>
.message-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toast-icon {
  font-size: 16px;
}

.message-toast.success {
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #52c41a;
}

.message-toast.error {
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  color: #ff4d4f;
}

.message-toast.info {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  color: #1890ff;
}

.message-toast.warning {
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  color: #faad14;
}

/* 过渡动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style> 