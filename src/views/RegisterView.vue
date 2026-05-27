<template>
  <div class="register-container">
    <div class="register-overlay"></div>
    
    <div class="register-card">
      <div class="register-header">
        <div class="register-logo">
          <i class="fas fa-dumbbell"></i>
        </div>
        <h1 class="register-title">健身房健康管理注册</h1>
        <p class="register-subtitle">填写信息完成注册，开启健康之旅</p>
      </div>

      <el-form
        ref="registerFormRef"
        :model="registerForm"
        status-icon
        :rules="rules"
        label-width="80px"
        class="register-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="registerForm.username" 
            placeholder="请输入用户名"
            size="large"
          />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input 
            v-model.number="registerForm.phone" 
            placeholder="请输入手机号"
            size="large"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="registerForm.password" 
            type="password" 
            placeholder="请设置密码"
            size="large"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            v-model="registerForm.checkPass"
            type="password"
            placeholder="请再次输入密码"
            size="large"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleRegister"
            class="register-button"
            :loading="loading"
          >
            注册用户
          </el-button>
          <el-button 
            @click="handleReset"
            class="reset-button"
          >
            重置
          </el-button>
        </el-form-item>

        <div class="form-footer">
          <span>已有账号？</span>
          <router-link to="/login" class="login-link">立即登录</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/register.js'
import { ElMessage } from 'element-plus'

// 加载状态
const loading = ref(false)
// 表单引用
const registerFormRef = ref(null)
// 路由对象
const router = useRouter()

// 注册表单数据
const registerForm = ref({
  username: '',
  phone: '',
  password: '',
  checkPass: ''
})

// 二次密码检验
const validateCheckPass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.value.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

// 表单验证规则
const rules = ref({
  username: [
    { required: true, message: '用户名是必填项', trigger: 'blur' },
    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '手机号是必填项', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码是必填项', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  checkPass: [
    { validator: validateCheckPass, trigger: 'blur' }
  ]
})

// 注册处理
const handleRegister = () => {
  loading.value = true
  registerFormRef.value.validate((valid) => {
    if (valid) {
      register(registerForm.value).then(res => {
        if (res.data.code === 200) {
          ElMessage.success(res.data.data)
          router.push('/login')
        } else {
          ElMessage.error(res.data.message)
        }
      }).catch(err => {
        console.error('注册失败', err)
        ElMessage.error('注册失败，请稍后重试')
      }).finally(() => {
        loading.value = false
      })
    } else {
      console.error('表单验证失败')
      loading.value = false
      return false
    }
  })
}

// 重置表单
const handleReset = () => {
  registerFormRef.value.resetFields()
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  /* 健身房主题背景图片 */
  background-image: url('https://img95.699pic.com/photo/60013/9178.jpg_wh300.jpg!/fh/300/quality/90');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  padding: 20px;
}

.register-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.register-card {
  width: 500px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  padding: 40px;
  position: relative;
  z-index: 10;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.register-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-logo {
  font-size: 48px;
  color: #1976d2;
  margin-bottom: 15px;
  display: inline-block;
  width: 64px;
  height: 64px;
  background: rgba(25, 118, 210, 0.1);
  border-radius: 50%;
  line-height: 64px;
}

.register-title {
  font-size: 28px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
}

.register-subtitle {
  font-size: 14px;
  color: #666;
}

.register-form .el-form-item {
  margin-bottom: 25px;
}

.register-form .el-input {
  height: 48px;
}

.register-form .el-input__inner {
  border-radius: 8px;
  padding-left: 15px;
  border-color: #dcdfe6;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.register-form .el-input__inner:focus {
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.register-button {
  width: 48%;
  height: 50px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  background: linear-gradient(135deg, #1976d2, #2196f3);
  border: none;
  transition: all 0.3s;
}

.register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(33, 150, 243, 0.4);
}

.reset-button {
  width: 48%;
  height: 50px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  margin-left: 4%;
  transition: all 0.3s;
}

.reset-button:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
}

.form-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.login-link {
  color: #1976d2;
  text-decoration: none;
  font-weight: 500;
  margin-left: 5px;
  transition: all 0.2s;
}

.login-link:hover {
  color: #0d47a1;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 576px) {
  .register-card {
    width: 90%;
    padding: 30px 25px;
  }
  
  .register-title {
    font-size: 24px;
  }
  
  .register-form .el-form-item {
    margin-bottom: 20px;
  }
  
  .register-button, .reset-button {
    width: 100%;
    margin-left: 0;
    margin-bottom: 10px;
  }
}
</style>