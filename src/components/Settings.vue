<template>
  <div class="settings">
    <h2>设置</h2>
    <div class="content">
      <div class="settings-section">
        <h3>基本设置</h3>
        <div class="setting-item">
          <label>主题</label>
          <select>
            <option value="light">浅色</option>
            <option value="dark">深色</option>
          </select>
        </div>
      </div>
      
      <div class="settings-section">
        <h3>其他设置</h3>
        <div class="setting-item">
          <label>自动保存</label>
          <input type="checkbox" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 组件逻辑
</script>

<style scoped>
.settings {
  padding: 20px;
}

.content {
  margin-top: 20px;
}

.settings-section {
  margin-bottom: 30px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

.settings-section h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.setting-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.setting-item label {
  min-width: 120px;
  color: #666;
}

.setting-item select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  min-width: 150px;
}

.setting-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
}
</style> 