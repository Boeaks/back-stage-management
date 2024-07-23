<template>
  <el-aside width="220px" class="image-aside" v-loading=loading>
    <div class="top">
      <aside-list v-for="(item, index) in list" :key="item.id || index" :active="activeId === item.id"
        @Edit="handleEdit(item)" @Delete="handleDelete(item.id)" @click="handelChangeActiveId(item.id)">
        {{ item.name }}
      </aside-list>
    </div>
    <div class="bottom">
      <el-pagination @current-change="currentChange" :current-page="currentPage" :page-size="limit" layout=" prev,next"
        :total="total" background>
      </el-pagination>
    </div>
  </el-aside>

  <form-drawer ref="formDrawerRef" @submit="handleSubmit" :title="drawerTitle" :closeOnClickModal="true">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
      <el-form-item label="相册名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.order" :min="1" :max="1000" @change="handleChange" />
      </el-form-item>
    </el-form>
  </form-drawer>
</template>

<script setup>
import AsideList from '@/components/AsideList.vue'
import { getImageClassList, createImageClass, updateImageClass, deleteImageClass } from '@/api/image_class.js'
import FormDrawer from '@/components/FormDrawer.vue';
import { computed, reactive, ref } from 'vue';
import { tips } from '@/composables/util';

const list = ref([])
const loading = ref(false)
const activeId = ref(0)

const total = ref(0)
const currentPage = ref(1)
const limit = ref(10)

const formDrawerRef = ref(null)

const formRef = ref(null)

// 修改 / 新增
const editId = ref(0)
const drawerTitle = computed(() => editId.value ? '修改' : '新增')
const handleCreate = () => {
  formDrawerRef.value.open()
  form.name = ''
  form.order = 50
  editId.value = 0
}

const form = reactive({
  name: '',
  order: 50
})

const rules = {
  name: [{
    required: true,
    message: '图库分类名称不能为空',
    trigger: 'blur'
  }]
}

const handleChange = () => {

}
// 表单提交
const handleSubmit = () => {
  formRef.value.validate((val) => {
    if (!val) return;
    formDrawerRef.value.showLoading()
    const fun = editId.value ? updateImageClass(editId.value, form) : createImageClass(form)
    fun.then(res => {
      tips(drawerTitle.value + "成功")
      getData(editId.value ? currentPage.value : 1)
      form.name = ''
      form.order = 50
    })
  }).finally(() => {
    formDrawerRef.value.hidenLoading()
  })
}
// 获取侧边栏数据
function getData(page = null) {
  loading.value = true
  if (typeof page === 'number') currentPage.value = page;
  getImageClassList(currentPage.value, limit.value).then(res => {
    list.value = res.list
    total.value = res.totalCount
    handelChangeActiveId(res.list[0].id)
  }).finally(() => {
    loading.value = false
    formDrawerRef.value.close()
  })
}

// 修改图片分类标题
const handleEdit = (item) => {
  formDrawerRef.value.open()
  editId.value = item.id
  form.name = item.name
  form.order = item.order
}

const currentChange = (page) => {
  getData(page)
}

// 删除分类标题
const handleDelete = (id) => {
  loading.value = true
  deleteImageClass(id).then(res => {
    getData()
    tips('删除成功')
  }).finally(() => {
    loading.value = false
  })
}

// 共享分类ID
const emit = defineEmits(['change'])
const handelChangeActiveId = (id) => {
  activeId.value = id
  emit('change', id)
}

getData()

defineExpose({
  handleCreate
})
</script>

<style scoped>
.image-aside {
  border-right: 1px solid #eee;
  position: relative;
}

.image-aside .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 75px;
  overflow-y: auto;
}

.image-aside .bottom {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  height: 75px;
  @apply flex items-center justify-center;
}
</style>