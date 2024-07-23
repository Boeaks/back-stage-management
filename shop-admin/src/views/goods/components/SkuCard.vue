<template>
  <div>
    <el-form-item label="规格选项" v-loading="sortLoading">
      <el-card shadow="never" class="w-[90%] mb-3" v-for="(item, index) in sku_card_list" :key="index"
        v-loading="item.loading">
        <template #header>
          <div class="flex items-center">
            <el-input style="width: 200px;" placeholder="规格名称" v-model="item.text" @change="handleUpdate(item)">
              <template #append><el-icon @click="handleChooseSku(item)" class="w-[40px] cursor-pointer">
                  <more />
                </el-icon></template>
            </el-input>
            <el-button size="small" class="ml-auto" @click="sortCard('up', index)" :disabled="index === 0"><el-icon>
                <Top />
              </el-icon>
            </el-button>
            <el-button size="small" @click="sortCard('down', index)"
              :disabled="index === sku_card_list.length - 1"><el-icon>
                <Bottom />
              </el-icon>
            </el-button>
            <el-button size="small" @click="handleDelete(item)" :loading="item.loading"><el-icon>
                <Delete />
              </el-icon>
            </el-button>
          </div>
        </template>
        <!-- card body -->
        <skus-card-item :skuCardId="item.id"></skus-card-item>
      </el-card>
      <el-button type="success" size="small" :loading="btnLoading" @click="createGoodsSkuCard">添加规格</el-button>

    </el-form-item>

    <choose-sku ref="chooseSkuRef"></choose-sku>
  </div>
</template>

<script setup>
import SkusCardItem from '@/views/goods/components/SkuCardItem.vue'
import ChooseSku from '@/components/ChooseSku.vue'
import { sku_card_list, btnLoading, createGoodsSkuCard, handleUpdate, handleDelete, sortCard, sortLoading, handleChooseSetGoodsSkusCard } from '@/composables/useSku';
import { ref } from 'vue';

const chooseSkuRef = ref(null)
const handleChooseSku = (item) => {
  chooseSkuRef.value.open((value) => {
    console.log(value);
    handleChooseSetGoodsSkusCard(item.id, {
      name: value.name,
      value: value.list
    })
  })
}
</script>

<style>
.el-card__header {
  @apply !p-2 bg-gray-50;
}
</style>