<template>
  <el-card shadow="never" class="border-0">
    <template #header>
      <!-- 新增 | 刷新 -->
      <list-header @refresh="getData" @create="handleCreate" :classStatus="false"></list-header>
    </template>
    <!-- card body -->
    <el-table :data="tableData" stripe style="width: 100%;" v-loading="loading">
      <el-table-column label="优惠券名称" width="350pxs">
        <template #default="{ row }">
          <div class="border border-dashed py-2 px-4 rounded" :class="row.statusText === '领取中' ? 'active' : 'inactive'">
            <h5 class="font-bold text-base">{{ row.name }}</h5>
            <small>{{ row.start_time }} ~ {{ row.end_time }}</small>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="statusText" label="状态" align="center" />
      <el-table-column label="优惠" align="center">
        <template #default="{ row }">
          {{ row.type === 0 ? "满减" : "折扣" }} {{ row.type === 0 ? ("￥" + row.value + ' 元') : (Math.round(row.value) +
            ' 折') }}
        </template>
      </el-table-column>
      <el-table-column prop="total" label="发放数量" align="center" />
      <el-table-column prop="used" label="已使用" align="center" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" text @click="handleEdit(scope.row)"
            v-if="scope.row.statusText === '未开始'">修改</el-button>
          <el-popconfirm v-if="scope.row.statusText !== '领取中'" title="是否要删除该优惠券？" confirmButtonText="确认"
            cancelButtonText="取消" width="200px" @confirm="handleDelete(scope.row.id)">
            <template #reference><el-button text type="primary" size="small">删除</el-button></template>
          </el-popconfirm>
          <el-popconfirm v-if="scope.row.statusText === '领取中'" title="是否让该优惠券失效？" confirmButtonText="失效"
            cancelButtonText="取消" width="200px" @confirm="handleChangeStatus(scope.row.id, 0)">
            <template #reference><el-button type="danger" size="small">失效</el-button></template>
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
      <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" :inline="false">
        <el-form-item label="优惠券名称" prop="name" style="width: 50%;">
          <el-input v-model="form.name" placeholder="请输入优惠券名称"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :value="0">满减</el-radio>
            <el-radio :value="1">折扣</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="面值" prop="value">
          <el-input v-model="form.value" placeholder="面值" style="width: 50%;">
            <template #append>{{ form.type ? '折' : '元' }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="发行量" prop="total">
          <el-input-number v-model="form.total" :min="0" :max="100000">
          </el-input-number>
        </el-form-item>
        <el-form-item label="最低价格" prop="min_price">
          <el-input v-model="form.min_price" placeholder="请输入最低使用价格" type="number" style="width: 50%;"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="1000">
          </el-input-number>
        </el-form-item>
        <el-form-item label="活动时间" prop="content">
          <el-date-picker v-model="timerange" :editable="false" type="datetimerange" range-separator="至"
            :clearable="false" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%;" start-placeholder="开始时间"
            end-placeholder="结束时间" />
        </el-form-item>
      </el-form>
    </form-drawer>
  </el-card>

</template>

<script setup>
import { getCouponList, createCoupon, updateCoupon, deleteCoupon, updateCouponStatus } from '@/api/coupon';
import FormDrawer from '@/components/FormDrawer.vue';
import ListHeader from '@/components/LisrHeader.vue'
import { useInitTable, useInitForm } from '@/composables/useCommon.js'
import { computed } from 'vue';

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
  getList: getCouponList,
  delete: deleteCoupon,
  updateStatus: updateCouponStatus,
  onGetListSuccess: (res) => {
    tableData.value = res.list.map(o => {
      // 转换优惠券状态
      o.statusText = formatStatus(o)
      return o
    })
    total.value = res.totalCount
  },
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
  update: updateCoupon,
  create: createCoupon,
  beforeSubmit: (form) => {
    if (typeof form.start_time !== 'number') {
      form.start_time = (new Date(form.start_time)).getTime()
    }
    if (typeof form.end_time !== 'number') {
      form.end_time = (new Date(form.end_time)).getTime()
    }
    return form
  },
  form: {
    name: '',
    type: 0,
    value: 0,
    total: 100,
    start_time: null,
    end_time: null,
    order: 50,
  },
  rules: {
    name: [{
      required: true,
      message: '优惠券名称不能为空',
      trigger: 'blur'
    }]
  }
})

// 状态判断转换
const formatStatus = (row) => {
  let s = '领取中'
  let start_time = new Date(row.start_time).getTime()
  let now_time = new Date().getTime()
  let end_time = new Date(row.end_time).getTime()
  if (start_time > now_time) {
    s = '未开始'
  } else if (end_time < now_time) {
    s = '已结束'
  } else if (row.status === 0) {
    s = '已失效'
  }
  return s
}

// 字符串和数组相互转换
const timerange = computed({
  get() {
    return form.start_time && form.end_time ? [form.start_time, form.end_time] : []
  },
  set(val) {
    form.start_time = val[0]
    form.end_time = val[1]
  }
})
getData()
</script>

<style scoped>
.active {
  @apply border-rose-200 bg-rose-50 text-red-500;
}

.inactive {
  @apply border-gray-200 bg-gray-50 text-gray-400;
}
</style>