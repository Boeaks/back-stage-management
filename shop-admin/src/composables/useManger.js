import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { logout, updatepassword } from '@/api/manager';
import { showModal, tips } from '@/composables/util';

// 封装修改密码模块
export function useRepassword() {
  // 需要放在函数中，否则会报错
  const router = useRouter()
  const store = useStore()
  // 密码抽屉
  const formDrawerRef = ref(null)
  // 修改密码验证
  const form = reactive({
    oldpassword: "",
    repassword: "",
    password: ""
  })

  const rules = {
    oldpassword: [{
      required: true,
      message: '旧密码不能为空',
      tarigger: 'blur'
    }],
    repassword: [{
      required: true,
      message: '新密码不能为空',
      tarigger: 'blur'
    }],
    password: [{
      required: true,
      message: '确认密码不能为空',
      tarigger: 'blur'
    }]
  }
  const formRef = ref(null)
  const onSubmit = () => {
    formRef.value.validate((vaild) => {
      if (!vaild) {
        return false
      }
      formDrawerRef.value.showLoading()
      updatepassword(form).then((res) => {

      }).catch((err) => {
        if (err.response.data.msg === '你运行到这一步，代表已经修改成功了，但由于当前账号是课程演示账号，所以不会真实修改~') {
          tips('修改密码成功，项目为个人作品，不会真实修改~')
          store.dispatch('logout')
          router.push('/login')
        }
      }).finally(() => {
        formDrawerRef.value.hidenLoading()
      })
    })
  }

  const openRepasswordForm = () => formDrawerRef.value.open()

  return {
    formDrawerRef,
    form,
    rules,
    formRef,
    onSubmit,
    openRepasswordForm
  }
}

// 封装退出登录模块
export function useLogout() {
  const router = useRouter()
  const store = useStore()

  function handleLogout() {
    showModal('是否要退出登录？', '', '退出').then((res) => {
      logout().finally(() => {
        // 清除vuex状态和token
        store.dispatch('logout')
        // 消息提示
        tips('退出成功')
        // 返回登录页
        router.push('/login')
      })
    })
  }
  return {
    handleLogout
  }
}