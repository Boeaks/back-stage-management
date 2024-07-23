import {
  deleteGoodsSkusCardValue,
  createGoodsSkusCard,
  updateGoodsSkusCard,
  deleteGoodsSkusCard,
  sortGoodsSkusCard,
  createGoodsSkusCardValue,
  updateGoodsSkusCardValue,
  chooseAndSetGoodsSkusCard
} from '@/api/goods'
import { ref, nextTick, computed } from 'vue'
import { tips, moveUp, moveDown, cartesianProductOf } from './util'

// 当前商品 ID
export const goodsId = ref(0)

// 当前商品选项列表
export const sku_card_list = ref([])

// 初始化商品规格选项列表
export const sku_list = ref([])
export function initSkuCardList(e) {
  sku_card_list.value = e.goodsSkusCard.map(item => {
    item.text = item.name
    item.loading = false
    item.goodsSkusCardValue.map(v => {
      v.text = v.value || "属性值"
      return v
    })
    return item
  })
  sku_list.value = e.goodsSkus

}

// 添加商品规格
export const btnLoading = ref(false)
export function createGoodsSkuCard() {
  btnLoading.value = true
  createGoodsSkusCard({
    goods_id: goodsId.value,
    name: "规格选项",
    order: 50,
    type: 0
  }).then(res => {
    sku_card_list.value.push({
      ...res,
      text: res.name,
      loading: false,
      goodsSkusCardValue: []
    })
  }).finally(() => {
    btnLoading.value = false
  })
}

// 修改商品规格
export function handleUpdate(item) {
  item.loading = true
  updateGoodsSkusCard(item.id, {
    goods_id: item.goods_id,
    name: item.text,
    order: item.order,
    type: 0
  }).then(res => {
    item.name = item.text
  }).catch(err => {
    item.text = item.name
  }).finally(() => {
    item.loading = false
  })
}

// 删除商品规格
export function handleDelete(item) {
  item.loading = true
  deleteGoodsSkusCard(item.id).then(res => {
    tips('商品规格删除成功')
    const i = sku_card_list.value.findIndex(v => v.id === item.id)
    if (i !== -1) {
      sku_card_list.value.splice(i, 1)
    }
    getTableData()
  }).finally(() => {
    item.loading = false
  })
}

// 排序动画
export const sortLoading = ref(false)
// 商品排序
export function sortCard(action, index) {
  // 拷贝规格列表
  const oList = JSON.parse(JSON.stringify(sku_card_list.value))
  // 防止代码冗余
  const fun = action === 'up' ? moveUp : moveDown
  // 排序操作
  fun(oList, index)
  // 拿到请求所需参数
  sortLoading.value = true
  let sortData = oList.map((o, i) => {
    return {
      id: o.id,
      order: i + 1
    }
  })
  // 接口请求，提交排序后的规格列表
  sortGoodsSkusCard({ sortdata: sortData }).then(() => {
    // 请求成功，对实际规格列表进行排序
    fun(sku_card_list.value, index)
    getTableData()
  }).finally(() => {
    sortLoading.value = false
  })
}

// 选择设置规则
export function handleChooseSetGoodsSkusCard(id, data) {
  // 找到当前规格对象
  let item = sku_card_list.value.find(o => o.id === id)
  item.loading = true
  chooseAndSetGoodsSkusCard(id, data).then(res => {
    item.name = item.text = res.goods_skus_card.name
    item.goodsSkusCardValue = res.goods_skus_card_value.map(o => {
      o.text = o.value || "属性值"
      return o
    })
    getTableData()
  }).finally(() => {
    item.loading = false
  })
}

// 初始化规格值
export function initSkusCardItem(id) {
  const loading = ref(false)
  const item = sku_card_list.value.find(v => v.id == id)
  const inputValue = ref('')
  const inputVisible = ref(false)
  const InputRef = ref()

  const handleClose = (tag) => {
    loading.value = true
    deleteGoodsSkusCardValue(tag.id).then(() => {
      const index = item.goodsSkusCardValue.findIndex(o => o.id === tag.id)
      if (index !== -1) {
        item.goodsSkusCardValue.splice(index, 1)
      }
      getTableData()
    }).finally(() => {
      loading.value = false
    })
  }

  const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
      InputRef.value.input.focus()
    })
  }

  const handleInputConfirm = () => {
    if (!inputValue.value) {
      inputVisible.value = false
      return
    }
    loading.value = true
    createGoodsSkusCardValue({
      goods_skus_card_id: id,
      name: item.name,
      order: 50,
      value: inputValue.value
    }).then((res) => {
      item.goodsSkusCardValue.push({
        ...res,
        text: res.value
      })
      getTableData()
    }).finally(() => {
      loading.value = false
      inputVisible.value = false
      inputValue.value = ''
    })
  }

  // 修改
  const handleChange = (value, tag) => {
    loading.value = true
    updateGoodsSkusCardValue(tag.id, {
      goods_skus_card_id: id,
      name: item.name,
      order: tag.order,
      value: value
    }).then(res => {
      tag.value = value
      getTableData()
    }).catch(err => {
      tag.text = tag.value
    }).finally(() => {
      loading.value = false
    })
  }
  return { item, handleClose, inputVisible, showInput, InputRef, handleInputConfirm, inputValue, loading, handleChange }
}

// 初始化表格
export function initSkuTable() {
  // 过滤无内容规格
  const skuLabels = computed(() => sku_card_list.value.filter(v => v.goodsSkusCardValue.length > 0))
  // 获取表头
  const tableThs = computed(() => {
    let length = skuLabels.value.length
    return [{
      name: "商品规格",
      colspan: length, // 动态合并列数（有多少个规格就合并多少列）
      width: '',
      rowspan: length > 0 ? 1 : 2
    }, {
      name: "销售价",
      width: '100px',
      rowspan: 2
    }, {
      name: "市场价",
      width: '100px',
      rowspan: 2
    }, {
      name: "成本价",
      width: '100px',
      rowspan: 2
    }, {
      name: "库存",
      width: '100px',
      rowspan: 2
    }, {
      name: "体积",
      width: '100px',
      rowspan: 2
    }, {
      name: "重量",
      width: '100px',
      rowspan: 2
    }, {
      name: "编码",
      width: '100px',
      rowspan: 2
    }]
  })
  return {
    skuLabels,
    tableThs,
    sku_list
  }
}

// 获取规格表格数据
function getTableData() {
  setTimeout(() => {
    if (sku_card_list.length === 0) return  // 判断是否有规格
    let list = []
    sku_card_list.value.forEach(o => {
      // 判断是否有规格值
      if (o.goodsSkusCardValue && o.goodsSkusCardValue.length > 0) {
        list.push(o.goodsSkusCardValue)
      }
      // 无规格值
      if (list.length === 0) return []
      // 有规格值，排列组合后的数据
      let arr = cartesianProductOf(...list)

      // 获取之前的规格列表,并将规格值ID排序后转为字符串
      let beforeSkuList = JSON.parse(JSON.stringify(sku_list.value)).map(o => {
        if (!Array.isArray(o.skus)) {
          // 对象转数组
          o.skus = Object.keys(o.skus).map(k => o.skus[k])
        }
        // 唯一性 ID
        o.skusId = o.skus.sort((a, b) => a.id - b.id).map(s => s.id).join(',')
        return o
      })

      // 组织新的数据格式返回
      sku_list.value = []
      sku_list.value = arr.map(skus => {
        let o = getBeforeSkuItem(JSON.parse(JSON.stringify(skus)), beforeSkuList)
        return {
          code: o?.code || "",
          cprice: o?.cprice || "0.00",
          goods_id: goodsId.value,
          image: o?.image || "",
          oprice: o?.oprice || "0.00",
          pprice: o?.pprice || "0.00",
          skus,
          stock: o?.stock || 0,
          volume: o?.volume || 0,
          weight: o?.weight || 0,
        }
      })
    })
  }, 200)
}

// 匹配
function getBeforeSkuItem(skus, beforeSkuList) {
  let skusId = skus.sort((a, b) => a.id - b.id).map(s => s.id).join(',')
  return beforeSkuList.find(o => {
    if (skus.length > o.skus.length) {
      return skusId.indexOf(o.skusId) !== -1
    }
    return o.skusId.indexOf(skusId) !== -1
  })
}
