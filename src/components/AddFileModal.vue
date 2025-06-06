<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>新建文件</h3>
        <button class="close-btn" @click="$emit('close')">
          <v-icon name="ri-close-line" />
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>文件名</label>
          <input 
            type="text" 
            v-model="fileName"
            placeholder="请输入文件名（包含扩展名）"
            class="form-input"
          >
        </div>
        <div class="form-group">
          <label>文件内容</label>
          <textarea 
            v-model="fileContent"
            placeholder="请输入文件内容"
            class="form-textarea"
          ></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-btn" @click="$emit('close')">取消</button>
        <button class="submit-btn" @click="handleSubmit" :disabled="!isValid">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { OhVueIcon as VIcon } from 'oh-vue-icons'

const props = defineProps({
  category: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'submit'])

const fileName = ref('')
const fileContent = ref('')

const isValid = computed(() => {
  return fileName.value.trim() !== ''
})

const handleSubmit = () => {
  if (!isValid.value) return
  
  emit('submit', {
    fileName: fileName.value.trim(),
    content: fileContent.value
  })
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
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

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
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

.modal-body {
  padding: 16px;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #1a73e8;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
}

.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  min-height: 200px;
  resize: vertical;
}

.form-textarea:focus {
  border-color: #1a73e8;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
}

.modal-footer {
  padding: 16px;
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

.submit-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #1a73e8;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.submit-btn:hover {
  background-color: #1557b0;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style> 