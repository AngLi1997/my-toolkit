<template>
  <div class="container">
    <div class="left-panel">
      <!-- Logo部分 -->
      <div class="logo">
        <h1>Toolkit</h1>
      </div>
      <!-- 上部分：工具分类列表 -->
      <div class="tool-categories">
        <ul class="category-list">
          <li 
            v-for="category in categories" 
            :key="category.id" 
            class="category-item"
            :class="{ 'active': selectedCategory === category.id }"
            @click="selectCategory(category.id)"
          >
            <div class="category-item-content">
              <div class="category-icon-name">
                <v-icon 
                  :name="category.icon" 
                  class="category-icon"
                  :class="{ 'active': selectedCategory === category.id }"
                />
                <span>{{ category.name }}</span>
              </div>
              <v-icon 
                name="bi-chevron-right" 
                class="arrow-icon"
                :class="{ 'active': selectedCategory === category.id }"
              />
            </div>
          </li>
        </ul>
      </div>
      <!-- 下部分：功能按钮区 -->
      <div class="action-buttons">
        <button class="action-btn" @click="showSettings">
          <v-icon name="bi-gear" />
          <span>设置</span>
        </button>
      </div>
    </div>
    <div class="right-panel">
      <Transition name="fade" mode="out-in">
        <component :is="currentComponent"></component>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import CodeSnippetManager from './CodeSnippetManager.vue'
import JsonTools from './JsonTools.vue'
import Settings from './Settings.vue'

// 选中的分类
const selectedCategory = ref(1)

// 当前显示的组件
const currentComponent = shallowRef(CodeSnippetManager)

// 分类数据
const categories = ref([
  { id: 1, name: '代码片段管理器', icon: 'fa-flag', component: CodeSnippetManager },
  { id: 2, name: 'JSON工具', icon: 'fa-flag', component: JsonTools }
])

// 选择分类
const selectCategory = (id) => {
  selectedCategory.value = id
  const category = categories.value.find(c => c.id === id)
  if (category) {
    currentComponent.value = category.component
  }
}

// 显示设置面板
const showSettings = () => {
  selectedCategory.value = null // 取消选中状态
  currentComponent.value = Settings
}
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  height: 100vh;
}

.left-panel {
  flex: 1;
  background-color: #F5F5F5;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e0e0e0;
  min-width: 240px;
  max-width: 280px;
}

.logo {
  padding: 8px 16px;
  border-bottom: 1px solid #e0e0e0;
  height: 80px;
  display: flex;
  align-items: center;
}

.logo h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
}

.tool-categories {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
}

.category-item {
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  background-color: #ffffff;
}

.category-item-content {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-icon-name {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-icon {
  width: 20px;
  height: 20px;
  color: #333;
  transition: all 0.2s ease;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  color: #999;
  transition: all 0.2s ease;
  display: none;
}

.category-item:hover {
  background-color: #EBEBEB;
}

.category-item.active {
  background-color: #EBEBEB;
}

/* .category-item.active .category-icon {
  color: #1a73e8;
} */

.action-buttons {
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border: none;
  background-color: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
}

.action-btn:hover {
  background-color: #EBEBEB;
}

.action-btn v-icon {
  width: 20px;
  height: 20px;
}

.right-panel {
  flex: 6;
  background-color: #ffffff;
}

/* 自定义滚动条样式 */
.tool-categories::-webkit-scrollbar {
  width: 6px;
}

.tool-categories::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.tool-categories::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.tool-categories::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 过渡动画样式 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>