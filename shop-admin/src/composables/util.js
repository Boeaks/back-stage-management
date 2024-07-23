import { ElNotification, ElMessageBox, ElMessage } from 'element-plus';
import nProgress from 'nprogress';

// 消息通知
export function toast(message, type = "success", dangerouslyUseHTMLString = false) {
  ElNotification({
    message,
    type,
    dangerouslyUseHTMLString,
    duration: 2000
  })
}

// 确认弹窗
export function showModal(content = "提示内容", type = "warning", title = "") {
  return ElMessageBox.confirm(
    content,
    title,
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
}

// 消息提示
export function tips(message = "成功", type = "success") {
  ElMessage({
    message,
    type,
    duration: 2000
  })
}

// 弹出输入框
export function showPrompt(title, value) {
  return ElMessageBox.prompt(
    title, // 题目
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      inputValue: value // 初始文本
    }
  )
}

// 显示进度条
export function showLoading() {
  nProgress.start()
}

// 隐藏进度条
export function hidenLoading() {
  nProgress.done()
}

// 上移
export function moveUp(arr, index) {
  movePosition(arr, index, index - 1)
}

// 下移
export function moveDown(arr, index) {
  movePosition(arr, index, index + 1)
}

// 数组互换位置
function movePosition(arr, index1, index2) {
  // 删除index2，并在 index2 对应的位置赋值 index1，然后返回由删除元素组成的数组，即 index2，赋值给 index1
  arr[index1] = arr.splice(index2, 1, arr[index1])[0]
  return arr
}

// sku排列算法
export function cartesianProductOf() {
  return Array.prototype.reduce.call(arguments, function (a, b) {
    let ret = [];
    a.forEach(function (a) {
      b.forEach(function (b) {
        ret.push(a.concat([b]))
      })
    });
    return ret
  }, [[]]);
}
