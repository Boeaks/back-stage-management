<template>
  <div v-loading="loading" class="bg-white p-4 px-20 rounded">
    <el-form-item label="未支付订单">
      <div>
        <el-input v-model="form.close_order_minute" placeholder="未支付订单" type="number" style="width: 30%;">
          <template #append>
            分钟后自动关闭
          </template>
        </el-input>
        <small class="text-gray-500 flex mt-1">
          订单下单未付款，n分钟后自动关闭，设置0不自动关闭
        </small>
      </div>
    </el-form-item>
    <el-form-item label="已发货订单">
      <div>
        <el-input v-model="form.auto_received_day" placeholder="已发货订单" type="number" style="width: 30%;">
          <template #append>
            天后自动确认收货
          </template>
        </el-input>
        <small class="text-gray-500 flex mt-1">
          如果在期间未确认收货，系统自动完成收货，设置0不自动收货
        </small>
      </div>
    </el-form-item>
    <el-form-item label="已完成订单">
      <div>
        <el-input v-model="form.after_sale_day" placeholder="已完成订单" type="number" style="width: 30%;">
          <template #append>
            天内允许申请售后
          </template>
        </el-input>
        <small class="text-gray-500 flex mt-1">
          订单完成后 ，用户在n天内可以发起售后申请，设置0不允许申请售后
        </small>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" class=" float-right" @click="submit">保存</el-button>
    </el-form-item>
  </div>
</template>

<script setup>
import { getSysconfig, setSysconfig, uploadAction } from '@/api/sysconfig';
import { tips } from '@/composables/util';
import { reactive, ref } from 'vue';
import FormDrawer from '@/components/FormDrawer.vue';
import { getToken } from '@/composables/auth';

const token = getToken()
const loading = ref(false)
const activeName = ref("first")
const tableData = [{
  name: '支付宝',
  desc: "该系统支持即时到账",
  src: '/alipay.png',
  key: 'alipay'
}, {
  name: '微信',
  desc: "该系统支持即时到账",
  src: '/wepay.png',
  key: 'wepay'
}]

// 表单参数
const form = reactive({
  "close_order_minute": 30,
  "auto_received_day": 7,
  "after_sale_day": 23,
  "alipay": {
    "app_id": "",
    "ali_public_key": "",
    "private_key": ""
  },
  "wxpay": {
    "app_id": "",
    "miniapp_id": "",
    "secret": "",
    "appid": "",
    "mch_id": "",
    "key": "",
    "cert_client": "",
    "cert_key": ""
  },
  "ship": ""
})


const drawerType = ref('alipay')
const formDrawerRef = ref(null)
const open = (key) => {
  drawerType.value = key
  formDrawerRef.value.open()
}

// 文件上传
const uploadClientSuccess = (response, uploadFile, uploadFiles) => {
  form.wxpay.create_time = response.data
}
const uploadKeySuccess = (response, uploadFile, uploadFiles) => {
  form.wxpay.cert_key = response.data
}

const submit = () => {
  loading.value = true
  setSysconfig({
    ...form,
  }).then(res => {
    tips("修改成功")
    formDrawerRef.value.close()
  }).finally(() => {
    loading.value = false
  })
}
</script>

<style></style>