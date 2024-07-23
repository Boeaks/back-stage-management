<template>
  <el-main class="image-main" v-loading="loading">
    <div class="top p-3">
      <el-row :gutter="10">
        <el-col :span="6" :offset="0" v-for="(item, index) in list" :key="item.id || index">
          <el-card shadow="hover" class="relative mb-3" :body-style="{ padding: 0 }"
            :class="{ 'border-indigo-500 border-2 shadow-light-500': item.checked }">
            <el-image :src="item.url" class="h-[150px] w-full" :preview-src-list="[item.url]"
              :initial-index="0"></el-image>
            <div class="image-title">{{ item.name }}</div>
            <div class="flex justify-center items-center pb-2">
              <el-checkbox v-model="item.checked" @change="handleChooseChange(item)" class="px-2"
                v-if="openChoose"></el-checkbox>
              <el-button type="primary" size="small" @click="handleEdit(item)">重命名</el-button>
              <el-popconfirm title="是否要删除该图片？" confirmButtonText="确认" cancelButtonText="取消" width="180px"
                @confirm="handleDelete(item.id)">
                <template #reference>
                  <el-button type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </el-card>
        </el-col>
      </el-row>

    </div>
    <div class="bottom">
      <el-pagination @current-change="currentChange" :current-page="currentPage" :page-size="limit"
        layout=" prev,pager,next" :total="total" background>
      </el-pagination>
    </div>
  </el-main>

  <el-drawer title="上传图片" v-model="drawer">
    <upload-file :data="{ image_class_id }" @success='handleUploadSuccess'></upload-file>
  </el-drawer>

</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import { showPrompt, tips, toast } from '@/composables/util';
import { getImageList, updateImage, deleteImage } from '@/api/image';
import UploadFile from '@/components/UploadFile.vue';

const total = ref(0)
const currentPage = ref(1)
const limit = ref(12)
const list = ref([])
const loading = ref(false)
// 图片所在类id
const image_class_id = ref(0)

const props = defineProps({
  openChoose: {
    type: Boolean,
    default: false
  },
  limit: {
    type: Number,
    default: 1
  }
})

// 上传图片
const drawer = ref(false)
const openUploadFile = () => drawer.value = true

// 获取图片数据
function getData(page = null) {
  loading.value = true
  if (typeof page === 'number') currentPage.value = page;
  getImageList(image_class_id.value, currentPage.value, limit.value).then(res => {
    list.value = res.list.map(o => {
      o.checked = false
      return o
    })
    total.value = res.totalCount
  }).finally(() => {
    loading.value = false
  })
}

// 通过分类ID加载图片列表
function LoadingImage(id) {
  currentPage.value = 1
  image_class_id.value = id
  getData()
}

// 分页换页
const currentChange = (page) => {
  getData(page)
}

// 重命名
const handleEdit = (item) => {
  showPrompt('重命名', item.name).then(({ value }) => {
    loading.value = true
    updateImage(item.id, value).then(() => {
      tips('修改成功')
      getData()
    }).finally(() => {
      loading.value = false
    })
  })
}

// 删除图片
const handleDelete = (id) => {
  loading.value = true
  deleteImage([id]).then(() => {
    tips('删除成功')
    getData()
  }).finally(() => {
    loading.value = false
  })
}

// 上传成功，刷新页面
const handleUploadSuccess = () => {
  getData()
}

// 选中状态
const emit = defineEmits(['choose'])
const handleChooseChange = (item) => {
  const checkedImage = computed(() => list.value.filter(v => v.checked))
  if (item.checked && checkedImage.value.length > props.limit) {
    item.checked = false
    return toast(`最多选中${props.limit}张`, 'error')
  }
  emit('choose', checkedImage.value)
}

defineExpose({
  LoadingImage,
  openUploadFile,
  getData
})

</script>

<style scoped>
.image-main {
  position: relative;
}

.image-main .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}

.image-main .bottom {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  height: 50px;
  @apply flex items-center justify-center;
}

.image-title {
  position: absolute;
  top: 122px;
  left: -1px;
  right: -1px;
  @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1;
}
</style>