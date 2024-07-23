import axios from '@/axios'

export function getAgentStatistics() {
  return axios.get('/admin/agent/statistics')
}

export function getAgentList(page, query) {
  let params = new URLSearchParams();
  for (let key in query) {
    if (query[key] !== null && query[key] !== "") {
      // 仅当值不为空时添加到 params 中
      params.append(key, query[key]);
    }
  }
  params = params ? '?' + params.toString() : ''

  return axios.get(`/admin/agent/${page}${params}`)
}

export function getAgentOrderList(page, query) {
  let params = new URLSearchParams();
  for (let key in query) {
    if (query[key] !== null && query[key] !== "") {
      // 仅当值不为空时添加到 params 中
      params.append(key, query[key]);
    }
  }
  params = params ? '?' + params.toString() : ''

  return axios.get(`/admin/user_bill/${page}${params}`)
}

export function getConfig() {
  return axios.get(`/admin/distribution_setting/get`)
}

export function setConfig(data) {
  return axios.post(`/admin/distribution_setting/set`, data)
}
