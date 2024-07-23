<template>
  <el-card shadow="never" class="border-0">
    <template #header>
      <!-- 新增 | 刷新 -->
      <list-header @refresh="getData" @create="handleCreate" :classStatus="false"></list-header>
    </template>
    <!-- card body -->
    <el-table :data="tableData" stripe style="width: 100%;" v-loading="loading">
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="desc" label="角色描述" width="320" />
      <el-table-column label="状态" width="120">
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
          <div v-if="scope.row.name != '超级管理员' && scope.row.desc != '最高权限'">
            <el-button type="primary" size="small" text @click="openSetRule(scope.row)">权限配置</el-button>
            <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
            <el-popconfirm title="是否要删除该公告" confirmButtonText="确认" cancelButtonText="取消" width="160px"
              @confirm="handleDelete(scope.row.id)">
              <template #reference><el-button text type="primary" size="small">删除</el-button></template>
            </el-popconfirm>
          </div>
          <span v-else class="text-sm to-gray-500">暂无操作</span>
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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input v-model="form.desc" placeholder="请输入角色描述" rows="5" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="状态" width="120" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
    </form-drawer>

    <!-- 权限配置 -->
    <form-drawer destroyOnClose ref="setRuleFormDrawerRef" title="权限配置" @submit="handleSetRuleSubmit">
      <el-tree-v2 ref="treeRef" :data="ruleList" :props="{ label: 'name', children: 'child' }" show-checkbox
        node-key='id' :height="treeHeight" :default-expanded-keys="defaultExpandedKeys" :check-strictly="checkStrictly"
        @check="handleTreeCheck">
        <template #default="{ node, data }">
          <div class="flex items-center">
            <el-tag :type="data.menu ? 'primary' : 'info'" size="small">
              {{ data.menu ? '菜单' : '权限' }}
            </el-tag>
            <span class="ml-2 text-sm">{{ data.name }}</span>
          </div>
        </template>
      </el-tree-v2>

    </form-drawer>
  </el-card>

</template>

<script setup>
import { getRoleList, createRole, updateRole, deleteRole, updateRoleStatus, setRoleRules } from '@/api/role.js';
import { getRuleList } from '@/api/rule.js';
import FormDrawer from '@/components/FormDrawer.vue';
import ListHeader from '@/components/LisrHeader.vue'
import { useInitTable, useInitForm } from '@/composables/useCommon.js'
import { tips } from '@/composables/util';
import { ref } from 'vue';

const checkStrictly = ref(false) // 关联状态

const {
  tableData,
  total,
  loading,
  limit,
  currentPage,
  getData,
  handleDelete,
  handleChangeStatus
} = useInitTable({
  getList: getRoleList,
  delete: deleteRole,
  updateStatus: updateRoleStatus
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
  update: updateRole,
  create: createRole,
  form: {
    name: '',
    desc: '',
    status: 1
  },
  rules: {
    name: [{
      required: true,
      message: '角色名称不能为空',
      trigger: 'blur'
    }],
    desc: [{
      required: true,
      message: '角色描述不能为空',
      trigger: 'blur'
    }]
  }
})

// 权限配置
const setRuleFormDrawerRef = ref(null)
const ruleList = ref([])
const treeHeight = ref(0)
const roleId = ref(0)
const defaultExpandedKeys = ref([])
const ruleId = ref([]) // 当前角色拥有的权限ID
const treeRef = ref(null)

const openSetRule = (row) => {
  roleId.value = row.id
  treeHeight.value = window.innerHeight - 180
  checkStrictly.value = true

  getRuleList(1).then(res => {
    ruleList.value = res.list
    defaultExpandedKeys.value = res.list.map(o => o.id)
    setRuleFormDrawerRef.value.open()
    // 当前角色拥有的权限ID
    ruleId.value = row.rules.map(o => o.id)
    setTimeout(() => {
      treeRef.value.setCheckedKeys(ruleId.value)
      checkStrictly.value = false
    }, 150);
  })

}

// 选中的权限ID
const handleTreeCheck = (...e) => {
  const { checkedKeys, halfCheckedKeys } = e[1]
  ruleId.value = [...checkedKeys, ...halfCheckedKeys]
}

// 提交
const handleSetRuleSubmit = () => {
  setRuleFormDrawerRef.value.showLoading()
  setRoleRules(roleId.value, ruleId.value).then(res => {
    tips('配置成功')
    setRuleFormDrawerRef.value.close()
    getData()
  }).finally(() => {
    setRuleFormDrawerRef.value.hidenLoading()
  })
}
getData()
</script>

<style></style>