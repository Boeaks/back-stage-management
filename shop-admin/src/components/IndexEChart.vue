<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <div class="flex justify-between">
          <h5>订单统计</h5>
          <div>
            <el-check-tag v-for="(item, index) in options" :key="index" :checked="current === item.value"
              @click="handleChoose(item.value)" style="margin-right: 8px;">
              {{ item.text }}
            </el-check-tag>
          </div>
        </div>
      </template>
      <!-- card body -->
      <div ref="el" id="chart" style="width: 100%; height: 300px"></div>
    </el-card>

  </div>
</template>

<script setup>
import { getStatistucs3 } from '@/api/index.js'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts';
import { useResizeObserver } from '@vueuse/core'

const current = ref('week')
const options = [{
  text: '近1个月',
  value: "month"
}, {
  text: "近1周",
  value: "week"
}, {
  text: "近24小时",
  value: "hour"
}]

const handleChoose = (value) => {
  current.value = value
  getData(current.value)
}

var myChart = null
// 挂载后才能拿到 DOM 元素
onMounted(() => {
  // 拿到图表显示区域
  var chartDom = document.getElementById('chart');
  // 创建图表实例对象
  if (chartDom) {
    myChart = echarts.init(chartDom);
    getData()
  }
})

// 参数配置
function getData() {
  let option = {
    xAxis: { type: 'category', data: [] },
    yAxis: { type: 'value' },
    series: [{ data: [], type: 'bar' }]
  };

  // 过渡动画
  myChart.showLoading()
  // 数据请求
  getStatistucs3(current.value).then((res) => {
    option.xAxis.data = res.x
    option.series[0].data = res.y
    // 渲染图标
    myChart.setOption(option);
  }).finally(() => {
    myChart.hideLoading()
  })
}

// 图标节点 ref='el'
const el = ref(null)
// 监听窗口变化
useResizeObserver(el, (entries) => myChart && myChart.resize(el))

// 销毁图表
onBeforeUnmount(() => {
  if (myChart) echarts.dispose(myChart)
})

</script>

<style></style>