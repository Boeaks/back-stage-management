<template>
  <el-row style="min-height: 100vh;" class="login-container">
    <el-col :lg="16" :md="12" :sm="24" class="left">
      <div class="text-light-50">
        <div>欢迎光临</div>
        <div>可使用 <span class="left-span">账号: admin，密码: admin</span> 进行项目演示哦！</div>
      </div>
    </el-col>
    <el-col :lg="8" :md="12" :sm="24" class="right">
      <h2 class="title">欢迎回来</h2>
      <div>
        <span class="line"></span>
        <span>账户密码登录</span>
        <span class="line"></span>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" class="w-[250px]">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon><user /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码">
            <template #prefix>
              <el-icon><lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" round color="#626aef" type="primary" @click="onSubmit" class="w-[250px]">登录</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import { reactive, ref, onBeforeUnmount ,onMounted } from 'vue';
import {toast} from '@/composables/util';
import { useRouter } from 'vue-router';
import store from '@/store';

const router = useRouter()
const form = reactive({
  username:"",
  password:""
})
const formRef = ref(null)
const loading = ref(false)
const rules = {
  username: [{
    required: true,
    message: '用户名不能为空',
    tarigger: 'blur'
  }],
  password: [{
    required: true,
    message: '密码不能为空',
    tarigger: 'blur'
  }]
}

const onSubmit = ()=>{
  formRef.value.validate((vaild)=> {
    if(!vaild) {
      return false
    }
    loading.value = true
    store.dispatch('login',form)
    .then(res=>{
      // 成功通知
      toast('登录成功')
      // 跳转后台首页
      router.push('/')
    })
    .finally(()=>{
      loading.value = false
    })
  })
}

function onKeyDown(e){
  if(e.key === 'Enter') onSubmit()
}

onMounted(()=>{
  // 监听键盘
  document.addEventListener('keydown',onKeyDown)
})

onBeforeUnmount(()=>{
  // 移除键盘监听
  document.removeEventListener('keydown',onKeyDown)
})

</script>

<style scoped>
.login-container {
  @apply bg-indigo-500;
}
.login-container .left,.login-container .right {
  @apply flex items-center justify-center;
}
.login-container .right {
  @apply  flex-col bg-light-50;
}
.left>div>div:first-child{
  @apply font-bold text-4xl mb-4;
}
.left>div>div:last-child .left-span {
  @apply font-bold text-light-50 underline;
}
.right .title {
  @apply font-bold text-3xl text-gray-800;
}
.right>div {
  @apply flex items-center justify-center my-5 text-gray-300 space-x-2;
}
.right .line {
  @apply h-[1px] w-16 bg-gray-200;
}

</style>