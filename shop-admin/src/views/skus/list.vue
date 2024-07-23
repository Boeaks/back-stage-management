<template>
  <el-card shadow="never" class="border-0">
    <template #header>
      <!-- 新增 | 刷新 -->
      <list-header layout="create,delete,refresh" @refresh="getData" @create="handleCreate" @delete="handleMultiDelete"
        :classStatus="false"></list-header>
    </template>
    <!-- card body -->
    <el-table ref="multipleTableRef" :data="tableData" stripe style="width: 100%;" v-loading="loading"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="name" label="规格名称" />
      <el-table-column prop="default" label="规格值" width="320" />
      <el-table-column prop="order" label="排序">
        <template #default="{ row }">
          <el-switch :model-value="row.status" :active-value="1" :inactive-value="0"
            @change="handleChangeStatus($event, row)" :loading="row.statusLoading" :disabled="row.super === 1">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template #default="scope">
          <div>
            <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
            <el-popconfirm title="是否要删除该规格？" confirmButtonText="确认" cancelButtonText="取消" width="180px"
              @confirm="handleDelete(scope.row.id)">
              <template #reference><el-button text type="primary" size="small">删除</el-button></template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex items-center justify-center mt-5">
      <el-pagination @current-change="getData" :current-page="currentPage" :page-size="limit" layout=" prev,pager,next"
        :total="total" background>
      </el-pagination>
    </div>

    <form-drawer destroyOnClose ref="formDrawerRef" :title="noticeType" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入规格名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="1000">
          </el-input-number>
        </el-form-item>
        <el-form-item label="状态" width="120" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="规格值" prop="default">
          <TagInput v-model="form.default" />
        </el-form-item>
      </el-form>
    </form-drawer>
  </el-card>

</template>

<script setup>
import { getSkusList, createSkus, updateSkus, deleteSkus, updateSkusStatus, } from '@/api/skus.js';
import FormDrawer from '@/components/FormDrawer.vue';
import ListHeader from '@/components/LisrHeader.vue'
import { useInitTable, useInitForm } from '@/composables/useCommon.js'
import TagInput from '@/components/TagInput.vue'

const {
  tableData,
  total,
  loading,
  limit,
  currentPage,
  multipleTableRef,
  getData,
  handleDelete,
  handleChangeStatus,
  handleSelectionChange,
  handleMultiDelete
} = useInitTable({
  getList: getSkusList,
  delete: deleteSkus,
  updateStatus: updateSkusStatus
})

// 新增修改封装
const {
  formDrawerRef,
  formRef,
  form,
  rules,
  noticeType,
  handleSubmit,
  handleEdit,
  handleCreate,
} = useInitForm({
  getData,
  update: updateSkus,
  create: createSkus,
  form: {
    name: '',
    default: '',
    status: 1,
    order: 50
  },
  rules: {
    name: [{
      required: true,
      message: '规格名称不能为空',
      trigger: 'blur'
    }],
    default: [{
      required: true,
      message: '规格值不能为空',
      trigger: 'blur'
    }]
  }
})


getData()
</script>

<style></style>