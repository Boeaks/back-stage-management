<template>
    <FormDrawer ref="formDrawerRef" title="设置商品详情" @submit="submit" destroy-on-close>
        <el-form :model="form">
            <el-form-item>
                <Editor v-model="form.content"/>
            </el-form-item>
        </el-form>
    </FormDrawer>
</template>
<script setup>
import { ref,reactive } from "vue"
import FormDrawer from "@/components/FormDrawer.vue";
import Editor from "@/components/Editor.vue"
import {
    readGoods,
    updateGoods
} from "@/api/goods"
import { tips } from "@/composables/util";

const formDrawerRef = ref(null)

const form = reactive({
    content:"",
})

const goodsId = ref(0)
const open = (row)=>{
    goodsId.value = row.id
    row.contentLoading = true
    readGoods(goodsId.value).then(res=>{
        form.content = res.content
        formDrawerRef.value.open()
    })
    .finally(()=>{
        row.contentLoading = false
    })
}
const emit = defineEmits(["refresh"])

const submit = ()=>{
    formDrawerRef.value.showLoading()
    updateGoods(goodsId.value,form)
    .then(res=>{
        tips("设置商品详情成功")
        formDrawerRef.value.close()
        emit("refresh")
    })
    .finally(()=>{
        formDrawerRef.value.hidenLoading()
    })
}

defineExpose({
    open
})
</script>
