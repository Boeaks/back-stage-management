<template>
  <el-dialog title="商品选择" v-model="dialogVisibility" width="80%" top="8vh" destroy-on-close>
    <el-table :data="tableData" border stripe ref="multipleTableRef" @selection-change="handleSelectionChange"
      style="width: 100%;" v-loading="loading" height="450px">
      <el-table-column type="selection" width="55" />
      <el-table-column label="商品">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-image :src="row.cover" fit="cover" :lazy="true" style="width: 50px; height: 50px;"
              class="mr-3 rounded"></el-image>
            <div class="flex-1">
              <p>{{ row.title }}</p>
              <p class="text-gray-400 text-xs mb-1">分类：{{ row.category ? row.category.name : '未分类' }}</p>
              <p class="text-gray-400 text-xs">创建时间：{{ row.create_time }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="总库存" align="center" width="90px" prop="stock" />
      <el-table-column label="价格(元)" align="center" width="200px">
        <template #default="{ row }">
          <span class="text-rose-500">￥{{ row.min_price }}</span>
          <el-divider direction="vertical"></el-divider>
          <span class="text-gray-500">￥{{ row.min_oprice }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex items-center justify-center mt-5">
      <el-pagination background layout="prev, pager, next" @current-change="getData" :total="total"
        :current-page="currentPage" :limit="limit" />
    </div>

    <template #footer>
      <span>
        <el-button @click=" dialogVisibility = false">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup>
import { ref } from 'vue';
import { getGoodsList } from '@/api/goods';
import { useInitTable } from '@/composables/useCommon.js'
const {
  searchForm,
  tableData,
  total,
  loading,
  limit,
  currentPage,
  multSelectionIds,
  handleDelete,
  getData,
  handleSelectionChange,
} = useInitTable({
  searchForm: {
    title: '',
    tab: 'all',
    category_id: null
  },
  getList: getGoodsList,
  onGetListSuccess: (res) => {
    tableData.value = res.list
    total.value = res.totalCount
  }
})

const submit = () => {
  func.value(multSelectionIds.value)
  dialogVisibility.value = false
}

const dialogVisibility = ref(false)
const func = ref(null)
const open = (callback = null) => {
  dialogVisibility.value = true
  if (typeof callback === 'function') {
    func.value = callback
  }
}

defineExpose({
  open
})
</script>

<style></style>