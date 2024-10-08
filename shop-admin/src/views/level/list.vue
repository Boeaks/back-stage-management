<template>
  <el-card shadow="never">
    <LisrHeader layout="create,refresh" @refresh="getData" @create="handleCreate"></LisrHeader>
    <el-table ref="multipleTableRef" :data="tableData" stripe style="width: 100%;" v-loading="loading">
      <el-table-column prop="name" label="会员等级" align="center" />
      <el-table-column prop="discount" label="折扣率(%)" align="center" />
      <el-table-column prop="level" label="等级序号" align="center" />
      <el-table-column label="状态" width="120" align="center">
        <template #default="{ row }">
          <el-switch :model-value="row.status" :active-value="1" :inactive-value="0"
            v-if="row.name != '超级管理员' && row.desc != '最高权限'" @change="handleChangeStatus($event, row)"
            :loading="row.statusLoading" :disabled="row.super === 1">
          </el-switch>
          <span v-else class="text-sm to-gray-500">---</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template #default="scope">
          <div>
            <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
            <el-popconfirm title="是否要删除该记录吗？" confirmButtonText="确认" cancelButtonText="取消" width="200px"
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

    <form-drawer ref="formDrawerRef" :title="noticeType" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" style="width: 90%;" :inline="false">
        <el-form-item label="等级名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入等级名称"></el-input>
        </el-form-item>
        <el-form-item label="等级权重" prop="level">
          <el-input v-model="form.level" type="number"></el-input>
        </el-form-item>
        <el-form-item label="是否开启" width="120" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="升级条件">
          <div>
            <small class="text-xs mr-1">累计消费满</small>
            <el-input v-model="form.max_price" style="width: 50%;" type="number">
              <template #append>元</template>
            </el-input>
            <small class="text-gray-400 flex">设置会员等级所需要的累计消费必须大于等于0，单位：元</small>
          </div>
          <div>
            <small class="text-xs mr-1">累计次数满</small>
            <el-input v-model="form.max_times" style="width: 50%;" type="number">
              <template #append>笔</template>
            </el-input>
            <small class="text-gray-400 flex">设置会员等级所需要的购买数量必须大于等于0，单位：笔</small>
          </div>
        </el-form-item>
        <el-form-item label="折扣率(%)">
          <el-input v-model="form.discount" style="width: 70%;" type="number">
            <template #append>%</template>
          </el-input>
          <small class="text-gray-400 flex w-[110%]">如输入90，表示该会员等级的用户可以以商品原价的90%购买</small>
        </el-form-item>
      </el-form>
    </form-drawer>
  </el-card>
</template>

<script setup>
import LisrHeader from '@/components/LisrHeader.vue';
import { getUserLevelList, createUserLevel, updateUserLevel, deleteUserLevel, updateUserLevelStatus, } from '@/api/level.js';
import { useInitTable, useInitForm } from '@/composables/useCommon.js'
import FormDrawer from '@/components/FormDrawer.vue';

const {
  tableData,
  total,
  loading,
  limit,
  currentPage,
  multipleTableRef,
  getData,
  handleDelete,
  handleChangeStatus
} = useInitTable({
  getList: getUserLevelList,
  delete: deleteUserLevel,
  updateStatus: updateUserLevelStatus
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
  update: updateUserLevel,
  create: createUserLevel,
  form: {
    name: '',
    discount: 0,
    status: 1,
    level: 100,
    max_price: 0,
    max_times: 0
  },
  rules: {
    name: [{
      required: true,
      message: '会员等级名称不能为空',
      trigger: 'blur'
    }]
  }
})

</script>


<style></style>