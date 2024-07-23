<template>
  <div class="flex items-center">
    <el-icon v-if="modelValue" :size="20" class="mr-2">
      <component :is="modelValue"></component>
    </el-icon>
    <el-select filterable :model-value="modelValue" @change="handleChange" class="m-2 w-[68%]" placeholder="请选择图标">
      <el-option v-for="item in icons" :key="item" :label="item" :value="item">
        <!-- 自定义模板 -->
        <div class="flex items-center justify-between">
          <el-icon>
            <component :is="item"></component>
          </el-icon>
          <span class="text-gray-500">{{ item }}</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script setup>
import * as ElIcons from '@element-plus/icons-vue'
import { ref } from 'vue';

const icons = ref(Object.keys(ElIcons))

defineProps({
  modelValue: String
})
const emit = defineEmits(['update:modelValue'])
const handleChange = (icon) => {
  emit('update:modelValue', icon)
}
</script>

<style></style>