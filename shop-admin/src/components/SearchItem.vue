<template>
  <!-- 表单项封装组件 -->
  <el-col :span="8" :offset="0">
    <el-form-item :label="label" :class="{ 'mb-3': classStatus }">
      <slot />
    </el-form-item>
  </el-col>
</template>

<script setup>
defineProps({
  label: String,
  classStatus: {
    type: Boolean,
    default: false
  },
})
</script>

<style></style>