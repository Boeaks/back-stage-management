<template>
  <el-card shadow="never" class="border-0">
    <template #header>
      <!-- 新增 | 刷新 -->
      <list-header @refresh="getData" @create="handleCreate" :classStatus="false"></list-header>
    </template>
    <!-- card body -->
    <el-table :data="tableData" stripe style="width: 100%;" v-loading="loading">
      <el-table-column prop="title" label="公告标题" />
      <el-table-column prop="create_time" label="发布时间" width="320" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
          <el-popconfirm title="是否要删除该公告" confirmButtonText="确认" cancelButtonText="取消" width="160px"
            @confirm="handleDelete(scope.row.id)">
            <template #reference><el-button text type="primary" size="small">删除</el-button></template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex items-center justify-center mt-5">
      <el-pagination @current-change="getData" :current-page="currentPage" :page-size="limit" layout=" prev,pager,next"
        :total="total" background>
      </el-pagination>
    </div>

    <form-drawer ref="formDrawerRef" :title="noticeType" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入公告标题"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input v-model="form.content" placeholder="请输入公告内容" rows="5" type="textarea"></el-input>
        </el-form-item>
      </el-form>
    </form-drawer>
  </el-card>

</template>

<script setup>
import { getNoticeList, createNotice, updateNotice, deleteNotice } from '@/api/notice';
import FormDrawer from '@/components/FormDrawer.vue';
import ListHeader from '@/components/LisrHeader.vue'
import { useInitTable, useInitForm } from '@/composables/useCommon.js'

const {
  tableData,
  total,
  loading,
  limit,
  currentPage,
  getData,
  handleDelete
} = useInitTable({
  getList: getNoticeList,
  delete: deleteNotice,
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
  update: updateNotice,
  create: createNotice,
  form: {
    title: '',
    content: ''
  },
  rules: {
    title: [{
      required: true,
      message: '标题不能为空',
      trigger: 'blur'
    }],
    content: [{
      required: true,
      message: '内容不能为空',
      trigger: 'blur'
    }]
  }
})

getData()
</script>

<style></style>