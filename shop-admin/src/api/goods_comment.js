import axios from '@/axios'

export function getGoodsCommentList(page, query) {
  if (!query.limit) query.limit = 7
  let params = new URLSearchParams(query);
  params = params ? '?' + params.toString() : ''
  return axios.get(`/admin/goods_comment/${page}${params}`)
}


export function updateGoodsCommentStatus(status, id) {
  return axios.post(`/admin/goods_comment/${id}/update_status`, {
    status
  })
}

export function reviewGoodsComment(id, data) {
  return axios.post(`/admin/goods_comment/review/${id}`, {
    data
  })
}
