<template>
  <div class="f-tag-list" :style="{ left: $store.state.user.asideWidth }">
    <el-tabs v-model="activeTab" type="card" class="demo-tabs" @tab-remove="removeTab" style="min-width: 100px;"
      @tab-change="changeTab">
      <el-tab-pane v-for="item in tabList" :key="item.path" :label="item.title" :name="item.path"
        :closable="item.path !== '/'">
      </el-tab-pane>
    </el-tabs>
    <el-dropdown class="tag-btn" @command="closeTab">
      <span class="el-dropdown-link">
        <el-icon>
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="closeOther">关闭其他</el-dropdown-item>
          <el-dropdown-item command="closeAll">关闭全部</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <div style="height: 44px;"></div>
</template>

<script setup>
import { useTabList } from '@/composables/useTabList.js';

const {
  activeTab,
  tabList,
  changeTab,
  removeTab,
  closeTab
} = useTabList()

</script>

<style scoped>
.f-tag-list {
  @apply fixed flex items-center px-2 py-3 bg-gray-100;
  top: 64px;
  height: 44px;
  right: 0;
  z-index: 100;
  transition: all 0.2s;
}

.tag-btn {
  @apply bg-white rounded ml-auto flex items-center justify-center px-3;
  height: 32px;
}

:deep(.el-tabs__header) {
  @apply mb-0;
  border: 0 !important;
}

:deep(.el-tabs__nav) {
  border: 0 !important;
}

:deep(.el-tabs__item) {
  @apply bg-white mx-1 rounded;
  border: 0 !important;
  height: 32px;
  line-height: 32px;
}

:deep(.el-tabs) {
  --el-tabs-header-height: auto !important;
}

:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
  line-height: 32px !important;
  height: 32px !important;
}

:deep(.is-disabled) {
  cursor: not-allowed !important;
  @apply text-gray-300;
}
</style>