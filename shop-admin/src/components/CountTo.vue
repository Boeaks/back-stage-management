<template>
  {{ props.tag ? animation.num.toFixed(2) : animation.num.toFixed(0) }}
</template>

<script setup>
import gsap from 'gsap'
import { reactive, watch } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    default: 0
  },
  tag: {
    type: Boolean,
    default: false
  }
})

// 初始数值
const animation = reactive({
  num: 0
})

function AnimationToCount() {
  gsap.to(animation, {
    duration: 0.5,
    // 最终数值，由父组件传来
    num: props.value
  })
}

AnimationToCount()

// 监听数值变化
watch(
  () => props.value,
  () => AnimationToCount()
)
</script>

<style></style>
