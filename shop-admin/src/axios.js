import axios from 'axios'
import { toast } from '@/composables/util';
import { getToken } from '@/composables/auth'
import store from './store';
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 配置过的选项，请求时不用再配置
  timeout: 1000
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前将 token 添加到 header 头
  const token = getToken()
  if (token) {
    config.headers["token"] = token
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 响应拦截器
request.interceptors.response.use(function (response) {
  // 返回请求结果
  return response.request.responseType === 'blob' ? response.data : response.data.data;
}, function (error) {
  // 对响应错误进行统一处理
  const msg = error.response.data.msg
  if (msg !== '你运行到这一步，代表已经修改成功了，但由于当前账号是课程演示账号，所以不会真实修改~') {
    if (msg === '你已经操作成功了，只不过当前是《<a href="https://study.163.com/course/courseMain.htm?courseId=1212775807&share=2&shareId=480000001892585" target="_blank" style="color: #409eff;text-decoration-line: underline;">Vue3实战商城后台管理系统</a>》课程的演示站点，所以数据不会发生更改') return toast('演示站点，操作将不会生效', 'warning')
    if (msg === '当前是《<a href="https://study.163.com/course/courseMain.htm?courseId=1212775807&share=2&shareId=480000001892585" target="_blank" style="color: #409eff;text-decoration-line: underline;">Vue3实战商城后台管理系统</a>》课程的演示站点，仅供演示，禁止操作') return toast('演示站点，操作将不会生效', 'warning')
    if (msg == '非法token，请先登录！') store.dispatch('logout').finally(() => location.reload())
    toast(msg || "请求失败", "error")
  }
  return Promise.reject(error);
});

export default request 
