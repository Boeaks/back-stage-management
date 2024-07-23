import axios from '@/axios'

export function getUserlList(page, query) {
  if (!query.limit) query.limit = 6
  let params = new URLSearchParams(query);
  params = params ? '?' + params.toString() : ''
  return axios.get(`/admin/user/${page}${params}`)
}

export function createUser(data) {
  return axios.post(`/admin/user`, data)
}


export function updateUser(id, data) {
  return axios.post(`/admin/user/${id}`, data)
}


export function updateUserStatus(status, id) {
  return axios.post(`/admin/user/${id}/update_status`, {
    status
  })
}

export function deleteUser(id) {
  return axios.post(`/admin/user/${id}/delete`)
}
