<template>
  <div v-loading="loading" class="bg-white p-4 rounded">
    <el-form :model="form" label-width="160px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="注册与访问" name="first">
          <el-form-item label="是否允许注册会员">
            <el-radio-group v-model="form.open_reg">
              <el-radio :value="0" border>关闭</el-radio>
              <el-radio :value="1" border>开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="注册类型">
            <el-radio-group v-model="form.reg_method">
              <el-radio value="username" border>普通注册</el-radio>
              <el-radio value="phone" border>手机注册</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="密码最小长度">
            <el-input v-model="form.password_min" placeholder="密码最小长度" type="number" style="width: 30%;"
              clearable></el-input>
          </el-form-item>
          <el-form-item label="强制密码复杂度">
            <el-checkbox-group v-model="form.password_encrypt">
              <el-checkbox value="0" border>数字</el-checkbox>
              <el-checkbox value="1" border>小写字母</el-checkbox>
              <el-checkbox value="2" border>大写字母</el-checkbox>
              <el-checkbox value="3" border>符号</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="上传设置" name="second">
          <el-form-item label="默认上传方式">
            <el-radio-group v-model="form.upload_method">
              <el-radio value="oss" border>对象存储</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Bucket">
            <el-input v-model="form.upload_config.Bucket" placeholder="Bucket" style="width: 30%;" clearable></el-input>
          </el-form-item>
          <el-form-item label="ACCESS_KEY">
            <el-input v-model="form.upload_config.ACCESS_KEY" placeholder="ACCESS_KEY" type="password"
              style="width: 30%;" clearable></el-input>
          </el-form-item>
          <el-form-item label="SECRET_KEY">
            <el-input v-model="form.upload_config.SECRET_KEY" placeholder="SECRET_KEY" type="password"
              style="width: 30%;" clearable></el-input>
          </el-form-item>
          <el-form-item label="空间域名" class="flex">
            <el-input v-model="form.upload_config.http" placeholder="空间域名" style="width: 30%;" clearable></el-input>
            <small class="ml-1 text-gray-500">请补全 http:// 或 https://</small>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="API 安全" name="third">
          <el-form-item label="是否开启 API 安全" class="flex">
            <el-radio-group v-model="form.api_safe">
              <el-radio value="0" border>关闭</el-radio>
              <el-radio value="1" border>开启</el-radio>
            </el-radio-group>
            <small class="text-gray-500 ml-1">API 安全功能开启之后调用前端api需要传输签名串</small>
          </el-form-item>
          <el-form-item label="密钥">
            <el-input v-model="form.api_secret" placeholder="请输入密钥" style="width: 30%;" clearable></el-input>
            <small
              class="text-gray-500 flex mt-1">秘钥设置关系系统中api调用传输签名串的编码规则，以及会员token解析，请慎重设置，注意设置之后对应会员要求重新登录获取token</small>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-form-item>
        <el-button type="primary" class=" flex ml-auto mr-8" @click="submit">保存</el-button>
      </el-form-item>


    </el-form>

  </div>
</template>

<script setup>
import { getSysconfig, setSysconfig } from '@/api/sysconfig';
import { tips } from '@/composables/util';
import { reactive, ref } from 'vue';

const loading = ref(false)
const activeName = ref("first")

// 表单 参数
const form = reactive({
  open_reg: 1,
  reg_method: "username",
  password_min: 7,
  password_encrypt: [],
  upload_method: "oss",
  upload_config: {
    Bucket: "",
    http: "",
    ACCESS_KEY: "",
    SECRET_KEY: ""
  },
  api_safe: 1,
  api_secret: ""
})
getData()
const submit = () => {
  loading.value = true
  setSysconfig({
    ...form,
    password_encrypt: form.password_encrypt.join(",")
  }).then(() => {
    tips('配置成功')
    getData()
  }).finally(() => {
    loading.value = false
  })

}
function getData() {
  loading.value = true
  getSysconfig().then((res) => {
    for (const key in form) {
      form[key] = res[key]
    }
    form.password_encrypt = form.password_encrypt.split(",")
  }).finally(() => {
    loading.value = false
  })

}
</script>

<style></style>