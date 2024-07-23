<template>
  <div class="f-header">
    <span class="logo">
      <el-icon class="mr-1">
        <ElemeFilled />
      </el-icon>
      上腾商城
    </span>
    <el-icon class="icon-btn" @click="$store.commit('SET_ASIDEWHIDTH')">
      <Fold v-if="$store.state.user.asideWidth === '250px'" />
      <Expand v-else />
    </el-icon>
    <el-tooltip effect="dark" content="刷新" placement="bottom">
      <el-icon class="icon-btn" @click="handleRefresh">
        <RefreshRight />
      </el-icon>
    </el-tooltip>
    <div class="ml-auto flex items-center">
      <el-tooltip effect="dark" content="全屏" placement="bottom">
        <el-icon class="icon-btn" @click="toggle">
          <FullScreen v-if="!isFullscreen" />
          <aim v-else />
        </el-icon>
      </el-tooltip>

      <el-dropdown class="dropdown" @command="handleCommand">
        <span class="flex items-center text-light-50" style="cursor: pointer;">
          <el-avatar class="mr-2" :size="25" :src="$store.state.user.user.avatar"></el-avatar>
          {{ $store.state.user.user.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="repassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <form-drawer ref="formDrawerRef" title="修改密码" destoryOnClose @submit="onSubmit">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" class="w-[90%]">
      <el-form-item prop="oldpassword" label="旧密码">
        <el-input v-model="form.oldpassword" placeholder="请输入旧密码">
        </el-input>
      </el-form-item>
      <el-form-item prop="password" label="新密码">
        <el-input v-model="form.password" type="password" show-password placeholder="请输入密码">
        </el-input>
      </el-form-item>
      <el-form-item prop="repassword" label="确认密码">
        <el-input v-model="form.repassword" type="password" show-password placeholder="请输入确认密码">
        </el-input>
      </el-form-item>
    </el-form>
  </form-drawer>
</template>

<script setup>
import { useFullscreen } from '@vueuse/core';
import FormDrawer from '@/components/FormDrawer.vue'
import { useRepassword, useLogout } from '@/composables/useManger'

const {
  // 是否全屏状态
  isFullscreen,
  // 切换全屏
  toggle
} = useFullscreen()

const {
  formDrawerRef,
  form,
  rules,
  formRef,
  onSubmit,
  openRepasswordForm
} = useRepassword()

const {
  handleLogout
} = useLogout()

// 下拉菜单监听
function handleCommand(e) {
  switch (e) {
    case "repassword":
      openRepasswordForm()
      break;
    case "logout":
      handleLogout()
      break;
  }
}

// 刷新
const handleRefresh = () => location.reload()
</script>

<style>
.f-header {
  @apply flex bg-indigo-500 text-light-50 fixed top-0 left-0 right-0;
  height: 64px;
  z-index: 999;
}

.logo {
  @apply flex justify-center items-center text-xl font-thin;
  width: 250px;
}

.icon-btn {
  @apply flex justify-center items-center;
  width: 42px !important;
  height: 64px !important;
  cursor: pointer;
}

.icon-btn:hover {
  @apply bg-indigo-400;
}

.f-header .dropdown {
  height: 64px;
  cursor: pointer;
  @apply flex justify-center items-center mx-5;
}
</style>