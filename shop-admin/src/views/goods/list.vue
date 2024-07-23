<template>
  <div>
    <el-tabs v-model="searchForm.tab" @tab-change="getData">
      <el-tab-pane v-for="(item, index) in tabbars" :key="index" :label="item.name" :name="item.key"></el-tab-pane>
    </el-tabs>

    <el-card shadow="never" class="border-0">
      <!-- 搜索 -->
      <!-- 表单组件 -->
      <search @search="getData" @reset="resetSearchForm" :model="searchForm">
        <!-- 表单项组件 -->
        <search-item label="关键词">
          <!-- 变动内容1-->
          <el-input v-model="searchForm.title" placeholder="商品名称" clearable></el-input>
        </search-item>
        <!-- 多个变动内容，就要用具名插槽了 -->
        <template #show>
          <!-- 表单项组件 -->
          <search-item label="商品分类">
            <!-- 变动内容2 -->
            <el-select v-model="searchForm.category_id" placeholder="请选择商品分类" clearable>
              <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </search-item>
        </template>
      </search>
      <!-- card body -->
      <!-- 新增 | 刷新 -->
      <list-header layout="create,refresh" @refresh="getData" @create="handleCreate">
        <el-button size="small" @click="handleMultiDelete" type="danger"
          v-if="searchForm.tab !== 'delete'">批量删除</el-button>
        <el-button size="small" @click="handleRestoreGoods" type="warning" v-else>恢复商品</el-button>

        <el-popconfirm title="是否彻底删除该商品？" width="180px" confirmButtonText="确认" cancelButtonText="取消"
          confirmButtonType="danger" cancelButtonType="text" icon="el-icon-question" iconColor="#f90" hideIcon="false"
          @confirm="handleMultiDestory">
          <template #reference><el-button size="small" v-if="searchForm.tab === 'delete'">彻底删除</el-button></template>
        </el-popconfirm>

        <el-button size="small" @click="handleMultiStatusChange(1)"
          v-if="searchForm.tab === 'all' || searchForm.tab === 'off'">上架</el-button>
        <el-button size="small" @click="handleMultiStatusChange(0)"
          v-if="searchForm.tab === 'all' || searchForm.tab === 'saling'">下架</el-button>
      </list-header>
      <el-table ref="multipleTableRef" @selection-change="handleSelectionChange" :data="tableData" stripe
        style="width: 100%;" v-loading="loading">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="商品" width="300">
          <template #default="{ row }">
            <div class="flex items-center">
              <el-image :src="row.cover" fit="cover" :lazy="true" style="width: 50px; height: 50px;"
                class="mr-3 rounded"></el-image>
              <div class="flex-1">
                <p>{{ row.title }}</p>
                <div>
                  <span class="text-rose-500">￥{{ row.min_price }}</span>
                  <el-divider direction="vertical" content-position="center"></el-divider>
                  <span class="text-gray-500 text-xs">￥{{ row.min_oprice }}</span>
                </div>
                <p class="text-gray-400 text-xs mb-1">分类：{{ row.category ? row.category.name : '未分类' }}</p>
                <p class="text-gray-400 text-xs">创建时间：{{ row.create_time }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="实际销量" align="center" prop="sale_count" />
        <el-table-column label="商品状态" width="100px">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'" size="small">{{ row.status ? '上架' : '仓库' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="120px" align="center" v-if="searchForm.tab !== 'delete'">
          <template #default="{ row }">
            <div v-if="row.ischeck === 0" class="flex flex-col">
              <el-button type="success" size="small" plain>审核通过</el-button>
              <el-button type="danger" size="small" plain class="mt-2 !ml-0">审核拒绝</el-button>
            </div>
            <span v-else>{{ row.ischeck === 1 ? '通过' : '拒绝' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总库存" align="center" width="90px" prop="stock" />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <div v-if="searchForm.tab !== 'delete'">
              <el-button class="px-1" type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
              <el-button class="px-1"
                :type="(scope.row.sku_type === 1 && !scope.row.goods_skus.length) || (scope.row.sku_type === 0 && !scope.row.sku_value) ? 'danger' : 'primary'"
                size="small" text @click="handleSetGoodsSkus(scope.row)"
                :loading="scope.row.skusLoading">商品规格</el-button>
              <el-button class="px-1" :type="scope.row.goods_banner.length !== 0 ? 'primary' : 'danger'" size="small"
                text @click="handleSetGoodsBanner(scope.row)" :loading="scope.row.bannersLoading">设置轮播图</el-button>
              <el-button class="px-1" size="small" text :type="scope.row.content ? 'primary' : 'danger'"
                @click="handleSetGoodsContent(scope.row)" :loading="scope.row.contentLoading">商品详情</el-button>
              <el-popconfirm title="是否要删除该商品？" confirmButtonText="确认" cancelButtonText="取消" width="180px"
                @confirm="handleDelete([scope.row.id])">
                <template #reference><el-button text class="px-1" type="primary" size="small">删除</el-button></template>
              </el-popconfirm>
            </div>
            <span v-else>暂无操作</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex items-center justify-center mt-5">
        <el-pagination @current-change="getData" :current-page="currentPage" :page-size="limit"
          layout=" prev,pager,next" :total="total" background>
        </el-pagination>
      </div>

      <form-drawer ref="formDrawerRef" :title="noticeType" @submit="handleSubmit">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" :inline="false" class="w-[80%]">
          <el-form-item label="商品名称" prop="title">
            <el-input v-model="form.title" placeholder="请输入商品名称，不能超过60个字符"></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="cover">
            <choose-image v-model="form.cover"></choose-image>
          </el-form-item>
          <el-form-item label="商品分类" prop="category_id">
            <el-select v-model="form.category_id" placeholder="选择所属商品分类">
              <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品描述" prop="desc">
            <el-input type="textarea" v-model="form.desc" placeholder="选填，商品卖点"></el-input>
          </el-form-item>
          <el-form-item label="单位" prop="unit">
            <el-input v-model="form.unit" placeholder="请输入单位" style="width: 50%;"></el-input>
          </el-form-item>
          <el-form-item label="总库存" prop="stock">
            <el-input v-model="form.stock" style="width: 50%;">
              <template #append>件</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存预警" prop="min_stock">
            <el-input v-model="form.min_stock" style="width: 50%;">
              <template #append>件</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低销售价" prop="min_price">
            <el-input v-model="form.min_price" style="width: 50%;">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低原价" prop="min_oprice">
            <el-input v-model="form.min_oprice" style="width: 50%;">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存显示" prop="stock_display">
            <el-radio-group v-model="form.stock_display">
              <el-radio :value="0">隐藏</el-radio>
              <el-radio :value="1">显示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否上架" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :value="0">放入仓库</el-radio>
              <el-radio :value="1">立即上架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </form-drawer>
    </el-card>
    <!-- 轮播图设置 -->
    <banners ref="bannersRef" @refresh="getData"></banners>
    <content ref="contentRef" @refresh="getData"></content>
    <skus ref="skusRef" @refresh="getData"></skus>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getGoodsList, updateGoodsStatus, createGoods, updateGoods, deleteGoods, restoreGoods, destoryGoods } from '@/api/goods.js';
import { getCategoryList } from '@/api/category.js';
import FormDrawer from '@/components/FormDrawer.vue';
import ListHeader from '@/components/LisrHeader.vue'
import ChooseImage from '@/components/ChooseImage.vue';
import { useInitTable, useInitForm } from '@/composables/useCommon.js'
import Search from '@/components/Search.vue';
import SearchItem from '@/components/SearchItem.vue';
import banners from '@/views/goods/banners.vue';
import content from '@/views/goods/contents.vue'
import skus from '@/views/goods/skus.vue'
import { tips } from '@/composables/util';

// tabs
const tabbars = [{
  key: "all",
  name: "全部"
}, {
  key: "checking",
  name: "审核中"
}, {
  key: "saling",
  name: "出售中"
}, {
  key: "off",
  name: "已下架"
}, {
  key: "min_stock",
  name: "库存预警"
}, {
  key: "delete",
  name: "回收站"
}]
const {
  searchForm,
  tableData,
  total,
  loading,
  limit,
  currentPage,
  multipleTableRef,
  multSelectionIds,
  resetSearchForm,
  handleMultiStatusChange,
  handleDelete,
  getData,
  handleSelectionChange,
  handleMultiDelete
} = useInitTable({
  searchForm: {
    title: '',
    tab: 'all',
    category_id: null
  },
  getList: getGoodsList,
  updateStatus: updateGoodsStatus,
  delete: deleteGoods,
  onGetListSuccess: (res) => {
    tableData.value = res.list.map(o => {
      o.bannersLoading = false
      o.contentLoading = false
      o.skusLoading = false
      return o
    })
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
  update: updateGoods,
  create: createGoods,
  form: {
    title: null,
    category_id: null,
    cover: null,
    desc: null,
    unit: '件',
    stock: 100,
    min_stock: 10,
    status: 1,
    stock_display: 1,
    min_price: 0,
    min_oprice: 0
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

// 商品分类
const category_list = ref([])
getCategoryList().then((res) => category_list.value = res)

// 设置轮播图
const bannersRef = ref(null)
const handleSetGoodsBanner = (row) => {
  bannersRef.value.open(row)
}

// 设置商品详情
const contentRef = ref(null)
const handleSetGoodsContent = (row) => {
  contentRef.value.open(row)
}

// 设置商品规格
const skusRef = ref(null)
const handleSetGoodsSkus = (row) => {
  skusRef.value.open(row)
}

// 批量恢复
const handleRestoreGoods = () => {
  useMultiAction(restoreGoods, '恢复')
}

// 彻底删除
const handleMultiDestory = () => {
  useMultiAction(destoryGoods, '删除')
}

function useMultiAction(func, msg) {
  loading.value = true
  console.log(multSelectionIds.value);
  func(multSelectionIds.value).then(() => {
    tips(msg + '成功')
    if (multipleTableRef) {
      multipleTableRef.value.clearSelection()
    }
    getData()
  }).finally(() => {
    loading.value = false
  })
}
</script>

<style></style>