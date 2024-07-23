import axios from "@/axios";

export function getCategoryList() {
  return axios.get('/admin/category')
}

export function createCategoryList(data) {
  return axios.post(`/admin/category`, data)
}


export function updateCategoryList(id, data) {
  return axios.post(`/admin/category/${id}`, data)
}


export function updateCategoryStatus(status, id) {
  return axios.post(`/admin/category/${id}/update_status`, {
    status
  })
}

export function deleteCategory(id) {
  return axios.post(`/admin/category/${id}/delete`)
}

export function getCategoryGoods(id) {
  return axios.get(`/admin/app_category_item/list?category_id=${id}`)
}

export function deleteCategoryGoods(id) {
  return axios.post(`/admin/app_category_item/${id}/delete`)
}

export function connectCatrgoryGoods(data) {
  return axios.post(`/admin/app_category_item`, data)
}
