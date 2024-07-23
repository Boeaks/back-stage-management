import axios from '@/axios'

export function getStatistucs1() {
  return axios.get('/admin/statistics1')
}

export function getStatistucs2() {
  return axios.get('/admin/statistics2')
}

export function getStatistucs3(type) {
  return axios.get('/admin/statistics3?type=' + type)
}