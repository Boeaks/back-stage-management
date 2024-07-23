<template>
  <div class="aside-list" :class="{ 'active': active }">
    <span class="truncate">
      <slot />
    </span>
    <el-button text size="small" class="ml-auto px-1" @click.stop="$emit('Edit')">
      <el-icon :size="12">
        <Edit />
      </el-icon>
    </el-button>
    <el-popconfirm title="是否要删除该分类？" confirmButtonText="确认" cancelButtonText="取消" width="180px"
      @confirm="$emit('Delete')">
      <template #reference>
        <el-button text size="small" class="px-1" @click.stop="">
          <el-icon :size="12">
            <Close />
          </el-icon>
        </el-button>
      </template>
    </el-popconfirm>
  </div>
</template>

<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false
  }
})
defineEmits(['Edit', 'Delete'])
</script>

<style scoped>
.aside-list {
  border-bottom: 1px solid #f4f4f4;
  cursor: pointer;
  @apply flex items-center p-3 text-sm text-gray-600;
}

.aside-list:hover,
.active {
  @apply bg-blue-50;
}
</style>