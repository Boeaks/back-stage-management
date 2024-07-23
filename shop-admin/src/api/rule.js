import axios from '@/axios'

export function getRuleList(page) {
  return axios.get(`/admin/rule/${page}`)
}

export function createRuleList(data) {
  return axios.post(`/admin/rule`, data)
}


export function updateRuleList(id, data) {
  return axios.post(`/admin/rule/${id}`, data)
}


export function updateRuleStatus(status, id) {
  return axios.post(`/admin/rule/${id}/update_status`, {
    status
  })
}

export function deleteRuleList(id) {
  return axios.post(`/admin/rule/${id}/delete`)
}