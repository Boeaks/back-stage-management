<template>
  <div class="flex flex-wrap">
    <div v-if="modelValue && preview">
      <el-image v-if="typeof modelValue === 'string'" :src="modelValue" fit="cover"
        class="w-[100px] h-[100px] rounded border mr-2"></el-image>
      <div v-else class="flex">
        <div class="relative mx-1 mb-2 w-[100px] h-[100px] " v-for="(url, index) in modelValue" :key="index">
          <el-icon class="absolute right-[5px] top-[5px] cursor-pointer bg-white rounded-full z-10"
            @click="removeImage(url)">
            <CircleClose />
          </el-icon>
          <el-image :src="url" fit="cover" class="w-[100px] h-[100px] rounded border mr-2"></el-image>
        </div>
      </div>
    </div>
    <div class="shoose-image-btn" @click="openDialog" v-if="preview">
      <el-icon :size="25" class="text-gray-500">
        <Plus />
      </el-icon>
    </div>
  </div>
  <el-dialog title="头像选择" v-model="dialogVidible" width="80%" top="6vh">
    <template #footer>
      <el-container class="bg-white rounded" style="height: 70vh;">
        <el-header class="image-header">
          <el-button type="primary" size="small" @click="handleCreate">新增图片分类</el-button>
          <el-button type="warning" size="small" @click="handleOpenUpload">上传图片</el-button>
        </el-header>
        <el-container>
          <image-aside ref="imageAsideRef" @change="handleChange"></image-aside>
          <image-main ref="imageMainRef" @choose="handleChoose" :openChoose="true" :limit="limit"></image-main>
        </el-container>
      </el-container>
      <span>
        <el-button @click="dialogVidible = false">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup>
import { ref } from 'vue';
import ImageAside from "@/components/ImageAside.vue"
import ImageMain from '@/components/ImageMain.vue'
import { toast } from '@/composables/util';

// 与父子件的双向通讯
const props = defineProps({
  modelValue: [String, Array],
  limit: {
    type: Number,
    default: 1
  },
  preview: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['update:modelValue'])

const dialogVidible = ref(false)

const callbackFunction = ref(null)
const openDialog = (callback = null) => {
  callbackFunction.value = callback
  dialogVidible.value = true
}
const closeDialog = () => {
  dialogVidible.value = false
}

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

// 获取图片地址
let urls = []
const handleChoose = (item) => {
  urls = item.map(v => v.url)
}
// 图片返回
const submit = () => {
  let value = []
  if (props.limit === 1) {
    value = urls[0]
  } else {
    value = props.preview ? [...props.modelValue, ...urls] : [...urls]
    if (value.length > props.limit) {
      let limit = props.preview ? (props.limit - props.modelValue.length) : props.limit
      return toast(`最多还能选择${limit}张`, 'error')
    }
  }
  if (value && props.preview) {
    emit('update:modelValue', value)
  }
  if (!props.preview && typeof callbackFunction.value === 'function') {
    callbackFunction.value(value)
  }
  closeDialog()
  imageMainRef.value.getData()
}
defineExpose({
  openDialog
})
// 轮播图片移除
const removeImage = (url) => emit('update:modelValue', props.modelValue.filter(o => o !== url))

</script>

<style>
.shoose-image-btn {
  @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-100);
}

.image-header {
  border-bottom: 1px solid #eee;
  @apply flex items-center;
}
</style>