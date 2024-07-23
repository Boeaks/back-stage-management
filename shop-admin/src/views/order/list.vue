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
        <search-item label="关键词" :classStatus="false">
          <!-- 变动内容1-->
          <el-input v-model="searchForm.no" placeholder="订单编号" clearable></el-input>
        </search-item>
        <!-- 多个变动内容，就要用具名插槽了 -->
        <template #show>
          <!-- 表单项组件 -->
          <search-item label="收货人">
            <el-input v-model="searchForm.name" placeholder="收货人" clearable></el-input>
          </search-item>
          <search-item label="手机号">
            <el-input v-model="searchForm.phone" placeholder="手机号" clearable></el-input>
          </search-item>
          <search-item label="开始时间">
            <el-date-picker v-model="searchForm.starttime" type="date" value-format="YYYY-MM-DD" placeholder="选择开始日期"
              style="width:90%">
            </el-date-picker>
          </search-item>
          <search-item label="结束时间">
            <el-date-picker v-model="searchForm.endtime" type="date" value-format="YYYY-MM-DD" placeholder="选择结束日期"
              style="width:90%">
            </el-date-picker>
          </search-item>
        </template>
      </search>
      <!-- card body -->
      <!-- 新增 | 刷新 -->
      <list-header layout="refresh,download" @refresh="getData" @download="handleExportExcel">
        <el-button size="small" @click="handleMultiDelete" type="danger">批量删除</el-button>
      </list-header>
      <el-table ref="multipleTableRef" @selection-change="handleSelectionChange" :data="tableData" stripe
        style="width: 100%;" v-loading="loading">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="商品">
          <template #default="{ row }">
            <div class="flex text-sm">
              <div class="flex-1">
                <p>订单号</p>
                <small>{{ row.no }}</small>
              </div>
              <div>
                <p>下单时间</p>
                <small>{{ row.create_time }}</small>
              </div>
            </div>
            <div class="flex py-2" v-for="(item, index) in row.order_items" :key="index">
              <el-image :src="item.goods_item?.cover || ''" fit="cover" :lazy="true"
                class="w-[30px] h-[30px]"></el-image>
              <p class="text-blue-500 ml-2">{{ item.goods_item?.title ?? '商品已被删除' }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="实际付款" width="140" align="center" prop="total_price" />
        <el-table-column label="买家" width="140" align="center">
          <template #default="{ row }">
            <p>{{ row.user.nickname || row.user.username }}</p>
            <small>(用户ID：{{ row.user_id }})</small>
          </template>
        </el-table-column>
        <el-table-column label="交易状态" width="200">
          <template #default="{ row }">
            <div>
              付款方式：
              <el-tag v-if="row.payment_method === 'wechat'" type="success" size="small">微信支付</el-tag>
              <el-tag v-else-if="row.payment_method === 'alipay'" type="primary" size="small">支付宝支付</el-tag>
              <el-tag v-else size="small" type="info">未支付</el-tag>
            </div>
            <div>
              付款状态：
              <el-tag :type="row.ship_data ? 'success' : 'info'" size="small">{{ row.ship_data ? '已发货' :
                '未发货' }}</el-tag>
            </div>
            <div>
              收货状态：
              <el-tag :type="row.received ? 'success' : 'info'" size="small">{{ row.ship_data ? '已收货' :
                '未收货' }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template #default="scope">
            <div>
              <el-button type="primary" class="px-1" size="small" text @click="orderDetail(scope.row)"
                :loading="scope.row.contentLoading">订单详情</el-button>
              <el-button v-if="searchForm.tab === 'noship'" type="primary" class="px-1" size="small" text
                @click="handleSetGoodsContent(scope.row)" :loading="scope.row.contentLoading">订单发货</el-button>
              <el-button v-if="searchForm.tab === 'refunding'" type="primary" class="px-1" size="small" text
                @click="handleRefund(scope.row.id, 1)" :loading="scope.row.contentLoading">同意退款</el-button>
              <el-button v-if="searchForm.tab === 'refunding'" type="primary" class="px-1" size="small" text
                @click="handleRefund(scope.row.id, 0)" :loading="scope.row.contentLoading">拒绝退款</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex items-center justify-center mt-5">
        <el-pagination @current-change="getData" :current-page="currentPage" :page-size="limit"
          layout=" prev,pager,next" :total="total" background>
        </el-pagination>
      </div>
    </el-card>
    <export-excel ref="ExportExcelRef" :tabs="tabbars"></export-excel>
    <info-modal ref="infoModalRef" :info="info"></info-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getOrderList, deleteOrder, refunOrder } from '@/api/order.js';
import ListHeader from '@/components/LisrHeader.vue'
import { useInitTable } from '@/composables/useCommon.js'
import Search from '@/components/Search.vue';
import SearchItem from '@/components/SearchItem.vue';
import InfoModal from '@/views/order/InfoModal.vue'
import { tips, showPrompt, showModal } from '@/composables/util';
import ExportExcel from '@/views/order/ExportExcel.vue'

// tabs
const tabbars = [{
  key: "all",
  name: "全部"
}, {
  key: "nopay",
  name: "待支付"
}, {
  key: "noship",
  name: "待发货"
}, {
  key: "shiped",
  name: "待收货"
}, {
  key: "received",
  name: "已收货"
}, {
  key: "closed",
  name: "已关闭"
}, {
  key: "refunding",
  name: "退款中"
}, {
  key: "finish",
  name: "已完成"
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
  getData,
  handleSelectionChange,
  handleMultiDelete
} = useInitTable({
  searchForm: {
    no: '',
    tab: 'all',
    starttime: "",
    endtime: "",
    name: "",
    phone: ""
  },
  getList: getOrderList,
  delete: deleteOrder,
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

const ExportExcelRef = ref(null)
const handleExportExcel = () => {
  ExportExcelRef.value.open()
}

// 往子组件传值
const info = ref(null)
const infoModalRef = ref(null)
const orderDetail = (item) => {
  item.order_items = item.order_items.map(o => {
    if (o.skus_type == 1 && o.goods_skus) {
      let s = []
      for (const key in o.goods_skus.skus) {
        s.push(o.goods_skus.skus[key].value)
      }
      o.skus = s.join(',')
    }
    return o
  })
  info.value = item
  infoModalRef.value.open()
}

// 退款处理
const handleRefund = ((id, agree) => {
  (agree ? showModal('是否同意该订单退款？') : showPrompt("请输入拒绝的理由")).then((v) => {
    let data = { agree }
    if (!agree) {
      data.disagree_reason = v
    }
    refunOrder(id, data).then(() => {
      getData()
      tips('操作成功')
    })
  })
})
</script>

<style></style>