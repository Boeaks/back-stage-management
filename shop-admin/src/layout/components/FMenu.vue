<template>
  <div class="f-menu" :style="{ width: $store.state.user.asideWidth }">
    <el-menu class="border-0" @select="handleSelect" :collapse="handleCollapse" :collapse-transition="false"
      unique-opened :default-active="defaultActive">
      <template v-for="(item, index) in asideMenus" :key="index">
        <el-sub-menu :index="item.name" v-if="item.child && item.child.length > 0">
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item v-for="(item2, index2) in item.child" :key="index2" :index="item2.frontpath">
            <el-icon>
              <component :is="item2.icon"></component>
            </el-icon>
            <span>{{ item2.name }}</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="item.name">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore()
const router = useRouter()
const route = useRoute()

const handleCollapse = computed(() => !(store.state.user.asideWidth === '250px'))

// 默认选中
const defaultActive = ref(route.path)
// 监听路由变化
onBeforeRouteUpdate((to, form) => {
  defaultActive.value = to.path
})
function handleSelect(e) {
  router.push(e)
}
const asideMenus = computed(() => store.state.user.menus)
</script>

<style>
.f-menu {
  @apply shadow-md bg-light-50 fixed;
  top: 64px;
  left: 0px;
  bottom: 0px;
  overflow-y: auto;
  overflow-x: hidden;
  transition: all 0.2s;
}

.f-menu::-webkit-scrollbar {
  width: 0px;
}
</style>