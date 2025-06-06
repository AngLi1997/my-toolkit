<template>
  <div class="code-snippet-manager">
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
        <button class="add-category-btn" @click="handleAddCategory">
          <v-icon name="ri-add-line" />
        </button>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { OhVueIcon as VIcon } from 'oh-vue-icons'
import TreeItem from './TreeItem.vue'
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

// 模拟分类数据
const categories = ref([
  {
    id: 1,
    name: '代码',
    type: 'category',
    expanded: false,
    children: [
      { 
        id: 11, 
        name: 'Java', 
        type: 'category',
        expanded: false,
        children: [
          {
            id: 111,
            name: 'Spring Boot 启动模板.java',
            type: 'file',
            content: `@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}`
          },
          {
            id: 112,
            name: 'JPA实体类模板.java',
            type: 'file',
            content: `@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String email;
}`
          }
        ]
      },
      { 
        id: 12, 
        name: 'Python', 
        type: 'category',
        expanded: false 
      },
      { 
        id: 13, 
        name: 'Shell', 
        type: 'category',
        expanded: false 
      }
    ]
  },{
    id: 2,
    name: '脚本',
    type: 'category',
    expanded: false,
    children: [
      { 
        id: 21, 
        name: 'Shell', 
        type: 'category',
        expanded: false 
      }
    ]
  },{
    id: 3,
    name: '配置文件',
    type: 'category',
    expanded: false
  }
])

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

// 处理添加分类
const handleAddCategory = () => {
  // TODO: 实现添加分类逻辑
}

// 处理添加文件
const handleAddFile = (category) => {
  // TODO: 实现添加文件逻辑
  activeDropdown.value = null
}

// 处理重命名
const handleRename = (item) => {
  // TODO: 实现重命名逻辑
  activeDropdown.value = null
}

// 处理删除分类
const handleDeleteCategory = (category) => {
  // TODO: 实现删除分类逻辑
  activeDropdown.value = null
}

// 处理添加子目录
const handleAddSubCategory = (category) => {
  // TODO: 实现添加子目录逻辑
  activeDropdown.value = null
}

// 处理删除文件
const handleDeleteFile = (item) => {
  // TODO: 实现删除文件逻辑
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
const handleEditorChange = (value) => {
  if (selectedFile.value && typeof value === 'string') {
    const file = findFile(categories.value, selectedFile.value.id)
    if (file) {
      file.content = value
    }
  }
}

// 处理文件选择
const handleFileSelect = (file) => {
  console.log('File selected:', file)
  if (file.type === 'file') {
    // 从categories中获取最新的文件数据
    const currentFile = findFile(categories.value, file.id)
    if (currentFile) {
      selectedFile.value = {
        id: currentFile.id,
        name: currentFile.name,
        type: currentFile.type,
        content: currentFile.content || '' // 确保content有默认值
      }
      editorLang.value = getLanguageMode(currentFile.name)
      console.log('Selected file:', selectedFile.value)
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
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
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
</style> 