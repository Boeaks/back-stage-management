<template>
  <div>
    <el-container class="bg-white rounded" :style="{ height: (h + 'px') }">
      <el-header class="image-header">
        <el-button type="primary" size="small" @click="handleCreate">新增图片分类</el-button>
        <el-button type="warning" size="small" @click="handleOpenUpload">上传图片</el-button>
      </el-header>
      <el-container>
        <image-aside ref="imageAsideRef" @change="handleChange"></image-aside>
        <image-main ref="imageMainRef"></image-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import ImageAside from "@/components/ImageAside.vue"
import ImageMain from '@/components/ImageMain.vue'
import { ref } from "vue";

const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 64 - 44 - 40

const imageAsideRef = ref(null)
const imageMainRef = ref(null)

const handleCreate = () => {
  imageAsideRef.value.handleCreate()
}

// 图片分类切换，自动加载相应图片
function handleChange(id) {
  imageMainRef.value.LoadingImage(id)
}

// 上传图片
function handleOpenUpload() {
  imageMainRef.value.openUploadFile()
}

</script>

<style scoped>
.image-header {
  border-bottom: 1px solid #eee;
  @apply flex items-center;
}
</style>