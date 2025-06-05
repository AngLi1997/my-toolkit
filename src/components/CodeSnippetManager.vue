<template>
  <div class="code-snippet-manager">
    <!-- 左侧分类面板 -->
    <div class="category-panel">
      <div class="category-header">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索分类..."
            class="search-input"
          >
        </div>
        <button class="add-category-btn" @click="handleAddCategory">
          <v-icon name="ri-add-line" />
        </button>
      </div>
      
      <div class="category-tree">
        <div v-for="category in categories" :key="category.id" class="category-item">
          <div class="category-content">
            <span class="category-name">{{ category.name }}</span>
            <div class="category-actions">
              <button class="action-btn" @click="handleMoveCategory(category)">
                <v-icon name="ri-drag-move-line" />
              </button>
              <button class="action-btn delete" @click="handleDeleteCategory(category)">
                <v-icon name="ri-delete-bin-line" />
              </button>
            </div>
          </div>
          <!-- 递归渲染子分类 -->
          <div class="sub-categories" v-if="category.children && category.children.length">
            <div v-for="child in category.children" :key="child.id" class="category-item">
              <div class="category-content">
                <span class="category-name">{{ child.name }}</span>
                <div class="category-actions">
                  <button class="action-btn" @click="handleMoveCategory(child)">
                    <v-icon name="ri-drag-move-line" />
                  </button>
                  <button class="action-btn delete" @click="handleDeleteCategory(child)">
                    <v-icon name="ri-delete-bin-line" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 右侧内容区 -->
    <div class="content-panel">
      <!-- 这里后续添加右侧内容 -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { OhVueIcon as VIcon } from 'oh-vue-icons'

// 搜索关键词
const searchQuery = ref('')

// 模拟分类数据
const categories = ref([
  {
    id: 1,
    name: 'JavaScript',
    children: [
      { id: 11, name: 'ES6+' },
      { id: 12, name: '设计模式' }
    ]
  },
  {
    id: 2,
    name: 'Vue',
    children: [
      { id: 21, name: '组件通信' },
      { id: 22, name: '状态管理' }
    ]
  }
])

// 处理添加分类
const handleAddCategory = () => {
  // TODO: 实现添加分类逻辑
}

// 处理移动分类
const handleMoveCategory = (category) => {
  // TODO: 实现移动分类逻辑
}

// 处理删除分类
const handleDeleteCategory = (category) => {
  // TODO: 实现删除分类逻辑
}
</script>

<style scoped>
.code-snippet-manager {
  display: grid;
  grid-template-columns: 1fr 6fr;
  gap: 1px;
  height: 100vh;
  background-color: #f5f5f5;
}

.category-panel {
  background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.category-header {
  padding: 16px;
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f5f5f5;
}

.search-box {
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  background-color: #ffffff;
}

.search-input:focus {
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
}

.add-category-btn {
  background-color: #ffffff;
  color: #666;
  border: none;
  border-radius: 8px;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
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

.category-item {
  margin-bottom: 8px;
}

.category-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #ffffff;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.category-content:hover {
  background-color: #EBEBEB;
}

.category-name {
  font-size: 14px;
  color: #333;
}

.category-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.category-content:hover .category-actions {
  opacity: 1;
}

.action-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: #e0e0e0;
}

.action-btn.delete:hover {
  color: #dc3545;
  background-color: rgba(220, 53, 69, 0.1);
}

.sub-categories {
  margin-left: 28px;
  margin-top: 8px;
}

.content-panel {
  background-color: #ffffff;
  padding: 20px;
}
</style> 