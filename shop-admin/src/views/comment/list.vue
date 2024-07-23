<template>
  <el-card shadow="never" class="border-0">
    <template #header>
      <!-- 搜索 -->
      <!-- 表单组件 -->
      <search @search="getData" @reset="resetSearchForm" :model="searchForm">
        <!-- 表单项组件 -->
        <search-item label="关键词">
          <el-input v-model="searchForm.title" placeholder="商品标题" clearable></el-input>
        </search-item>
      </search>
    </template>
    <!-- card body -->
    <el-table :data="tableData" stripe style="width: 100%;" v-loading="loading" default-expand-all>
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="flex px-18">
            <el-avatar :size="50" shape="circle" :src="row.user.avatar ? row.user.avatar : ''" fit="fill"></el-avatar>
            <div class="flex-1 ml-4">
              <h6 class="flex items-center">
                {{ row.user.nickname || row.user.username }}
                <small class="text-gray-400 ml-2">{{
                  row.review_time }}</small>
                <el-button size="small" class="ml-auto" @click="openTextarea(row)"
                  v-if="!row.textareaEdit && !row.extra">回复</el-button>
              </h6>
              {{ row.review.data }}
              <div class="py-2">
                <el-image v-for="(item, index) in row.review.image" class="rounded" :key="index"
                  style="width: 100px; height: 100px;" :src="item" fit="fill" :lazy="true"></el-image>
              </div>
              <template v-if="!row.textareaEdit">
                <div class="mt-3 bg-gray-100 p-3 rounded" v-for="(item, index) in row.extra" :key="index">
                  <h6 class="flex font-bold">客服
                    <el-button type="info" size="small" @click="commentEdit(row, item.data)"
                      class="ml-auto">修改</el-button>
                  </h6>
                  <p>{{ item.data }}</p>
                </div>
              </template>
              <div v-else>
                <el-input v-model="textarea" placeholder="请输入评论内容" type="textarea" :rows="2"></el-input>
                <div class="py-2">
                  <el-button type="primary" size="small" @click="review(row)">回复</el-button>
                  <el-button size="small" @click="row.textareaEdit = false">取消</el-button>
                </div>

              </div>
            </div>

          </div>
        </template>
      </el-table-column>
      <el-table-column label="ID" width="70" align="center" prop="id" />
      <el-table-column label="商品">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-image :src="row.goods_item ? row.goods_item.cover : ''" fit="fill" :lazy="true"
              style="width: 50px; height: 50px;" class="rounded"></el-image>
            <div class="ml-3">
              <h6>{{ row.goods_item?.title ?? '商品已被删除' }}</h6>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="评价信息" width="200">
        <template #default="{ row }">
          <div>
            <p>用户： {{ row.user.nickname || row.user.username }}</p>
            <p>
              <el-rate v-model="row.rating" disabled text-color="#ff9900"></el-rate>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="评价时间" prop="review_time" align="center"></el-table-column>
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-switch :model-value="row.status" :active-value="1" :inactive-value="0"
            @change="handleChangeStatus($event, row)" :loading="row.statusLoading" :disabled="row.super === 1">
          </el-switch>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex items-center justify-center mt-5">
      <el-pagination @current-change="getData" :current-page="currentPage" :page-size="limit" layout=" prev,pager,next"
        :total="total" background>
      </el-pagination>
    </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';
import { getGoodsCommentList, updateGoodsCommentStatus, reviewGoodsComment } from '@/api/goods_comment.js';
import { useInitTable } from '@/composables/useCommon.js'
import Search from '@/components/Search.vue';
import SearchItem from '@/components/SearchItem.vue';
import { tips, toast } from '@/composables/util';
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
    title: ''
  },
  getList: getGoodsCommentList,
  updateStatus: updateGoodsCommentStatus,
  onGetListSuccess: (res) => {
    tableData.value = res.list.map(o => {
      o.statusLoading = false
      o.textareaEdit = false
      return o
    })
    roles.value = res.roles
    total.value = res.totalCount
  }
})

const textarea = ref("")

const openTextarea = (item) => {
  textarea.value = ""
  item.textareaEdit = true
}

// 修改评论
const commentEdit = (row, v) => {
  textarea.value = v
  row.textareaEdit = true
}
const review = (row) => {
  if (textarea.value === '') toast('回复内容不能为空', 'error')
  reviewGoodsComment(row.id, textarea.value).then(() => {
    row.textareaEdit = false
    tips('回复成功')
    getData()
  })

}
</script>

<style></style>