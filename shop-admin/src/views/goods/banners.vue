<!-- 修改轮播图组件 -->
<template>
  <el-drawer title="设置轮播图" v-model="dialogVisible" size="40%" :destroy-on-close="true">
    <el-form :model="form" label-width="80px">
      <el-form-item label="轮播图">
        <choose-image v-model="form.banners" :limit="9"></choose-image>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
      </el-form-item>
    </el-form>

  </el-drawer>

</template>

<script setup>
import { reactive, ref } from "vue";
import { readGoods, setGoodsBanner } from "@/api/goods";
import ChooseImage from '@/components/ChooseImage.vue';
import { tips } from "@/composables/util";

const dialogVisible = ref(false)
const form = reactive({
  banners: []
})

const goodsId = ref(0)
const open = (row) => {
  goodsId.value = row.id
  row.bannersLoading = true
  readGoods(goodsId.value).then(res => {
    form.banners = res.goodsBanner.map(o => o.url)
    dialogVisible.value = true
  }).finally(() => {
    row.bannersLoading = false
  })

}

const loading = ref(false)
const emit = defineEmits(['refresh'])
const submit = (row) => {
  loading.value = true
  setGoodsBanner(goodsId.value, form).then(res => {
    tips('设置轮播图成功')
    dialogVisible.value = false
    emit('refresh')
  }).finally(() => {
    loading.value = false
  })
}

defineExpose({
  open
})
</script>

<style></style>