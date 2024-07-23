import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '@/views/index.vue'
import Login from '@/views/login.vue'
import NotFound from '@/views/404.vue'
import Admin from '@/layout/admin.vue'
import GoodList from '@/views/goods/list.vue'
import CategoryList from '@/views/category/list.vue'
import UserList from '@/views/user/list.vue'
import OrderList from '@/views/order/list.vue'
import CommentList from '@/views/comment/list.vue'
import ImageList from '@/views/image/list.vue'
import NoticeList from '@/views/notice/list.vue'
import SettingBase from '@/views/setting/base.vue'
import CouponList from '@/views/coupon/list.vue'
import ManagerList from '@/views/manager/list.vue'
import AccessList from '@/views/access/list.vue'
import RoleList from '@/views/role/list.vue'
import SkusList from '@/views/skus/list.vue'
import LevelList from '@/views/level/list.vue'
import SettingBuy from '@/views/setting/buy.vue'
import SettingShip from '@/views/setting/ship.vue'
import DistributionIndex from '@/views/distribution/index.vue'
import DistributionSetting from '@/views/distribution/setting.vue'

// 默认路由，所有用户共享
const routes = [
  {
    path: '/',
    name: 'admin',
    component: Admin,
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: Login
  },
  // 将匹配所有内容并将其放在 `route.params.pathMatch` 下
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    meta: {
      title: '404'
    },
    component: NotFound
  },
]
// 动态路由，用于匹配菜单动态添加路由
const asyncRoutes = [{
  path: '/',
  name: '/',
  component: Index,
  meta: {
    title: '首页'
  }
}, {
  path: '/goods/list',
  name: '/goods/list',
  component: GoodList,
  meta: {
    title: '商品管理'
  }
}, {
  path: '/category/list',
  name: '/category/list',
  component: CategoryList,
  meta: {
    title: '分类列表'
  }
}, {
  path: '/user/list',
  name: '/user/list',
  component: UserList,
  meta: {
    title: '用户列表'
  }
}, {
  path: '/order/list',
  name: '/order/list',
  component: OrderList,
  meta: {
    title: '订单列表'
  }
}, {
  path: '/comment/list',
  name: '/comment/list',
  component: CommentList,
  meta: {
    title: '评价列表'
  }
}, {
  path: '/image/list',
  name: '/image/list',
  component: ImageList,
  meta: {
    title: '图库列表'
  }
}, {
  path: '/notice/list',
  name: '/notice/list',
  component: NoticeList,
  meta: {
    title: '公告'
  }
}, {
  path: '/notice/list',
  name: '/notice/list',
  component: NoticeList,
  meta: {
    title: '公告'
  }
}, {
  path: '/setting/base',
  name: '/setting/base',
  component: SettingBase,
  meta: {
    title: '基础配置'
  }
}, {
  path: '/coupon/list',
  name: '/coupon/list',
  component: CouponList,
  meta: {
    title: '优惠券列表'
  }
}, {
  path: '/manager/list',
  name: '/manager/list',
  component: ManagerList,
  meta: {
    title: '管理员管理'
  }
}, {
  path: '/access/list',
  name: '/access/list',
  component: AccessList,
  meta: {
    title: '菜单权限管理'
  }
}, {
  path: '/role/list',
  name: '/role/list',
  component: RoleList,
  meta: {
    title: '角色管理'
  }
}, {
  path: '/skus/list',
  name: '/skus/list',
  component: SkusList,
  meta: {
    title: '规格管理'
  }
}, {
  path: '/level/list',
  name: '/level/list',
  component: LevelList,
  meta: {
    title: '会员等级'
  }
}, {
  path: '/setting/buy',
  name: '/setting/buy',
  component: SettingBuy,
  meta: {
    title: '购物设置'
  }
}, {
  path: '/setting/ship',
  name: '/setting/ship',
  component: SettingShip,
  meta: {
    title: '物流设置'
  }
}, {
  path: '/distribution/index',
  name: '/distribution/index',
  component: DistributionIndex,
  meta: {
    title: '分销员管理'
  }
}, {
  path: '/distribution/setting',
  name: '/distribution/setting',
  component: DistributionSetting,
  meta: {
    title: '分销设置'
  }
}]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 动态添加路由的方法
export function addRoutes(menus) {
  // 新路由状态
  let isNewRouter = false
  const findAndAddRoutesByMenus = (arr) => {
    arr.forEach(element => {
      // 是否拥有访问该路由权限
      let item = asyncRoutes.find(o => o.path == element.frontpath)
      // 有并且未添加则添加
      if (item && !router.hasRoute(item.name)) {
        router.addRoute('admin', item)
        isNewRouter = true
      }
      // 是否有子路由，递归添加
      if (element.child && element.child.length > 0) {
        findAndAddRoutesByMenus(element.child)
      }
    });
  }
  findAndAddRoutesByMenus(menus)
  return isNewRouter
}

