<template>
    <div v-loading="loading" class="bg-white pt-8 p-4 px-20 rounded">
        <el-form :model="form" label-width="160px">
            <el-form-item label="物流查询key">
                <div>
                    <el-input v-model="form.ship" placeholder="物流查询key" style="width: 50%;"></el-input>
                    <small class="text-gray-500 flex mt-1">
                        用于查询物流信息，接口申请（仅供参考）
                    </small>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button class="float-right" type="primary" size="default" @click="submit">保存</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>
<script setup>
import { ref, reactive } from "vue"
import { getSysconfig, setSysconfig } from "@/api/sysconfig"
import { tips } from "@/composables/util";

const form = reactive({
    "ship": ""
})

const loading = ref(false)
function getData() {
    loading.value = true
    getSysconfig().then(res => {
        for (const k in form) {
            form[k] = res[k]
        }
        form.password_encrypt = form.password_encrypt.split(",")
    }).finally(() => {
        loading.value = false
    })
}

getData()

const submit = () => {
    loading.value = true
    setSysconfig({
        ...form,
    }).then(res => {
        tips("修改成功")
        getData()
    }).finally(() => {
        loading.value = false
    })
}
</script>