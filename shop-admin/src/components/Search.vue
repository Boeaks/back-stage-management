<template>
  <el-form :model="model" size="small" class="px-4 py-1 mb-2">
    <el-row :gutter="20" class="flex items-center justify-between">
      <!-- 可变内容，用插槽 -->
      <slot />
      <template v-if="showSearch">
        <slot name="show" />
      </template>
      <!-- 固定内容 -->
      <el-col :span="8" :offset="showSearch ? 0 : 8">
        <div class="flex justify-end items-center">
          <el-button type="primary" @click="$emit('search')">搜索</el-button>
          <el-button @click="$emit('reset')">重置</el-button>
          <el-button v-if="hasShowSearch" @click="showSearch = !showSearch" type="primary" text>{{ !showSearch ? '展开' :
            '收起'
            }}
            <el-icon>
              <ArrowUp v-if="showSearch" />
              <ArrowDown v-else />
            </el-icon>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, useSlots } from 'vue';

const slots = useSlots()
// 有对应的插槽内容，才为 true 进行渲染
const hasShowSearch = ref(!!slots.show)
defineProps({
  model: Object
})
const showSearch = ref(false)
defineEmits(['search', 'reset'])
</script>

<style></style>