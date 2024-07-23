import axios from '@/axios'

export function getGoodsList(page, query = {
  limit: 6,
  keyword: ""
}) {
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
  return axios.get(`/admin/goods/${page}${params}`)
}

// 批量上架下架
export function updateGoodsStatus(status, ids) {
  return axios.post(`/admin/goods/changestatus`, { status, ids })
}

export function createGoods(data) {
  return axios.post(`/admin/goods`, data)
}

export function updateGoods(id, data) {
  return axios.post(`/admin/goods/${id}`, data)
}

export function deleteGoods(ids) {
  return axios.post(`/admin/goods/delete_all`, { ids })
}

export function restoreGoods(ids) {
  return axios.post('/admin/goods/restore', { ids })
}

export function destoryGoods(ids) {
  return axios.post('/admin/goods/destroy', { ids })
}

export function readGoods(id) {
  return axios.get(`/admin/goods/read/${id}`)
}

export function setGoodsBanner(id, data) {
  return axios.post(`/admin/goods/banners/${id}`, data)
}

export function updateGoodsSkus(id, data) {
  return axios.post(`/admin/goods/updateskus/${id}`, data)
}

// 添加商品规格
export function createGoodsSkusCard(data) {
  return axios.post('/admin/goods_skus_card', data)
}

// 修改商品规格
export function updateGoodsSkusCard(id, data) {
  return axios.post(`/admin/goods_skus_card/${id}`, data)
}

// 删除商品规格
export function deleteGoodsSkusCard(id, data) {
  return axios.post(`/admin/goods_skus_card/${id}/delete`, data)
}

export function sortGoodsSkusCard(data) {
  return axios.post(`/admin/goods_skus_card/sort`, data)
}

export function createGoodsSkusCardValue(data) {
  return axios.post('/admin/goods_skus_card_value', data)
}

export function updateGoodsSkusCardValue(id, data) {
  return axios.post(`/admin/goods_skus_card_value/${id}`, data)
}

export function deleteGoodsSkusCardValue(id) {
  return axios.post(`/admin/goods_skus_card_value/${id}/delete`)
}

export function chooseAndSetGoodsSkusCard(id, data) {
  return axios.post(`/admin/goods_skus_card/${id}/set`, data)
}
