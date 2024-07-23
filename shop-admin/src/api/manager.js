import axios from '@/axios'

// 登录接口
export function login(username, password) {
  return axios.post("/admin/login", {
    username,
    password
  })
}

// 用户权限和信息接口
export function getInfo() {
  return axios.post('/admin/getinfo')
}

// 退出接口
export function logout() {
  return axios.post('/admin/logout')
}

// 修改密码接口
export function updatepassword(data) {
  return axios.post('/admin/updatepassword', data)
}

// 获取管理员列表
export function getManagerList(page, query = {
  limit: 6,
  keyword: ""
}) {
  // 等于 /admin/manger/1?limit=10&keyword=cheshi
  // 使用 URLSearchParams 来构建查询字符串
  if (!query.limit) query.limit = 6
  let params = new URLSearchParams(query);
  params = params ? '?' + params.toString() : ''
  return axios.get(`/admin/manager/${page}${params}`)
}

// 修改管理员状态
export function updateManagerStatus(status, id) {
  return axios.post(`/admin/manager/${id}/update_status`, { status })
}

// 新增管理员
export function createManager(data) {
  return axios.post(`/admin/manager`, data)
}

// 修改管理员
export function updateManager(id, data) {
  return axios.post(`/admin/manager/${id}`, data)
}

// 删除管理员
export function deleteManager(id) {
  return axios.post(`/admin/manager/${id}/delete`)
}