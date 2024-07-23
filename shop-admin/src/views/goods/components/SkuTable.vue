<template>

  <el-form-item label="规格设置">
    <table class="border">
      <thead>
        <tr>
          <th v-for="(item, index) in tableThs" :key="index" class="border" :style="{ width: item.width }"
            :colspan="item.colspan" :rowspan="item.rowspan">{{
              item.name }}</th>
        </tr>
        <tr>
          <th v-for="(item, index) in skuLabels" :key="index">{{ item.name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in sku_list" :key="index">
          <td class="border text-center" width="100" v-for="(item2, index2) in item.skus" :key="index2">{{ item2.value
            }}
          </td>
          <td class="border"><el-input type="number" size="small" v-model="item.pprice" /></td>
          <td class="border"><el-input type="number" size="small" v-model="item.oprice" /></td>
          <td class="border"><el-input type="number" size="small" v-model="item.cprice" /></td>
          <td class="border"><el-input type="number" size="small" v-model="item.stock" /></td>
          <td class="border"><el-input type="number" size="small" v-model="item.volume" /></td>
          <td class="border"><el-input type="number" size="small" v-model="item.weight" /></td>
          <td class="border"><el-input size="small" v-model="item.code" /></td>
        </tr>
      </tbody>
    </table>
  </el-form-item>


</template>

<script setup>
import { initSkuTable } from '@/composables/useSku';

const {
  skuLabels,
  tableThs,
  sku_list
} = initSkuTable()
</script>

<style></style>