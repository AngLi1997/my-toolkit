<!-- TreeItem.vue -->
<template>
  <div 
    class="tree-item"
    :class="{
      'has-children': item.children && item.children.length,
      'expanded': item.expanded
    }"
  >
    <div class="item-content" @click="toggleExpand(item)">
      <div class="item-name">
        <v-icon 
          :name="item.type === 'file' ? 'ri-file-text-fill' : (item.expanded ? 'ri-folder-open-fill' : 'ri-folder-fill')"
          class="item-icon"
        />
        {{ item.name }}
      </div>
      <div class="item-actions">
        <div class="dropdown">
          <button class="action-btn" @click.stop="toggleDropdown($event, item)">
            <v-icon name="ri-more-fill" />
          </button>
          <div class="dropdown-menu" v-if="activeDropdown === item.id" @click.stop>
            <template v-if="item.type !== 'file'">
              <div class="dropdown-item" @click="handleAddFile(item)">
                <v-icon name="ri-file-add-line" />
                <span>新增文件</span>
              </div>
              <div class="dropdown-item" @click="handleRename(item)">
                <v-icon name="ri-pencil-line" />
                <span>重命名</span>
              </div>
              <div class="dropdown-item" @click="handleDeleteCategory(item)">
                <v-icon name="ri-delete-bin-line" />
                <span>删除分类</span>
              </div>
              <div class="dropdown-item" @click="handleAddSubCategory(item)">
                <v-icon name="ri-folder-add-line" />
                <span>添加子目录</span>
              </div>
            </template>
            <template v-else>
              <div class="dropdown-item" @click="handleRename(item)">
                <v-icon name="ri-pencil-line" />
                <span>重命名</span>
              </div>
              <div class="dropdown-item" @click="handleDeleteFile(item)">
                <v-icon name="ri-delete-bin-line" />
                <span>删除文件</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <!-- 递归渲染子项目 -->
    <div class="sub-items" v-if="item.children && item.children.length && item.expanded">
      <TreeItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :active-dropdown="activeDropdown"
        @toggle-dropdown="toggleDropdown"
        @add-file="handleAddFile"
        @rename="handleRename"
        @delete-category="handleDeleteCategory"
        @add-sub-category="handleAddSubCategory"
        @delete-file="handleDeleteFile"
      />
    </div>
  </div>
</template>

<script setup>
import { OhVueIcon as VIcon } from 'oh-vue-icons'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  activeDropdown: {
    type: [Number, null],
    default: null
  }
})

const emit = defineEmits([
  'toggle-dropdown',
  'add-file',
  'rename',
  'delete-category',
  'add-sub-category',
  'delete-file'
])

// 切换展开/折叠状态
const toggleExpand = (item) => {
  if (item.type === 'file') return
  item.expanded = !item.expanded
}

// 切换下拉菜单
const toggleDropdown = (event, item) => {
  emit('toggle-dropdown', event, item)
}

// 处理各种操作
const handleAddFile = (item) => {
  emit('add-file', item)
}

const handleRename = (item) => {
  emit('rename', item)
}

const handleDeleteCategory = (item) => {
  emit('delete-category', item)
}

const handleAddSubCategory = (item) => {
  emit('add-sub-category', item)
}

const handleDeleteFile = (item) => {
  emit('delete-file', item)
}
</script>

<style scoped>
.tree-item {
  margin-bottom: 4px;
  cursor: pointer;
  position: relative;
}

.item-content {
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

.item-content:hover {
  background-color: #EBEBEB;
}

.item-name {
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.item-icon {
  margin-right: 8px;
  font-size: 16px;
  color: #666;
}

.item-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.item-content:hover .item-actions {
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

.tree-item.has-children > .item-content::after {
  content: '';
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%) rotate(0deg);
  width: 12px;
  height: 12px;
  transition: transform 0.2s ease;
  opacity: 0.6;
}

.tree-item.has-children.expanded > .item-content::after {
  transform: translateY(-50%) rotate(180deg);
}

.sub-items {
  margin-left: 20px;
  margin-top: 4px;
  position: relative;
}

.sub-items::before {
  content: '';
  position: absolute;
  top: 0;
  left: -10px;
  width: 1px;
  height: 100%;
  background-color: #e0e0e0;
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  z-index: 1000;
  margin-top: 4px;
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
</style> 