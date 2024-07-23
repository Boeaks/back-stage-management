<template>
  <div class="flex justify-between items-center" :class="{ 'mb-3': classStatus }">
    <div>
      <el-button v-if="btns.includes('create')" type="primary" size="small" @click="$emit('create')">新增</el-button>
      <el-popconfirm title="是否要删除该规格？" confirmButtonText="确认" cancelButtonText="取消" width="180px"
        @confirm="$emit('delete')">
        <template #reference><el-button v-if="btns.includes('delete')" type="danger" size="small">
            批量删除</el-button></template>
      </el-popconfirm>
      <slot />
    </div>
    <div>
      <el-tooltip v-if="btns.includes('download')" content="导出数据" placement="top" effect="dark">
        <el-button text @click="$emit('download')" size="small">
          <el-icon :size="15">
            <Download />
          </el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip v-if="btns.includes('refresh')" content="刷新数据" placement="top" effect="dark">
        <el-button text @click="$emit('refresh')" size="small">
          <el-icon :size="15">
            <Refresh></Refresh>
          </el-icon>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

defineEmits(['create', 'refresh', 'delete', 'download'])
const props = defineProps({
  classStatus: {
    type: Boolean,
    default: true
  },
  layout: {
    type: String,
    default: 'create,refresh'
  }
})

const btns = computed(() => props.layout.split(','))

</script>

<style></style>