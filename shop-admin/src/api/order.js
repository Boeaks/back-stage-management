import axios from '@/axios'

export function getOrderList(page, query) {
  // 等于 /admin/manger/1?limit=10&keyword=cheshi
  // 使用 URLSearchParams 来构建查询字符串
  if (!query.limit) query.limit = 6
  let params = new URLSearchParams();
  for (let key in query) {
    if (query[key] !== null && query[key] !== "") {
      // 仅当值不为空时添加到 params 中
      params.append(key, query[key]);
    }
  }
  params = params ? '?' + params.toString() : ''
  return axios.get(`/admin/order/${page}${params}`)
}

export function deleteOrder(ids) {
  return axios.post(`/admin/order/delete_all`, { ids })
}

export function exportOrder(query) {
  let params = new URLSearchParams();
  for (let key in query) {
    if (query[key] !== null && query[key] !== "") {
      // 仅当值不为空时添加到 params 中
      params.append(key, query[key]);
    }
  }
  params = params ? '?' + params.toString() : ''
  return axios.post(`/admin/order/excelexport${params}`, {}, {
    // 返回的数据转换为blob对象
    responseType: "blob"
  })
}

export function getShipInfo(id) {
  return axios.get(`/admin/order/${id}/get_ship_info`)
}

export function refunOrder(id, data) {
  return axios.post(`/admin/order/${id}/handle_refund`, data)
}
