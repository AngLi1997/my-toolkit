<template>
  <div class="code-snippet-manager">
    <!-- 消息提示 -->
    <MessageToast
      :visible="toast.visible"
      :message="toast.message"
      :type="toast.type"
    />

    <!-- 确认对话框 -->
    <ConfirmDialog
      v-if="confirmDialog.visible"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      @close="confirmDialog.visible = false"
      @confirm="handleConfirmDelete"
    />

    <!-- 添加分类模态框 -->
    <AddCategoryModal
      v-if="showAddCategoryModal"
      :parent-path="'/Users/liang/Downloads'"
      @close="showAddCategoryModal = false"
      @submit="handleAddCategorySubmit"
    />

    <!-- 左侧分类面板 -->
    <div class="category-panel">
      <div class="category-header">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索..."
            class="search-input"
          >
        </div>
        <DropdownMenu>
          <template #trigger>
            <button class="add-category-btn">
              <v-icon name="ri-add-line" />
            </button>
          </template>
          <div class="dropdown-content">
            <div class="dropdown-item" @click="handleAddRootCategory">
              <v-icon name="ri-folder-add-line" />
              <span>新增分类</span>
            </div>
            <div class="dropdown-item" @click="handleAddRootFile">
              <v-icon name="ri-file-add-line" />
              <span>新增文件</span>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item" @click="handleExportZip">
              <v-icon name="ri-file-zip-line" />
              <span>导出 ZIP</span>
            </div>
            <div class="dropdown-item" @click="handleImportZip">
              <v-icon name="ri-upload-line" />
              <span>导入 ZIP</span>
            </div>
          </div>
        </DropdownMenu>
      </div>
      
      <div class="category-tree">
        <TreeItem
          v-for="category in filteredCategories"
          :key="category.id"
          :item="category"
          :active-dropdown="activeDropdown"
          @toggle-dropdown="toggleDropdown"
          @add-file="handleAddFile"
          @rename="handleRename"
          @delete-category="handleDeleteCategory"
          @add-sub-category="handleAddSubCategory"
          @delete-file="handleDeleteFile"
          @select-file="handleFileSelect"
        />
      </div>
    </div>
    
    <!-- 右侧内容区 -->
    <div class="content-panel">
      <div v-if="selectedFile" class="editor-container">
        <VAceEditor
          v-model:value="selectedFile.content"
          @change="handleEditorChange"
          :lang="editorLang"
          theme="chrome"
          style="height: 100%; width: 100%"
          :options="{
            fontSize: 14,
            showPrintMargin: false,
            showGutter: true,
            highlightActiveLine: true,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true
          }"
        />
      </div>
      <div v-else class="empty-state">
        <p>选择一个文件以查看内容</p>
      </div>
    </div>

    <!-- 添加文件模态框 -->
    <AddFileModal
      v-if="showAddFileModal"
      :category="selectedCategory"
      @close="showAddFileModal = false"
      @submit="handleAddFileSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { OhVueIcon as VIcon } from 'oh-vue-icons'
import TreeItem from './TreeItem.vue'
import AddFileModal from './AddFileModal.vue'
import AddCategoryModal from './AddCategoryModal.vue'
import MessageToast from './MessageToast.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import DropdownMenu from './DropdownMenu.vue'
import { VAceEditor } from 'vue3-ace-editor'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/mode-sh'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-yaml'
import 'ace-builds/src-noconflict/mode-xml'
import 'ace-builds/src-noconflict/mode-html'
import 'ace-builds/src-noconflict/mode-css'
import 'ace-builds/src-noconflict/mode-typescript'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/ext-language_tools'

// 搜索关键词
const searchQuery = ref('')

// 当前激活的下拉菜单ID
const activeDropdown = ref(null)

// 当前选中的文件
const selectedFile = ref(null)

// 编辑器语言模式
const editorLang = ref('text')

// 文件扩展名到编辑器语言模式的映射
const languageModeMap = {
  'js': 'javascript',
  'jsx': 'javascript',
  'ts': 'typescript',
  'tsx': 'typescript',
  'java': 'java',
  'py': 'python',
  'python': 'python',
  'sh': 'sh',
  'bash': 'sh',
  'json': 'json',
  'yaml': 'yaml',
  'yml': 'yaml',
  'xml': 'xml',
  'html': 'html',
  'css': 'css'
}

// 获取文件的语言模式
const getLanguageMode = (filename) => {
  const extension = filename.split('.').pop().toLowerCase()
  return languageModeMap[extension] || 'text'
}

// 生成唯一ID
let idCounter = 1
const generateId = () => idCounter++

// 读取目录内容
const readDirectory = async (dirPath) => {
  try {
    if (!window.electronAPI) {
      console.error('electronAPI 未初始化')
      return []
    }
    
    const items = await window.electronAPI.readDirectory(dirPath)
    const result = []
    
    for (const item of items) {
      // 过滤掉以点开头的隐藏文件和文件夹
      if (!item.name.startsWith('.')) {
        result.push({
          id: generateId(),
          name: item.name,
          type: item.type,
          expanded: false,
          children: item.isDirectory ? await readDirectory(item.path) : undefined,
          path: item.path
        })
      }
    }
    
    // 对文件夹和文件进行排序：文件夹在前，文件在后，同类型按字母排序
    result.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name)
      }
      return a.type === 'category' ? -1 : 1
    })
    
    return result
  } catch (error) {
    console.error('读取目录失败:', error)
    return []
  }
}

// 分类数据
const categories = ref([])

// 初始化分类数据
onMounted(async () => {
  // 等待一小段时间确保electronAPI已经初始化
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  if (!window.electronAPI) {
    console.error('electronAPI 未初始化')
    return
  }
  
  const downloadsPath = '/Users/liang/Downloads'
  categories.value = await readDirectory(downloadsPath)
})

// 过滤分类
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value
  
  const query = searchQuery.value.toLowerCase()
  
  // 递归过滤函数
  const filterCategories = (cats) => {
    return cats.filter(cat => {
      const nameMatch = cat.name.toLowerCase().includes(query)
      
      // 递归过滤子分类
      let filteredChildren = []
      if (cat.children && cat.children.length) {
        filteredChildren = filterCategories(cat.children)
      }
      
      // 如果子分类有匹配项，保留父分类
      if (filteredChildren.length > 0) {
        cat.children = filteredChildren
        return true
      }
      
      return nameMatch
    })
  }
  
  return filterCategories(JSON.parse(JSON.stringify(categories.value)))
})

// 切换下拉菜单
const toggleDropdown = (event, item) => {
  event.stopPropagation()
  if (activeDropdown.value === item.id) {
    activeDropdown.value = null
  } else {
    activeDropdown.value = item.id
  }
}

// 添加分类相关状态
const showAddCategoryModal = ref(false)

// 处理根目录添加分类
const handleAddRootCategory = () => {
  showAddCategoryModal.value = true
}

// 处理添加分类提交
const handleAddCategorySubmit = async ({ name }) => {
  try {
    const newDirPath = `/Users/liang/Downloads/${name}`
    await window.electronAPI.createDirectory(newDirPath)
    
    // 重新读取目录内容
    categories.value = await readDirectory('/Users/liang/Downloads')
    showToast('创建成功')
  } catch (error) {
    console.error('创建目录失败:', error)
    showToast('创建失败: ' + error, 'error')
  }
}

// 添加文件相关状态
const showAddFileModal = ref(false)
const selectedCategory = ref(null)

// 处理添加文件
const handleAddFile = (category) => {
  selectedCategory.value = category
  showAddFileModal.value = true
  activeDropdown.value = null
}

// 检查文件名是否存在并返回新的文件名
const getUniqueFileName = (directory, originalFileName) => {
  // 分离文件名和扩展名
  const lastDotIndex = originalFileName.lastIndexOf('.')
  const nameWithoutExt = lastDotIndex === -1 ? originalFileName : originalFileName.slice(0, lastDotIndex)
  const extension = lastDotIndex === -1 ? '' : originalFileName.slice(lastDotIndex)
  
  // 获取目录下的所有文件
  const files = directory.children || []
  
  // 如果没有重名文件，直接返回原始文件名
  const hasConflict = files.some(file => file.name === originalFileName)
  if (!hasConflict) {
    return originalFileName
  }
  
  // 查找最大的后缀数字
  let maxNum = 0
  const pattern = new RegExp(`^${nameWithoutExt}\\（(\\d+)\\）${extension}$`)
  
  files.forEach(file => {
    const match = file.name.match(pattern)
    if (match) {
      const num = parseInt(match[1])
      maxNum = Math.max(maxNum, num)
    }
  })
  
  // 返回新的文件名
  return `${nameWithoutExt}（${maxNum + 1}）${extension}`
}

// 处理添加文件提交
const handleAddFileSubmit = async ({ fileName, content }) => {
  try {
    // 获取唯一的文件名
    const uniqueFileName = getUniqueFileName(selectedCategory.value, fileName)
    const newFilePath = `${selectedCategory.value.path}/${uniqueFileName}`
    
    await window.electronAPI.writeFile(newFilePath, content)
    
    // 重新读取目录内容
    categories.value = await readDirectory('/Users/liang/Downloads')
    
    // 选中新创建的文件
    const newFile = {
      id: generateId(),
      name: uniqueFileName,
      type: 'file',
      path: newFilePath
    }
    handleFileSelect(newFile)
  } catch (error) {
    console.error('创建文件失败:', error)
  }
}

// 处理重命名
const handleRename = (item) => {
  // TODO: 实现重命名逻辑
  activeDropdown.value = null
}

// 确认对话框状态
const confirmDialog = ref({
  visible: false,
  title: '',
  message: '',
  itemToDelete: null
})

// 显示删除确认对话框
const showDeleteConfirm = (item) => {
  confirmDialog.value.itemToDelete = item
  confirmDialog.value.title = item.type === 'file' ? '删除文件' : '删除分类'
  confirmDialog.value.message = `确定要删除"${item.name}"吗？此操作无法恢复。`
  confirmDialog.value.visible = true
}

// 处理删除确认
const handleConfirmDelete = async () => {
  const item = confirmDialog.value.itemToDelete
  if (!item) return

  try {
    if (item.type === 'file') {
      await window.electronAPI.deleteFile(item.path)
      showToast('删除成功')
    } else {
      await window.electronAPI.deleteDirectory(item.path)
      showToast('删除成功')
    }
    
    // 重新读取目录内容
    categories.value = await readDirectory('/Users/liang/Downloads')
    
    // 如果删除的是当前选中的文件，清空编辑器
    if (selectedFile.value && selectedFile.value.path === item.path) {
      selectedFile.value = null
    }
  } catch (error) {
    console.error('删除失败:', error)
    showToast('删除失败 ' + error, 'error')
  }
}

// 处理删除分类
const handleDeleteCategory = (category) => {
  showDeleteConfirm(category)
  activeDropdown.value = null
}

// 处理添加子目录
const handleAddSubCategory = (category) => {
  // TODO: 实现添加子目录逻辑
  activeDropdown.value = null
}

// 处理删除文件
const handleDeleteFile = (file) => {
  showDeleteConfirm(file)
  activeDropdown.value = null
}

// 递归查找文件
const findFile = (categories, fileId) => {
  for (const category of categories) {
    if (category.type === 'file' && category.id === fileId) {
      return category
    }
    if (category.children) {
      const found = findFile(category.children, fileId)
      if (found) return found
    }
  }
  return null
}

// 递归更新文件内容
const updateFileContent = (categories, fileId, newContent) => {
  const file = findFile(categories, fileId)
  if (file) {
    file.content = newContent
    return true
  }
  return false
}

// 处理编辑器内容变化
const handleEditorChange = async (value) => {
  if (selectedFile.value && typeof value === 'string') {
    selectedFile.value.content = value
  }
}

// 消息提示状态
const toast = ref({
  visible: false,
  message: '',
  type: 'success'
})

// 显示消息提示
const showToast = (message, type = 'success') => {
  toast.value.message = message
  toast.value.type = type
  toast.value.visible = true
  
  // 3秒后自动关闭
  setTimeout(() => {
    toast.value.visible = false
  }, 3000)
}

// 保存文件
const saveFile = async () => {
  if (selectedFile.value && selectedFile.value.content !== undefined) {
    try {
      await window.electronAPI.writeFile(selectedFile.value.path, selectedFile.value.content)
      showToast('保存成功')
    } catch (error) {
      console.error('保存失败:', error)
      showToast('保存失败', 'error')
    }
  }
}

// 处理键盘快捷键
const handleKeyDown = (event) => {
  // 检查是否按下了 Cmd+S (Mac) 或 Ctrl+S (Windows/Linux)
  if ((event.metaKey || event.ctrlKey) && event.key === 's') {
    event.preventDefault() // 阻止浏览器默认的保存行为
    saveFile()
  }
}

// 处理文件选择
const handleFileSelect = async (file) => {
  console.log('File selected:', file)
  if (file.type === 'file') {
    try {
      // 读取文件内容
      const content = await window.electronAPI.readFile(file.path)
      
      selectedFile.value = {
        id: file.id,
        name: file.name,
        type: file.type,
        content: content,
        path: file.path
      }
      editorLang.value = getLanguageMode(file.name)
      console.log('Selected file:', selectedFile.value)
    } catch (error) {
      console.error('读取文件失败:', error)
      selectedFile.value = {
        id: file.id,
        name: file.name,
        type: file.type,
        content: '无法读取文件内容',
        path: file.path
      }
    }
  }
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  if (!event.target.closest('.dropdown')) {
    activeDropdown.value = null
  }
}

// 监听全局点击事件
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
})

// 处理根目录添加文件
const handleAddRootFile = () => {
  handleAddFile({
    id: 0,
    name: 'root',
    type: 'category',
    path: '/Users/liang/Downloads'
  })
}

// 处理导出 ZIP
const handleExportZip = () => {
  // TODO: 实现导出 ZIP 的逻辑
  showToast('功能开发中', 'info')
}

// 处理导入 ZIP
const handleImportZip = () => {
  // TODO: 实现导入 ZIP 的逻辑
  showToast('功能开发中', 'info')
}
</script>

<style scoped>
.code-snippet-manager {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
  overflow: hidden;
}

.category-panel {
  background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 260px;
  min-width: 260px;
  flex-shrink: 0;
}

.category-header {
  padding: 12px 16px;
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f5f5f5;
  height: 56px;
  align-items: center;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  background-color: #ffffff;
  height: 32px;
}

.search-input:focus {
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
  border-color: #1a73e8;
}

.add-category-btn {
  background-color: #ffffff;
  color: #666;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.add-category-btn:hover {
  background-color: #EBEBEB;
}

.category-tree {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* 自定义滚动条样式 */
.category-tree::-webkit-scrollbar {
  width: 6px;
}

.category-tree::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.category-tree::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.category-tree::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.content-panel {
  background-color: #ffffff;
  flex: 1;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.editor-container {
  flex: 1;
  height: 100%;
  width: 100%;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  font-size: 14px;
}

.dropdown-content {
  padding: 4px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.dropdown-item .v-icon {
  font-size: 16px;
  color: #666;
}

.dropdown-item span {
  font-size: 14px;
}

.dropdown-divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 4px 0;
}
</style> 