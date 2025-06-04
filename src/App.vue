<template>
  <div class="app-container">
    <!-- 左侧面板 -->
    <div class="left-panel" :class="{ 'collapsed': isCollapsed }">
      <div class="search-container" v-show="!isCollapsed">
        <input type="text" class="search-input" placeholder="搜索工具..." v-model="searchQuery" />
        <button class="collapse-btn" @click="toggleCollapse">
          «
        </button>
      </div>
      <div class="categories-list" v-show="!isCollapsed">
        <div 
          v-for="(category, index) in categories" 
          :key="index" 
          class="category-item"
          :class="{ active: selectedCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          <span class="category-icon">{{ category.icon }}</span>
          <span class="category-name">{{ category.name }}</span>
        </div>
      </div>
      <!-- 折叠状态下只显示展开按钮 -->
      <div class="expand-btn-container" v-show="isCollapsed">
        <button class="expand-btn" @click="toggleCollapse">
          »
        </button>
      </div>
    </div>

    <!-- 右侧面板 -->
    <div class="right-panel">
      <!-- 标签页和设置区域 -->
      <div class="tabs-header">
        <div class="tabs">
          <div 
            v-for="(tab, index) in openTabs" 
            :key="index" 
            class="tab"
            :class="{ active: activeTab === tab.id }"
            @click="switchTab(tab.id)"
          >
            {{ tab.name }}
            <span class="close-tab" @click.stop="closeTab(tab.id)">×</span>
          </div>
        </div>
        <button class="settings-btn" @click="openSettings">
          ⚙
        </button>
      </div>

      <!-- 工具内容区域 -->
      <div class="content-area">
        <!-- 设置面板 -->
        <div v-if="showSettings" class="settings-panel">
          <h3>应用设置</h3>
          <!-- 设置内容 -->
        </div>
        <!-- 工具列表网格 -->
        <div v-else-if="activeTab === null" class="tools-grid">
          <div 
            v-for="(tool, index) in filteredTools" 
            :key="index" 
            class="tool-card"
            @click="openTool(tool)"
          >
            <div class="tool-icon">{{ tool.icon }}</div>
            <div class="tool-name">{{ tool.name }}</div>
          </div>
        </div>
        <!-- 工具内容面板 -->
        <div v-else class="tool-panel">
          <div v-for="tool in tools" :key="tool.id" v-show="activeTab === tool.id">
            <h2>{{ tool.name }} 工具</h2>
            <div class="tool-content">
              <!-- 这里是每个工具的具体内容，可以根据工具ID动态加载不同组件 -->
              <p>{{ tool.name }} 工具的功能面板</p>
              <!-- 示例内容 -->
              <div v-if="tool.id === 'json'" class="json-formatter">
                <textarea placeholder="请输入JSON内容..."></textarea>
                <button>格式化</button>
              </div>
              <div v-else-if="tool.id === 'base64'" class="base64-encoder">
                <textarea placeholder="请输入要编码的内容..."></textarea>
                <div class="tool-buttons">
                  <button>编码</button>
                  <button>解码</button>
                </div>
              </div>
              <div v-else>
                <p>{{ tool.name }} 工具的实现正在开发中...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isCollapsed: false,
      searchQuery: '',
      selectedCategory: 'all',
      activeTab: null,
      showSettings: false,
      openTabs: [],
      categories: [
        { id: 'all', name: '全部工具', icon: '🏠' },
        { id: 'dev', name: '开发工具', icon: '💻' },
        { id: 'format', name: '格式化工具', icon: '🔄' },
        { id: 'convert', name: '转换工具', icon: '🔄' },
        { id: 'encode', name: '编码工具', icon: '🔐' },
      ],
      tools: [
        { id: 'json', name: 'JSON格式化', icon: '📋', category: 'format' },
        { id: 'base64', name: 'Base64编码', icon: '🔐', category: 'encode' },
        { id: 'markdown', name: 'Markdown编辑器', icon: '📝', category: 'dev' },
        { id: 'regex', name: '正则测试', icon: '🔍', category: 'dev' },
        { id: 'color', name: '颜色选择器', icon: '🎨', category: 'dev' },
        { id: 'uuid', name: 'UUID生成器', icon: '🔑', category: 'dev' },
        { id: 'jwt', name: 'JWT解析', icon: '🔓', category: 'encode' },
        { id: 'hash', name: '哈希计算', icon: '🔢', category: 'encode' },
        { id: 'htmlencode', name: 'HTML编码', icon: '📃', category: 'encode' },
        { id: 'urlparse', name: 'URL解析', icon: '🔗', category: 'dev' },
        { id: 'timestamp', name: '时间戳转换', icon: '⏱️', category: 'convert' },
        { id: 'qrcode', name: '二维码生成', icon: '📱', category: 'convert' },
      ]
    }
  },
  computed: {
    filteredTools() {
      let result = this.tools;
      
      if (this.selectedCategory !== 'all') {
        result = result.filter(tool => tool.category === this.selectedCategory);
      }
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(tool => 
          tool.name.toLowerCase().includes(query) || 
          tool.category.toLowerCase().includes(query)
        );
      }
      
      return result;
    }
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    selectCategory(categoryId) {
      this.selectedCategory = categoryId;
    },
    openTool(tool) {
      if (!this.openTabs.some(tab => tab.id === tool.id)) {
        this.openTabs.push({
          id: tool.id,
          name: tool.name
        });
      }
      this.activeTab = tool.id;
      this.showSettings = false;
    },
    switchTab(tabId) {
      this.activeTab = tabId;
      this.showSettings = false;
    },
    closeTab(tabId) {
      const index = this.openTabs.findIndex(tab => tab.id === tabId);
      if (index !== -1) {
        this.openTabs.splice(index, 1);
        
        // 如果关闭的是当前激活的标签页，则激活前一个标签页
        if (this.activeTab === tabId) {
          if (this.openTabs.length > 0) {
            this.activeTab = this.openTabs[Math.max(0, index - 1)].id;
          } else {
            this.activeTab = null;
          }
        }
      }
    },
    openSettings() {
      this.showSettings = true;
      this.activeTab = null;
    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* 左侧面板样式 */
.left-panel {
  width: 25%;
  height: 100%;
  background-color: #f5f5f5;
  border-right: 1px solid #ddd;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
}

.left-panel.collapsed {
  width: 50px;
}

.search-container {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.collapse-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 10px;
  font-size: 18px;
  color: #666;
}

/* 展开按钮容器 */
.expand-btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.expand-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #666;
}

.categories-list {
  flex: 1;
  overflow-y: auto;
}

.category-item {
  padding: 12px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}

.category-item:hover {
  background-color: #e8e8e8;
}

.category-item.active {
  background-color: #e0e0e0;
}

.category-icon {
  margin-right: 10px;
  font-size: 18px;
}

/* 右侧面板样式 */
.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tabs-header {
  height: 50px;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
}

.tabs {
  display: flex;
  overflow-x: auto;
  max-width: calc(100% - 50px);
}

.tab {
  padding: 0 15px;
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-right: 1px solid #eee;
  position: relative;
  white-space: nowrap;
}

.tab.active {
  background-color: #f0f0f0;
}

.close-tab {
  margin-left: 10px;
  font-size: 16px;
  opacity: 0.6;
}

.close-tab:hover {
  opacity: 1;
}

.settings-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #666;
}

.content-area {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.tool-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.tool-icon {
  font-size: 32px;
  margin-bottom: 15px;
}

.tool-name {
  font-size: 16px;
  font-weight: 500;
}

.settings-panel {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* 工具面板样式 */
.tool-panel {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.tool-content {
  margin-top: 20px;
}

/* 具体工具样式示例 */
.json-formatter textarea,
.base64-encoder textarea {
  width: 100%;
  min-height: 200px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  margin-bottom: 15px;
}

.tool-buttons {
  display: flex;
  gap: 10px;
}

.tool-buttons button,
.json-formatter button {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.tool-buttons button:hover,
.json-formatter button:hover {
  background-color: #3d8b40;
}
</style>
