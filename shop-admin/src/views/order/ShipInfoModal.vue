<template>
  <el-drawer title="物流信息" v-model="dialogVisible" size="40%" :destroy-on-close="true" close-on-click-modal>
    <el-card shadow="never" class="border-0 mb-3">
      <!-- card body -->
      <div class="flex items-center">
        <el-image :src="info.logo" fit="fill" :lazy="true" style="width: 60px; height: 60px;"
          class="border rounded mr-3"></el-image>
        <div>
          <p>物流公司：{{ info.typename }}</p>
          <p>物流单号：{{ info.number }}</p>
        </div>
      </div>
    </el-card>
    <el-card shadow="never" class="border-0 border-t">
      <el-timeline class="ml-[-40px]">
        <el-timeline-item v-for="(item, index) in info.list" :key="index" :timestamp="item.time" placement="top"
          type="primary" size="normal">
          <!-- content -->
          {{ item.status }}
        </el-timeline-item>
      </el-timeline>

    </el-card>


  </el-drawer>

</template>

<script setup>
import { getShipInfo } from "@/api/order";
import { toast } from "@/composables/util";
import { computed, ref } from "vue";

const info = ref([])
const dialogVisible = ref(null)
const open = async (id) => {
  const res = await getShipInfo(id).then((res) => {
    if (res.status !== 0) {
      return toast(res.msg, 'error')
    }
    info.value = res.result
    dialogVisible.value = true;
  });


}
const close = () => {
  dialogVisible.value = false
}

defineExpose({
  open
})

</script>

<style></style>