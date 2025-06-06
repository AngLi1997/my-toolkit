<template>
  <div class="settings-dialog-overlay" @click="handleOverlayClick">
    <div class="settings-dialog" @click.stop>
      <div class="settings-dialog-header">
        <h2>设置</h2>
        <button class="close-button" @click="$emit('close')">
          <v-icon name="ri-close-line" />
        </button>
      </div>
      
      <div class="settings-dialog-content">
        <div class="settings-item">
          <label>代码片段存储位置</label>
          <div class="path-input">
            <input 
              type="text" 
              v-model="localSettings.storagePath" 
              placeholder="请输入或选择存储路径"
              :class="{ 'error': pathError }"
              @input="validatePath"
            >
            <button @click="handleSelectPath" title="选择目录">
              <v-icon name="ri-folder-open-line" />
            </button>
          </div>
          <div v-if="pathError" class="error-message">
            {{ pathError }}
          </div>
        </div>

        <div class="settings-item">
          <label>编辑器主题</label>
          <select v-model="localSettings.editorTheme">
            <option value="chrome">Chrome</option>
            <option value="clouds">Clouds</option>
            <option value="crimson_editor">Crimson Editor</option>
            <option value="dawn">Dawn</option>
            <option value="dreamweaver">Dreamweaver</option>
            <option value="eclipse">Eclipse</option>
            <option value="github">GitHub</option>
            <option value="textmate">TextMate</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="xcode">XCode</option>
            <option value="monokai">Monokai</option>
            <option value="solarized_dark">Solarized Dark</option>
            <option value="solarized_light">Solarized Light</option>
          </select>
        </div>
      </div>

      <div class="settings-dialog-footer">
        <button class="cancel-button" @click="$emit('close')">取消</button>
        <button 
          class="save-button" 
          @click="handleSave"
          :disabled="!!pathError"
        >保存</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  settings: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

// 本地设置状态
const localSettings = ref({
  storagePath: '',
  editorTheme: 'chrome'
})

// 路径错误信息
const pathError = ref('')

// 验证路径
const validatePath = async () => {
  try {
    const path = localSettings.value.storagePath.trim()
    console.log('验证路径:', path)
    
    // 检查是否为空
    if (!path) {
      pathError.value = '存储路径不能为空'
      return
    }
    
    // 检查是否为绝对路径
    if (!path.startsWith('/') && !path.match(/^[A-Za-z]:\\/)) {
      pathError.value = '请输入绝对路径'
      return
    }
    
    // 检查路径是否存在
    console.log('检查路径是否存在...')
    const exists = await window.electronAPI.pathExists(path)
    console.log('路径是否存在:', exists)
    
    if (!exists) {
      pathError.value = '路径不存在，将在保存时创建'
      return
    }
    
    // 检查是否为目录
    console.log('检查是否为目录...')
    const isDirectory = await window.electronAPI.isDirectory(path)
    console.log('是否为目录:', isDirectory)
    
    if (!isDirectory) {
      pathError.value = '所选路径不是一个目录'
      return
    }
    
    // 检查是否有写入权限
    console.log('检查是否有写入权限...')
    const hasWriteAccess = await window.electronAPI.hasWriteAccess(path)
    console.log('是否有写入权限:', hasWriteAccess)
    
    if (!hasWriteAccess) {
      pathError.value = '没有写入权限'
      return
    }
    
    // 清除错误
    pathError.value = ''
    console.log('验证通过')
  } catch (error) {
    console.error('路径验证失败:', error)
    pathError.value = '路径验证失败: ' + (error.message || '未知错误')
  }
}

// 初始化本地设置
onMounted(async () => {
  localSettings.value = { ...props.settings }
  await validatePath()
})

// 处理选择路径
const handleSelectPath = async () => {
  try {
    const result = await window.electronAPI.selectDirectory()
    if (result.canceled) return
    localSettings.value.storagePath = result.filePaths[0]
    await validatePath()
  } catch (error) {
    console.error('选择目录失败:', error)
  }
}

// 处理保存
const handleSave = async () => {
  try {
    const path = localSettings.value.storagePath
    
    // 如果目录不存在，创建它
    const exists = await window.electronAPI.pathExists(path)
    if (!exists) {
      await window.electronAPI.createDirectory(path)
    }
    
    emit('save', { ...localSettings.value })
    emit('close')
  } catch (error) {
    console.error('保存失败:', error)
    pathError.value = '创建目录失败: ' + error.message
  }
}

// 处理遮罩层点击
const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script>

<style scoped>
.settings-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.settings-dialog {
  background-color: #ffffff;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.settings-dialog-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.settings-dialog-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  color: #333;
}

.settings-dialog-content {
  padding: 24px;
}

.settings-item {
  margin-bottom: 20px;
}

.settings-item:last-child {
  margin-bottom: 0;
}

.settings-item label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
}

.path-input {
  display: flex;
  gap: 8px;
}

.path-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  background-color: #ffffff;
}

.path-input input:focus {
  border-color: #1a73e8;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
  outline: none;
}

.path-input button {
  padding: 8px;
  width: 36px;
  height: 36px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  transition: all 0.2s;
}

.path-input button:hover {
  background-color: #f5f5f5;
}

.path-input button .v-icon {
  font-size: 18px;
}

.settings-item select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  background-color: #ffffff;
  cursor: pointer;
}

.settings-dialog-footer {
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.settings-dialog-footer button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  color: #333;
}

.cancel-button:hover {
  background-color: #f5f5f5;
}

.save-button {
  background-color: #1a73e8;
  border: 1px solid #1a73e8;
  color: #ffffff;
}

.save-button:hover {
  background-color: #1557b0;
}

.path-input input.error {
  border-color: #dc3545;
  background-color: #fff8f8;
}

.path-input input.error:focus {
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
}

.error-message {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
}

.save-button:disabled {
  background-color: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
}

.save-button:disabled:hover {
  background-color: #ccc;
}
</style> 