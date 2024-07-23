<template>
  <!-- 外层容器 -->
  <el-container>
    <!-- 头部 -->
    <el-header>
      <f-header />
    </el-header>
    <!-- 外层容器 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="$store.state.user.asideWidth" style="transition: all 0.2s;">
        <f-menu />
      </el-aside>
      <!-- 主内容 -->
      <el-main>
        <f-tag-list />
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <keep-alive :max="3">
              <component :is="Component"></component>
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import FHeader from './components/FHeader.vue';
import FMenu from './components/FMenu.vue';
import FTagList from './components/FTagList.vue';

</script>

<style>
.fade-enter-from {
  opacity: 0;
  -webkit-transform: translate3d(0, -100%, 0);
  transform: translate3d(0, -100%, 0);
}

.fade-enter-to {
  opacity: 1;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}

.fade-leave-from {
  opacity: 1;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}

.fade-leave-to {
  opacity: 0;
  -webkit-transform: translate3d(0, 100%, 0);
  transform: translate3d(0, 100%, 0);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter-active {
  transition-delay: 0.3s;
}
</style>