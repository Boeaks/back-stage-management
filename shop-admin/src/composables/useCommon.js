import { ref, reactive, computed } from 'vue'
import { tips } from '@/composables/util'

// 搜索，分页，列表，删除，修改状态功能封装
export function useInitTable(opt = {}) {
  const tableData = ref([])
  const total = ref(0)
  const currentPage = ref(1)
  const limit = ref(10)
  const loading = ref(false)

  // 搜索部分
  let searchForm = null
  let resetSearchForm = null
  if (opt.searchForm) {
    // 转为响应式数据
    searchForm = reactive({ ...opt.searchForm })
    // 重置表单
    resetSearchForm = () => {
      for (const key in opt.searchForm) {
        searchForm[key] = opt.searchForm[key]
      }
      getData()
    }
  }

  // 获取数据
  function getData(page = null) {
    loading.value = true
    if (typeof page === 'number') currentPage.value = page;
    opt.getList(currentPage.value, searchForm).then(res => {
      if (opt.onGetListSuccess && typeof opt.onGetListSuccess === 'function') {
        // 特殊操作,采用回调方式，将请求结果作为所需参数值传入，到外部执行
        opt.onGetListSuccess(res)
      } else {
        // 通用操作
        tableData.value = res.list
        total.value = res.totalCount
      }
    }).finally(() => {
      loading.value = false
    })
  }

  // 删除
  const handleDelete = (id) => {
    loading.value = true
    opt.delete(id).then(() => {
      tips('删除成功')
      getData()
    }).finally(() => {
      loading.value = false
    })
  }

  // 改变状态
  const handleChangeStatus = (status, row) => {
    if (!row.statusLoading) row.statusLoading = true
    opt.updateStatus(status, row.id).then(() => {
      tips('状态修改成功')
      if (!row.statusLoading) {
        getData()
      } else {
        row.status = status
      }
    }).finally(() => {
      if (row.statusLoading) row.statusLoading = false
    })
  }

  // 多选选中ID
  const multSelectionIds = ref([])
  const handleSelectionChange = (e) => {
    multSelectionIds.value = e.map(o => o.id)
  }

  // 批量删除
  const multipleTableRef = ref(null)
  const handleMultiDelete = () => {
    loading.value = true
    opt.delete(multSelectionIds.value).then(res => {
      tips('删除成功')
      // 清空选中
      if (multipleTableRef) {
        multipleTableRef.value.clearSelection()
      }
      getData()
    }).finally(() => {
      loading.value = false
    })
  }
  // 上架/下架
  const handleMultiStatusChange = (status) => {
    loading.value = true
    opt.updateStatus(status, multSelectionIds.value).then(res => {
      tips('状态修改成功')
      // 清空选中
      if (multipleTableRef) {
        multipleTableRef.value.clearSelection()
      }
      getData()
    }).finally(() => {
      loading.value = false
    })
  }

  getData()
  return {
    searchForm,
    tableData,
    total,
    loading,
    limit,
    currentPage,
    multipleTableRef,
    multSelectionIds,
    resetSearchForm,
    getData,
    handleDelete,
    handleChangeStatus,
    handleSelectionChange,
    handleMultiDelete,
    handleMultiStatusChange
  }
}

// 新增修改封装
export function useInitForm(opt = {}) {
  const formDrawerRef = ref(null)

  // 表单部分
  const formRef = ref(null)
  const form = reactive({})
  const noticeId = ref(0)

  const rules = opt.rules || {}

  // 新增 | 修改
  const noticeType = computed(() => noticeId.value ? '修改' : '新增')


  // 提交
  const handleSubmit = () => {
    formRef.value.validate((val) => {
      if (!val) return
      formDrawerRef.value.showLoading()
      // 提交前拦截，转为时间戳
      let body = {}
      if (opt.beforeSubmit && typeof opt.beforeSubmit === 'function') {
        body = opt.beforeSubmit({ ...form })
      } else {
        body = form
      }
      console.log(body);
      console.log(1, form);
      const fun = noticeId.value ? opt.update(noticeId.value, body) : opt.create(body)
      fun.then(res => {
        tips(noticeType.value + '成功')
        opt.getData(noticeId ? false : 1)
        formDrawerRef.value.close()
      }).finally(() => {
        formDrawerRef.value.hidenLoading()
      })
    })
  }

  // 修改
  const handleEdit = (item) => {
    let forms = {}
    Object.keys(item).forEach(key => {
      if (key in opt.form) {
        forms[key] = item[key]
      }
    });
    resetForm(forms)
    noticeId.value = item.id
    formDrawerRef.value.open()
  }

  // 新增
  const handleCreate = () => {
    formDrawerRef.value.open()
    noticeId.value = 0
    resetForm(opt.form)
  }

  // 重置表单
  function resetForm(row = false) {
    // 清除提示语
    if (formRef.value) formRef.value.clearValidate()
    if (row) {
      for (const key in row) {
        form[key] = row[key]
      }
    }
  }

  return {
    formDrawerRef,
    formRef,
    form,
    noticeId,
    rules,
    noticeType,
    handleSubmit,
    handleEdit,
    handleCreate,
    resetForm
  }
}