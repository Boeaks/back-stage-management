<template>
    <FormDrawer ref="formDrawerRef" title="设置商品规格" @submit="submit" destroy-on-close
        :size="form.sku_type ? '70%' : '40%'">
        <el-form :model="form">
            <el-form-item label="规格类型">
                <el-radio-group v-model="form.sku_type">
                    <el-radio :value="0" border>单规格</el-radio>
                    <el-radio :value="1" border>多规格</el-radio>
                </el-radio-group>
            </el-form-item>
            <template v-if="form.sku_type === 0">
                <el-form-item label="市场价格">
                    <el-input v-model="form.sku_value.oprice" style="width:35%;">
                        <template #append>元</template></el-input>
                </el-form-item>
                <el-form-item label="销售价格">
                    <el-input v-model="form.sku_value.pprice" style="width:35%;">
                        <template #append>元</template></el-input>
                </el-form-item>
                <el-form-item label="成本价格">
                    <el-input v-model="form.sku_value.cprice" style="width:35%;">
                        <template #append>元</template></el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                    <el-input v-model="form.sku_value.weight" style="width:35%;">
                        <template #append>公斤</template></el-input>
                </el-form-item>
                <el-form-item label="商品体积">
                    <el-input v-model="form.sku_value.volume" style="width:35%;">
                        <template #append>立方米</template></el-input>
                </el-form-item>
            </template>
            <template v-else>
                <sku-card></sku-card>
                <sku-table></sku-table>
            </template>
        </el-form>
    </FormDrawer>
</template>
<script setup>
import { ref, reactive } from "vue"
import FormDrawer from "@/components/FormDrawer.vue";
import { tips } from "@/composables/util";
import SkuCard from "@/views/goods/components/SkuCard.vue";
import SkuTable from "@/views/goods/components/SkuTable.vue";
import {
    readGoods,
    updateGoodsSkus
} from "@/api/goods"
import { goodsId, initSkuCardList, sku_list } from "@/composables/useSku";

const formDrawerRef = ref(null)

const form = reactive({
    sku_type: 0,
    sku_value: {
        "oprice": 0,
        "pprice": 0,
        "cprice": 0,
        "weight": 0,
        "volume": 0
    }
})

const open = (row) => {
    goodsId.value = row.id
    row.skusLoading = true
    readGoods(goodsId.value).then(res => {
        form.sku_type = res.sku_type
        form.sku_value = res.sku_value || {
            oprice: 0,
            pprice: 0,
            cprice: 0,
            weight: 0,
            volume: 0
        }
        initSkuCardList(res)
        formDrawerRef.value.open()
    })
        .finally(() => {
            row.skusLoading = false
        })
}
const emit = defineEmits(["refresh"])

const submit = () => {
    formDrawerRef.value.showLoading()
    let data = {
        sku_type: form.sku_type,
        sku_value: form.sku_value
    }
    if (form.sku_type === 1) {
        data.goodsSkus = sku_list.value
    }
    updateGoodsSkus(goodsId.value, data)
        .then(res => {
            tips("设置商品规格成功")
            formDrawerRef.value.close()
            emit("refresh")
        })
        .finally(() => {
            formDrawerRef.value.hidenLoading()
        })
}

defineExpose({
    open
})
</script>
