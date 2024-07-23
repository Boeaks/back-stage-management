<template>
  <div>
    <el-row :gutter="20" v-permission="['getStatistics1,GET']">
      <template v-if="panels.length == 0">
        <el-col :span="6" :offset="0" v-for="i in 4" :key="i">
          <el-skeleton style="width: 100%;" animated loading>
            <template #template>
              <el-card shadow="hover" class="border-0">
                <template #header>
                  <div class="flex justify-between">
                    <el-skeleton-item variant="text" style="width: 50%;"></el-skeleton-item>
                    <el-skeleton-item variant="text" style="width: 20%;"></el-skeleton-item>
                  </div>
                </template>
                <!-- card body -->
                <span class="text-3xl font-bold text-gray-500">
                  <el-skeleton-item variant="h3" style="width: 80%;"></el-skeleton-item>
                </span>
                <el-divider />
                <div class="flex justify-between text-sm text-gray-500">
                  <el-skeleton-item variant="text" style="width: 50%;"></el-skeleton-item>
                  <el-skeleton-item variant="text" style="width: 20%;"></el-skeleton-item>
                </div>
              </el-card>
            </template>
          </el-skeleton>
        </el-col>
      </template>
      <el-col :span="6" :offset="0" v-for="(item, index) in panels" :key="index">
        <el-card shadow="hover" class="border-0">
          <template #header>
            <div class="flex justify-between">
              <span class="text-sm">{{ item.title }}</span>
              <el-tag :type="item.unitColor || 'primary'" effect="plain">
                {{ item.unit }}
              </el-tag>
            </div>
          </template>
          <!-- card body -->
          <span class="text-3xl font-bold text-gray-500">
            <count-to :value="item.value" :tag="item.value % 1 !== 0 ? true : false"></count-to>
          </span>
          <el-divider />
          <div class="flex justify-between text-sm text-gray-500">
            <span>{{ item.subTitle }}</span>
            <span>{{ item.subValue }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <index-navs />

    <el-row :gutter="20" class="mt-5">
      <el-col :span="12" :offset="0">
        <index-chart v-permission="['getStatistics3,GET']"></index-chart>
      </el-col>
      <el-col :span="12" :offset="0" v-permission="['getStatistics2,GET']">
        <index-card title=" 店铺及商品提示" tip="店铺及商品展示" :btns="goods" class="mb-3"></index-card>
        <index-card title="交易提示" tip="需要立即处理的交易订单" :btns="order"></index-card>
      </el-col>
    </el-row>


  </div>
</template>

<script setup>
import { getStatistucs1, getStatistucs2 } from '@/api';
import CountTo from '@/components/CountTo.vue'
import IndexChart from '@/components/IndexEChart.vue';
import IndexNavs from '@/components/IndexNavs.vue'
import IndexCard from '@/components/IndexCard.vue'

import { ref } from 'vue'

const panels = ref([])
getStatistucs1().then((res) => {
  panels.value = res.panels;
})

const goods = ref([])
const order = ref([])
const getCardData = () => {
  getStatistucs2().then(res => {
    if (!res) return;
    goods.value = res.goods
    order.value = res.order
  })
}

getCardData()


</script>

<style></style>