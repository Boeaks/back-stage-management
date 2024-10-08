import axios from '@/axios'

export function getUserLevelList(page) {
  return axios.get(`/admin/user_level/${page}`)
}

export function createUserLevel(data) {
  return axios.post(`/admin/user_level`, data)
}


export function updateUserLevel(id, data) {
  return axios.post(`/admin/user_level/${id}`, data)
}


export function updateUserLevelStatus(status, id) {
  return axios.post(`/admin/user_level/${id}/update_status`, {
    status
  })
}

export function deleteUserLevel(id) {
  return axios.post(`/admin/user_level/${id}/delete`)
}
