<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-red-500 to-orange-500">
        <h2 class="text-xl font-bold text-white text-center">会员注销</h2>
      </div>
      <div class="p-6">
        <div class="mb-6">
          <div class="text-center text-gray-700 mb-4">
            <i class="fa fa-exclamation-triangle text-4xl text-red-500 mb-3"></i>
            <h3 class="text-lg font-medium">您确定要注销会员账号吗？</h3>
            <p class="text-sm text-gray-500 mt-2">此操作将永久删除您的账号信息，且无法恢复。</p>
          </div>
          
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h4 class="font-medium text-red-700 mb-2">注销前请确认：</h4>
            <ul class="text-sm text-red-600 space-y-1">
              <li><i class="fa fa-check-circle mr-1"></i>您的个人信息将被永久删除</li>
              <li><i class="fa fa-check-circle mr-1"></i>您的订单记录将无法查询</li>
              <li><i class="fa fa-check-circle mr-1"></i>您的会员权益将立即失效</li>
              <li><i class="fa fa-check-circle mr-1"></i>账号注销后无法恢复</li>
            </ul>
          </div>
        </div>
        
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" class="space-y-4">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          
          <el-form-item label="密码" prop="password">
            <el-input 
              v-model="form.password" 
              type="password" 
              placeholder="请输入密码"
              show-password
            ></el-input>
          </el-form-item>
          
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input 
              v-model="form.confirmPassword" 
              type="password" 
              placeholder="请再次输入密码"
              show-password
            ></el-input>
          </el-form-item>
          
          <el-form-item label="验证码" prop="verifyCode">
            <div class="flex">
              <el-input v-model="form.verifyCode" placeholder="请输入验证码"></el-input>
              <el-button @click="sendVerifyCode" :disabled="countdown > 0">
                {{ countdown > 0 ? `${countdown}s后重新发送` : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>
          
          <el-form-item>
            <el-checkbox v-model="form.agree" required>我已阅读并同意《账号注销协议》</el-checkbox>
          </el-form-item>
          
          <el-form-item class="pt-4">
            <el-button type="primary" :loading="loading" @click="handleSubmit">确认注销</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const countdown = ref(0)

// 表单数据
const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  verifyCode: '',
  agree: false
})

// 表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }, trigger: 'blur' }
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 6, max: 6, message: '验证码为6位数字', trigger: 'blur' }
  ],
  agree: [
    { validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请阅读并同意账号注销协议'))
        } else {
          callback()
        }
      }, trigger: 'change' }
  ]
})

// 模拟会员数据
const mockMembers = [
  {
    "id": "10001",
    "username": "user1",
    "password": "123456",
    "email": "user1@example.com",
    "phone": "13000000001",
    "gender": 1,
    "birthDate": "1990-01-01",
    "createTime": "2023-01-01T12:00:00Z",
    "status": 1,
    "role": 2,
    "points": 100,
    "level": 1
  },
  {
    "id": "10002",
    "username": "user2",
    "password": "123456",
    "email": "user2@example.com",
    "phone": "13000000002",
    "gender": 2,
    "birthDate": "1991-02-02",
    "createTime": "2023-01-02T13:00:00Z",
    "status": 1,
    "role": 2,
    "points": 200,
    "level": 2
  },
  {
    "id": "10003",
    "username": "user3",
    "password": "123456",
    "email": "user3@example.com",
    "phone": "13000000003",
    "gender": 1,
    "birthDate": "1992-03-03",
    "createTime": "2023-01-03T14:00:00Z",
    "status": 1,
    "role": 2,
    "points": 300,
    "level": 3
  },
  {
    "id": "10004",
    "username": "user4",
    "password": "123456",
    "email": "user4@example.com",
    "phone": "13000000004",
    "gender": 2,
    "birthDate": "1993-04-04",
    "createTime": "2023-01-04T15:00:00Z",
    "status": 1,
    "role": 2,
    "points": 400,
    "level": 4
  },
  {
    "id": "10005",
    "username": "user5",
    "password": "123456",
    "email": "user5@example.com",
    "phone": "13000000005",
    "gender": 1,
    "birthDate": "1994-05-05",
    "createTime": "2023-01-05T16:00:00Z",
    "status": 1,
    "role": 2,
    "points": 500,
    "level": 5
  },
  {
    "id": "10006",
    "username": "user6",
    "password": "123456",
    "email": "user6@example.com",
    "phone": "13000000006",
    "gender": 2,
    "birthDate": "1995-06-06",
    "createTime": "2023-01-06T17:00:00Z",
    "status": 1,
    "role": 2,
    "points": 600,
    "level": 6
  },
  {
    "id": "10007",
    "username": "user7",
    "password": "123456",
    "email": "user7@example.com",
    "phone": "13000000007",
    "gender": 1,
    "birthDate": "1996-07-07",
    "createTime": "2023-01-07T18:00:00Z",
    "status": 1,
    "role": 2,
    "points": 700,
    "level": 7
  },
  {
    "id": "10008",
    "username": "user8",
    "password": "123456",
    "email": "user8@example.com",
    "phone": "13000000008",
    "gender": 2,
    "birthDate": "1997-08-08",
    "createTime": "2023-01-08T19:00:00Z",
    "status": 1,
    "role": 2,
    "points": 800,
    "level": 8
  },
  {
    "id": "10009",
    "username": "user9",
    "password": "123456",
    "email": "user9@example.com",
    "phone": "13000000009",
    "gender": 1,
    "birthDate": "1998-09-09",
    "createTime": "2023-01-09T20:00:00Z",
    "status": 1,
    "role": 2,
    "points": 900,
    "level": 9
  },
  {
    "id": "10010",
    "username": "user10",
    "password": "123456",
    "email": "user10@example.com",
    "phone": "13000000010",
    "gender": 2,
    "birthDate": "1999-10-10",
    "createTime": "2023-01-10T21:00:00Z",
    "status": 1,
    "role": 2,
    "points": 1000,
    "level": 10
  },
  {
    "id": "10011",
    "username": "user11",
    "password": "123456",
    "email": "user11@example.com",
    "phone": "13000000011",
    "gender": 1,
    "birthDate": "2000-11-11",
    "createTime": "2023-01-11T22:00:00Z",
    "status": 1,
    "role": 2,
    "points": 1100,
    "level": 11
  },
  {
    "id": "10012",
    "username": "user12",
    "password": "123456",
    "email": "user12@example.com",
    "phone": "13000000012",
    "gender": 2,
    "birthDate": "2001-12-12",
    "createTime": "2023-01-12T23:00:00Z",
    "status": 1,
    "role": 2,
    "points": 1200,
    "level": 12
  },
  {
    "id": "10013",
    "username": "user13",
    "password": "123456",
    "email": "user13@example.com",
    "phone": "13000000013",
    "gender": 1,
    "birthDate": "2002-01-13",
    "createTime": "2023-01-13T00:00:00Z",
    "status": 1,
    "role": 2,
    "points": 1300,
    "level": 13
  },
  {
    "id": "10014",
    "username": "user14",
    "password": "123456",
    "email": "user14@example.com",
    "phone": "13000000014",
    "gender": 2,
    "birthDate": "2003-02-14",
    "createTime": "2023-01-14T01:00:00Z",
    "status": 1,
    "role": 2,
    "points": 1400,
    "level": 14
  },
  {
    "id": "10015",
    "username": "user15",
    "password": "123456",
    "email": "user15@example.com",
    "phone": "13000000015",
    "gender": 1,
    "birthDate": "2004-03-15",
    "createTime": "2023-01-15T02:00:00Z",
    "status": 1,
    "role": 2,
    "points": 1500,
    "level": 15
  },
  {
    "id": "10016",
    "username": "user16",
    "password": "123456",
    "email": "user16@example.com",
    "phone": "13000000016",
    "gender": 2,
    "birthDate": "2005-04-16",
    "createTime": "2023-01-16T03:00:00Z",
    "status": 1,
    "role": 2,
    "points": 1600,
    "level": 16
  },
  {
    "id": "10017",
    "username": "user17",
    "password": "123456",
    "email": "user17@example.com",
    "phone": "13000000017",
    "gender": 1,
    "birthDate": "2006-05-17",
    "createTime": "2023-01-17T04:00:00Z",
    "status": 1,
    "role": 2,
    "points": 1700,
    "level": 17
  },
  {
    "id": "10018",
    "username": "user18",
    "password": "123456",
    "email": "user18@example.com",
    "phone": "13000000018",
    "gender": 3,
    "birthDate": "2007-06-18",
    "createTime": "2023-01-18T05:00:00Z",
    "status": 1,
    "role": 2,
    "points": 1800,
    "level": 18
  }
]

// 发送验证码
const sendVerifyCode = () => {
  if (!form.username) {
    ElMessage.warning('请先输入用户名')
    return
  }
  
  // 检查用户名是否存在
  const user = mockMembers.find(member => member.username === form.username)
  if (!user) {
    ElMessage.error('用户名不存在')
    return
  }
  
  // 模拟发送验证码
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
  
  // 生成随机验证码并存储到本地
  const verifyCode = Math.floor(100000 + Math.random() * 900000)
  sessionStorage.setItem('verifyCode', verifyCode.toString())
  
  // 模拟验证码发送成功
  ElMessage.success('验证码已发送，有效期60秒')
  console.log(`模拟验证码: ${verifyCode}`) // 仅用于测试，实际不应在控制台显示
}

// 提交表单
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      
      // 验证用户名和密码
      const user = mockMembers.find(member => 
        member.username === form.username && 
        member.password === form.password
      )
      
      if (!user) {
        loading.value = false
        ElMessage.error('用户名或密码错误')
        return
      }
      
      // 验证验证码
      const storedCode = sessionStorage.getItem('verifyCode')
      if (form.verifyCode !== storedCode) {
        loading.value = false
        ElMessage.error('验证码错误')
        return
      }
      
      // 模拟API请求
      setTimeout(() => {
        // 从模拟数据中删除用户
        const index = mockMembers.findIndex(member => member.username === form.username)
        if (index !== -1) {
          mockMembers.splice(index, 1)
          ElMessage.success('账号注销成功')
          
          // 清除本地存储的验证码
          sessionStorage.removeItem('verifyCode')
          
          // 跳转到登录页
          router.push('/login')
        } else {
          ElMessage.error('注销失败，请稍后再试')
        }
        
        loading.value = false
      }, 1000)
    } else {
      ElMessage.warning('请完善表单信息')
      return false
    }
  })
}

// 取消操作
const cancel = () => {
  router.go(-1) // 返回上一页
}
</script>

<style scoped>
/* 自定义样式 */
</style>    