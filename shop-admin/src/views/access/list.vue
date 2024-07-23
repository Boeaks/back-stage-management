<template>

  <el-card shadow="never" class="border-0">
    <template #header>
      <!-- 新增 | 刷新 -->
      <list-header @refresh="getData" @create="handleCreate" :classStatus="false"></list-header>
    </template>
    <el-tree :data="tableData" :props="{ label: 'name', children: 'child' }" v-loading="loading" node-key="id"
      :default-expanded-keys="defaultExpendedKeys">
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <el-tag :type="data.menu ? 'primary' : 'info'" size="small">{{ data.menu ? '菜单' : '权限' }}</el-tag>
          <el-icon v-if="data.icon" :size="16" class="ml-2">
            <component :is="data.icon"></component>
          </el-icon>
          <span>{{ data.name }}</span>
          <div class="ml-auto">
            <el-switch :model-value="data.status" :active-value="1" :inactive-value="0" :loading="data.statusLoading"
              @change="handleChangeStatus($event, data)">
            </el-switch>
            <el-button size="small" text type="primary" @click.stop="handleEdit(data)">修改</el-button>
            <el-button size="small" text type="primary" @click.stop="handleAdd(data.id)">增加</el-button>
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
    <form-drawer ref="formDrawerRef" :title="noticeType" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" style="width:80%">
        <el-form-item label=" 上级菜单" prop="rule_id">
          <el-cascader :options="optionsRules" v-model="form.rule_id"
            :props="{ value: 'id', label: 'name', children: 'child', checkStrictly: true, emitPath: false }"
            placeholder="请选择上级菜单">
          </el-cascader>
        </el-form-item>
        <el-form-item label="菜单/规则" prop="menu">
          <el-radio-group v-model="form.menu">
            <el-radio v-for="item in radioItems" :key="item.key" :value="item.label" border>
              {{ item.title }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" style="width: 40%;"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-if="form.menu == 1" class="flex items-center">
          <icon-select v-model="form.icon"></icon-select>
        </el-form-item>
        <el-form-item label="前端路由" prop="frontpath" v-if="form.menu == 1 && form.rule_id > 0">
          <el-input v-model="form.content" placeholder="请输入前端路由"></el-input>
        </el-form-item>
        <el-form-item label="后端规则" prop="condition" v-if="form.menu == 0">
          <el-input v-model="form.content" placeholder="请输入后端规则"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" prop="method" v-if="form.menu == 0">
          <el-select v-model="form.method" class="ml-2" placeholder="请选择请求方式">
            <el-option v-for="item in ['GET', 'POST', 'DELETE', 'PUT']" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="1000">
          </el-input-number>
        </el-form-item>
      </el-form>
    </form-drawer>
  </el-card>
</template>

<script setup>
import ListHeader from '@/components/LisrHeader.vue'
import { getRuleList, createRuleList, updateRuleList, deleteRuleList, updateRuleStatus } from '@/api/rule.js';
import IconSelect from '@/components/IconSelect.vue'
import { useInitTable, useInitForm } from '@/composables/useCommon';
import FormDrawer from '@/components/FormDrawer.vue';
import { reactive, ref } from 'vue';

const optionsRules = ref(null)
const radioItems = reactive([
  {
    key: 'menu',
    label: 1,
    title: '菜单'
  },
  {
    key: 'rules',
    label: 0,
    title: '规则'
  }
])

let defaultExpendedKeys = ref([])
const {
  loading,
  tableData,
  getData,
  handleDelete,
  handleChangeStatus
} = useInitTable({
  getList: getRuleList,
  delete: deleteRuleList,
  updateStatus: updateRuleStatus,
  onGetListSuccess: (res) => {
    tableData.value = res.list
    optionsRules.value = res.rules
    defaultExpendedKeys = res.list.map(o => o.id)
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
  update: updateRuleList,
  create: createRuleList,
  form: {
    rule_id: 0,
    menu: 0,
    name: "",
    condition: "",
    methods: "GET",
    status: 1,
    order: 50,
    icon: "",
    frontpath: ""
  },
  rules: {
    name: [{
      required: true,
      message: '名称不能为空',
      trigger: 'blur'
    }]
  }
})

// 增加
const handleAdd = (id) => {
  handleCreate()
  form.rule_id = id
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