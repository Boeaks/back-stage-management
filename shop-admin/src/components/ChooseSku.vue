<template>
  <el-dialog title="规格选择" v-model="dialogVidible" width="80%" top="8vh">
    <el-container class="bg-white rounded" style="height: 70vh;">
      <el-aside width="220px" class="image-aside" v-loading=loading>
        <div class="top">
          <div class="sku-list" :class="{ 'active': (activeId === item.id) }" v-for="(item, index) in tableData"
            :key="index" @click="handleChangeActiveId(item.id)">
            {{ item.name }}
          </div>
        </div>
        <div class="bottom">
          <el-pagination @current-change="getData" :current-page="currentPage" :page-size="limit" layout=" prev,next"
            :total="total" background>
          </el-pagination>
        </div>
      </el-aside>
      <el-main>
        <el-checkbox-group v-model="form.list">
          <el-checkbox v-for="item in list" :key="item" :value="item" border>
            {{ item }}
          </el-checkbox>
        </el-checkbox-group>

      </el-main>
    </el-container>
    <template #footer>
      <span>
        <el-button @click=" dialogVidible = false">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from "vue";
import { getSkusList } from "@/api/skus";
import { useInitTable } from "@/composables/useCommon";


const {
  loading,
  currentPage,
  limit,
  total,
  tableData,
  getData
} = useInitTable({
  getList: getSkusList,
  onGetListSuccess: (res) => {
    tableData.value = res.list
    total.value = res.totalCount
    if (tableData.value) {
      handleChangeActiveId(tableData.value[0].id)
    }
  }
})
let dialogVidible = ref(false)
const activeId = ref(0)
const form = reactive({
  name: '',
  list: []
})
const func = ref(null)
const open = (callback = null) => {
  dialogVidible.value = true
  if (callback) {
    func.value = callback
  }
}
const submit = () => {
  if (typeof func.value === 'function') {
    func.value(form)
  }
  dialogVidible.value = false
  form.name = '',
    form.list = []
}
const list = ref([])
function handleChangeActiveId(id) {
  activeId.value = id
  list.value = []
  const item = tableData.value.find(o => o.id === id)
  if (item) {
    form.name = item.name
    list.value = item.default.split(',')
  }
}

defineExpose({
  open
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

.sku-list {
  border-bottom: 1px solid #f4f4f4;
  @apply p-3 text-sm text-gray-600 flex items-center justify-center cursor-pointer;
}

.sku-list:hover,
.active {
  @apply bg-indigo-50
}
</style>