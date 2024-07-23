<template>
  <el-card shadow="never" class="border-0">
    <template #header>
      <!-- 搜索 -->
      <!-- 表单组件 -->
      <search @search="getData" @reset="resetSearchForm" :model="searchForm">
        <!-- 表单项组件 -->
        <search-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="管理员名称" clearable></el-input>
        </search-item>
      </search>
    </template>
    <!-- card body -->
    <!-- 新增 | 刷新 -->
    <list-header @refresh="getData" @create="handleCreate"></list-header>
    <el-table :data="tableData" stripe style="width: 100%;" v-loading="loading">
      <el-table-column label="管理员" width="200">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-avatar icon="el-icon-user-solid" :size="40" shape="circle" :src="row.avatar" fit="fill"></el-avatar>
            <div class="ml-3">
              <h6>{{ row.username }}</h6>
              <small>ID: {{ row.id }}</small>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所属角色">
        <template #default="{ row }">
          {{ row.role?.name || "-" }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-switch :model-value="row.status" :active-value="1" :inactive-value="0"
            @change="handleChangeStatus($event, row)" :loading="row.statusLoading" :disabled="row.super === 1">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <small v-if="scope.row.super === 1" class="text-sm to-gray-500">暂无操作</small>
          <div v-else>
            <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
            <el-popconfirm title="是否要删除该管理员？" confirmButtonText="确认" cancelButtonText="取消" width="160px"
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
      <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" :inline="false" class="w-[80%]">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <choose-image v-model="form.avatar"></choose-image>
        </el-form-item>
        <el-form-item label="所属角色" prop="role_id">
          <el-select v-model="form.role_id" placeholder="选择所属角色">
            <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>
    </form-drawer>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';
import { getManagerList, updateManagerStatus, createManager, updateManager, deleteManager } from '@/api/manager.js';
import FormDrawer from '@/components/FormDrawer.vue';
import ListHeader from '@/components/LisrHeader.vue'
import ChooseImage from '@/components/ChooseImage.vue';
import { useInitTable, useInitForm } from '@/composables/useCommon.js'
import Search from '@/components/Search.vue';
import SearchItem from '@/components/SearchItem.vue';
// 角色
const roles = ref([])
const {
  searchForm,
  tableData,
  total,
  loading,
  limit,
  currentPage,
  resetSearchForm,
  handleChangeStatus,
  handleDelete,
  getData
} = useInitTable({
  searchForm: {
    keyword: ''
  },
  getList: getManagerList,
  updateStatus: updateManagerStatus,
  delete: deleteManager,
  onGetListSuccess: (res) => {
    tableData.value = res.list.map(o => {
      o.statusLoading = false
      return o
    })
    roles.value = res.roles
    total.value = res.totalCount
  }
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
  update: updateManager,
  create: createManager,
  form: {
    username: '',
    password: '',
    role_id: null,
    status: 1,
    avatar: ""
  },
  rules: {
    username: [{
      required: true,
      message: '用户名不能为空',
      trigger: 'blur'
    }],
    password: [{
      required: true,
      message: '密码不能为空',
      trigger: 'blur'
    }]
  }
})

</script>

<style></style>