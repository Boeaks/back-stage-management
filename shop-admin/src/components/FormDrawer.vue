<!-- 抽屉弹窗组件 -->
<template>
  <el-drawer v-model="showDrawer" :title="title" :destroy-on-close="destroyOnClose"
    :close-on-click-modal="closeOnClickModal" :size="size">
    <div class="formDrawer">
      <div class="form-body" :class="{ 'flex justify-center': classCenter }">
        <slot>
        </slot>
      </div>
      <div class="form-actions">
        <el-button :loading="loading" type="primary" @click="submit">{{ confirmText }}</el-button>
        <el-button type="default" @click="close">取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue'

// 自定义属性
const props = defineProps({
  title: String,
  size: {
    type: String,
    default: '35%'
  },
  destroyOnClose: {
    type: Boolean,
    default: false
  },
  confirmText: {
    type: String,
    default: '提交'
  },
  closeOnClickModal: {
    type: Boolean,
    default: false
  },
  classCenter: {
    type: Boolean,
    default: false
  }
})

// 自定义事件
const emit = defineEmits(['submit'])
// 触发自定义事件
const submit = () => emit("submit")

const loading = ref(false)
const showDrawer = ref(false)
// 打开
const open = () => showDrawer.value = true
const showLoading = () => loading.value = true
// 关闭
const close = () => showDrawer.value = false
const hidenLoading = () => loading.value = false

// 暴露给父组件
defineExpose({
  open, close, showLoading, hidenLoading
})
</script>

<style>
.formDrawer {
  @apply flex flex-col;
  width: 100%;
  height: 100%;
}

.formDrawer .form-body {
  @apply flex-1 overflow-y-auto;
}

.formDrawer .form-actions {
  height: 50px;
  @apply flex items-center mt-auto;
}

.form-actions {
  @apply ml-auto;
}
</style>