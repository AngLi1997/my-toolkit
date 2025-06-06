<template>
  <div class="confirm-dialog-overlay" @click="$emit('close')">
    <div class="confirm-dialog" @click.stop>
      <div class="confirm-dialog-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="$emit('close')">
          <v-icon name="ri-close-line" />
        </button>
      </div>
      <div class="confirm-dialog-content">
        <div class="confirm-dialog-icon">
          <v-icon name="ri-error-warning-line" class="warning-icon" />
        </div>
        <div class="confirm-dialog-message">
          {{ message }}
        </div>
      </div>
      <div class="confirm-dialog-footer">
        <button class="cancel-btn" @click="$emit('close')">取消</button>
        <button class="confirm-btn" @click="handleConfirm">确认删除</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { OhVueIcon as VIcon } from 'oh-vue-icons'

defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'confirm'])

const handleConfirm = () => {
  emit('confirm')
  emit('close')
}
</script>

<style scoped>
.confirm-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.confirm-dialog {
  background-color: white;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.confirm-dialog-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.confirm-dialog-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: #f5f5f5;
}

.confirm-dialog-content {
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.confirm-dialog-icon {
  flex-shrink: 0;
}

.warning-icon {
  font-size: 24px;
  color: #faad14;
}

.confirm-dialog-message {
  color: #333;
  font-size: 14px;
  line-height: 1.5;
}

.confirm-dialog-footer {
  padding: 16px 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background-color: #f5f5f5;
}

.confirm-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #ff4d4f;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.confirm-btn:hover {
  background-color: #ff7875;
}
</style> 