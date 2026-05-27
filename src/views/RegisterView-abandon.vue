<template>
  <!-- 注册页面 -->
  <div class="common-layout">
    <el-container>
      <el-header height="200">
        <Header/>
      </el-header>
      <el-main>

        <el-form
          ref="registerFormRef"
          :model="registerForm"
          status-icon
          :rules="rules"
          label-width="auto"
          class="register-form"
        >

          <el-form-item label="用户名" prop="username">
            <el-input v-model="registerForm.username" />
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input v-model.number="registerForm.phone" />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="registerForm.password" type="password" autocomplete="off" />
          </el-form-item>

          <el-form-item label="确认密码" prop="checkPass">
            <el-input
              v-model="registerForm.checkPass"
              type="password"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleRegister">
              注册用户
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>

      </el-main>

      <el-footer height="100">
        <Footer/>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
//导入我们自定义的register.js文件
import { register } from '@/api/register.js'
//导入element-plus的提示框
import { ElMessage } from 'element-plus'
//导入路由跳转
import { useRouter } from 'vue-router'

//获取注册表单对像
const registerFormRef = ref(null);
//定义一个路由器对象
const router = useRouter()
//
const registerForm = ref({
  username: '',
  phone: '',
  password: '',
  checkPass: ''
});

/****
 * 二次密码检验
 */
const validateCheckPass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== registerForm.value.password) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
}

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
    {validator: validateCheckPass, trigger: 'blur'}
  ]
})

const handleRegister = () => {
  // 表单验证
  registerFormRef.value.validate((valid) => {
    if (valid) {
      console.log('注册信息:', registerForm.value)
      // 1. 把注册表单中的数据通过请求发送到后端服务器
      register(registerForm.value).then(res => {
        console.log("服务端响应的数据：", res.data)
        if(res.data.code == 200) {
          //1.弹出消息提示框：注册成功
          ElMessage({
            message: res.data.data,
            type: 'success',
          })
          // 2. 重定向到登录页面
          router.push('/login')
        } else {
          //
          ElMessage.error(res.data.message)
        }
        
      }).catch(err => {
        //1.弹出消息提示框：注册失败
        ElMessage.error('糟糕, 注册失败了，原因请查看日志.')
        //2. 输出错误信息
        console.error('注册失败', err)
      })
      
    } else {
      console.error('表单验证失败')
      return false
    }
  })
}

const handleReset = () => {
  console.log('重置表单')
  registerFormRef.value.resetFields()
}
</script>

<style scoped>
  .register-form {
    max-width: 600px;
    margin: 0 auto;
  }
  .el-form-item, .el-header {
    margin-bottom: 30px;
  }
</style>