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
        <div 
          v-for="category in filteredCategories" 
          :key="category.id" 
          class="category-item"
          :class="{
            'has-children': category.children && category.children.length,
            'expanded': category.expanded
          }"
        >
          <div class="category-content" @click="toggleExpand(category)">
            <div class="category-name">{{ category.name }}</div>
            <div class="category-actions">
              <button class="action-btn" @click.stop="handleMoveCategory(category)">
                <v-icon name="ri-drag-move-line" />
              </button>
              <button class="action-btn delete" @click.stop="handleDeleteCategory(category)">
                <v-icon name="ri-delete-bin-line" />
              </button>
            </div>
          </div>
          <!-- 递归渲染子分类 -->
          <div class="sub-categories" v-if="category.children && category.children.length && category.expanded">
            <div 
              v-for="child in category.children" 
              :key="child.id" 
              class="category-item"
              :class="{
                'has-children': child.children && child.children.length,
                'expanded': child.expanded
              }"
            >
              <div class="category-content" @click="toggleExpand(child)">
                <div class="category-name">{{ child.name }}</div>
                <div class="category-actions">
                  <button class="action-btn" @click.stop="handleMoveCategory(child)">
                    <v-icon name="ri-drag-move-line" />
                  </button>
                  <button class="action-btn delete" @click.stop="handleDeleteCategory(child)">
                    <v-icon name="ri-delete-bin-line" />
                  </button>
                </div>
              </div>
              <!-- 第三级子分类 (如果需要) -->
              <div class="sub-categories" v-if="child.children && child.children.length && child.expanded">
                <div v-for="grandChild in child.children" :key="grandChild.id" class="category-item">
                  <div class="category-content">
                    <div class="category-name">{{ grandChild.name }}</div>
                    <div class="category-actions">
                      <button class="action-btn" @click.stop="handleMoveCategory(grandChild)">
                        <v-icon name="ri-drag-move-line" />
                      </button>
                      <button class="action-btn delete" @click.stop="handleDeleteCategory(grandChild)">
                        <v-icon name="ri-delete-bin-line" />
                      </button>
                    </div>
                  </div>
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
import { ref, computed } from 'vue'
import { OhVueIcon as VIcon } from 'oh-vue-icons'

// 搜索关键词
const searchQuery = ref('')

// 模拟分类数据
const categories = ref([
  {
    id: 1,
    name: '代码',
    expanded: false,
    children: [
      { id: 11, name: 'Java', expanded: false },
      { id: 12, name: 'Python', expanded: false },
      { id: 13, name: 'Shell', expanded: false }
    ]
  },{
    id: 2,
    name: '脚本',
    expanded: false,
    children: [
      { id: 21, name: 'Shell', expanded: false }
    ]
  },{
    id: 3,
    name: '配置文件',
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
      return nameMatch || filteredChildren.length > 0
    })
  }
  
  return filterCategories(categories.value)
})

// 切换分类展开/折叠状态
const toggleExpand = (category) => {
  if (!category.expanded) {
    category.expanded = true
  } else {
    category.expanded = false
  }
}

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

.category-item {
  margin-bottom: 4px;
  cursor: pointer;
  position: relative;
}

.category-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  background-color: transparent;
  border-radius: 4px;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.category-content:hover {
  background-color: #EBEBEB;
}

.category-name {
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.category-name::before {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  min-width: 16px;
  margin-right: 8px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23787878'%3E%3Cpath d='M20 5h-8.586l-2-2H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2zM4 19V7h16l.002 12H4z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.category-item.has-children > .category-content::after {
  content: '';
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23787878'%3E%3Cpath d='M16.293 9.293L12 13.586 7.707 9.293 6.293 10.707 12 16.414 17.707 10.707z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: transform 0.2s ease;
}

.category-item.has-children.expanded > .category-content::after {
  transform: translateY(-50%) rotate(180deg);
}

.category-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.category-content:hover .category-actions {
  opacity: 1;
}

.action-btn {
  background: none;
  border: none;
  padding: 2px;
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
  margin-left: 20px;
  margin-top: 4px;
  position: relative;
}

.sub-categories::before {
  content: '';
  position: absolute;
  top: 0;
  left: -10px;
  width: 1px;
  height: 100%;
  background-color: #e0e0e0;
}

.content-panel {
  background-color: #ffffff;
  flex: 1;
  height: 100%;
  overflow: auto;
}
</style> 