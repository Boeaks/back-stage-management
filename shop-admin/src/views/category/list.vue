<template>
  <el-card shadow="never" class="border-0">
    <template #header>
      <!-- 新增 | 刷新 -->
      <list-header @refresh="getData" @create="handleCreate" :classStatus="false"></list-header>
    </template>
    <el-tree :data="tableData" :props="{ label: 'name', children: 'child' }" v-loading="loading" node-key="id">
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <span>{{ data.name }}</span>
          <div class="ml-auto">
            <el-button size="small" text type="primary" @click.stop="handleRecommend(data)"
              :loading="data.btnLoading">推荐商品</el-button>
            <el-switch :model-value="data.status" :active-value="1" :inactive-value="0" :loading="data.statusLoading"
              @change="handleChangeStatus($event, data)">
            </el-switch>
            <el-button size="small" text type="primary" @click.stop="handleEdit(data)">修改</el-button>
            <el-popconfirm title="是否要删除该记录？" confirmButtonText="确定" cancelButtonText="取消" width="180px"
              @confirm="handleDelete(data.id)">
              <template #reference>
                <el-button size="small" text type="primary" @click.stop="">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </el-tree>
  </el-card>
  <form-drawer ref="formDrawerRef" :title="noticeType" @submit="handleSubmit" closeOnClickModal>
    <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" style="width:80%">
      <el-form-item label="商品分类" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称" style="width: 80%;"></el-input>
      </el-form-item>
    </el-form>
  </form-drawer>
  <goods-drawer ref="goodsDrawerRef"></goods-drawer>
</template>

<script setup>
import ListHeader from '@/components/LisrHeader.vue'
import FormDrawer from '@/components/FormDrawer.vue'
import { getCategoryList, createCategoryList, updateCategoryList, deleteCategory, updateCategoryStatus } from '@/api/category.js';
import { useInitTable, useInitForm } from '@/composables/useCommon';
import { ref } from 'vue';
import GoodsDrawer from '@/views/category/components/GoodsDrawer.vue'

const {
  loading,
  tableData,
  getData,
  handleDelete,
  handleChangeStatus
} = useInitTable({
  getList: getCategoryList,
  delete: deleteCategory,
  updateStatus: updateCategoryStatus,
  onGetListSuccess: (res) => {
    tableData.value = res
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
  update: updateCategoryList,
  create: createCategoryList,
  form: {
    name: ""
  },
  rules: {
    name: [{
      required: true,
      message: '名称不能为空',
      trigger: 'blur'
    }]
  }
})

const goodsDrawerRef = ref(null)
// 推荐商品
const handleRecommend = (data) => {
  goodsDrawerRef.value.open(data)
}
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
}

.el-tree-node__content {
  padding: 20px 0;
}

.el-form-item__content {
  display: block !important;
}
</style>