<template>
  <form-drawer title="推荐商品" ref="formDrawerRef" size="50%" closeOnClickModal :classCenter="true" @submit="onSubmit"
    confirmText="关联">
    <el-table :data="form" border stripe style="width: 90%;">
      <el-table-column prop="goods_id" label="ID" width="60" align="center" />
      <el-table-column label="商品封面" width="180" align="center">
        <template #default="{ row }">
          <el-image :src="row.cover" fit="fill" style="width: 64px; height: 64px"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" width="180" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button text type="primary" size="small" @click="handleDelete(row)" :loading="row.loading">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </form-drawer>
  <!-- 关联 -->
  <choose-goods ref="chooseGoodsRef"></choose-goods>
</template>

<script setup>
import FormDrawer from '@/components/FormDrawer.vue'
import { getCategoryGoods, deleteCategoryGoods, connectCatrgoryGoods } from '@/api/category';
import { ref } from 'vue'
import { tips } from '@/composables/util';
import ChooseGoods from '@/components/ChooseGoods.vue'

const formDrawerRef = ref(null)
const form = ref([])
const category_id = ref(0)

const open = (data) => {
  category_id.value = data.id
  data.btnLoading = true
  getData().then(() => {
    formDrawerRef.value.open()
  }).finally(() => {
    data.btnLoading = false
  })

}
const handleDelete = (row) => {
  row.loading = true
  deleteCategoryGoods(row.id).then(() => {
    tips('删除成功')
    getData()
  }).finally(() => {
    row.loading = false
  })
}

// 关联
const chooseGoodsRef = ref(null)
const onSubmit = () => {
  formDrawerRef.value.showLoading()
  chooseGoodsRef.value.open((goods_ids) => {
    connectCatrgoryGoods({ category_id: category_id.value, goods_ids }).then((res) => {
      getData()
      tips('关联成功')
    }).finally(() => {
      formDrawerRef.value.hidenLoading()
    })
  })
}
async function getData() {
  const res = await getCategoryGoods(category_id.value);
  return form.value = res.map(v => {
    v.loading = false
    return v
  });
}
defineExpose({
  open
})
</script>

<style></style>