<template>

  <div class="login-container">

    <el-card class="login-card">
      <!-- **登陆页面名 -->
      <h1 class="login-title">运动健康系统登录</h1>

      <div class="login-form">

        <el-form :model="loginForm" @submit.prevent="handleLogin">

          <el-row>
            <el-col :span="24">
              <el-form-item label="用户名" label-width="60px">
                <!-- **prefix-icon="user"图标 -->
                <el-input v-model="loginForm.username" autocomplete="off" prefix-icon="user" maxlength="10"
                  show-word-limit size="large"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="密 码" label-width="60px">
                <el-input type="password" v-model="loginForm.password" autocomplete="off" prefix-icon="lock"
                  show-password size="large"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="17">
              <el-form-item label="验证码" label-width="60px">
                <el-input v-model="loginForm.captcha" autocomplete="off" prefix-icon="check" size="large"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="7">
              <!-- 绑定点击事件来更新验证码图片 -->
              <img :src="captchaUrl" @click="updateCaptcha" class="captcha-image" alt="验证码">
            </el-col>
          </el-row>

          <el-form-item>
            <el-button type="primary" @click="handleLogin">登录</el-button>
          </el-form-item>

        </el-form>
        <RouterView />
      </div>

      <!-- 无帐号，点此注册 -->
      <el-row style="text-align: right;">
        <el-col>
          <el-text class="w-150px mb-2">
            若无帐号，点此>> <RouterLink to="/register" style="font-size: 1.2em;color: rgb(64, 158, 255)">注册</RouterLink>
          </el-text>
        </el-col>
      </el-row>

    </el-card>
  </div>

</template>

<script setup>

import { ref } from 'vue';
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { login } from '@/api/login.js'
import { ElMessage } from 'element-plus'

// 验证码图片URL
const captchaUrl = ref('/api/captcha/arithmetic');

// 更新验证码的函数
function updateCaptcha() {
  // 后面提供了两种验证码方式，一是 default, 由5位数字和字母组成
  // 二是 arithmetic, 由加减乘除运算组成,3个运算数
  captchaUrl.value = `/api/captcha/arithmetic?t=${new Date().getTime()}`
}

// 定时更新验证码
setInterval(updateCaptcha, 300000); // 每5分钟更新一次验证码

const loginForm = ref({
  username: '',
  password: '',
  captcha: ''
});

const router = useRouter()
//function handleLogin() {
const handleLogin = () => {

   console.log('登录信息:', loginForm.value);
   //
   login(loginForm.value).then(res => {
     //1. 判断登录的状态
     if(res.data.code == 200) {
       //1.弹出消息提示框：登录成功
       ElMessage({
         message: res.data.message,
         type: 'success',
       })
       //跳转到home页面
       router.push({name:'Dashboard'})
     } else {
       ElMessage.error(res.data.message)
     }
     
   }).catch(err => {
       console.log("==>登录失败:",err)
       ElMessage.error("登录失败,原因：" + err)
   })

  // //跳转到home页面
  // router.push({ name: 'Dashboard' })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 98vh;
  /* **@=src */
  background-image: url('@/assets/bg/bg6.jpg');
  /* 假设背景图片在assets目录下 */
  background-size: cover;
  background-position: center;
  object-fit: cover;
}


.login-card {
  width: 460px;
  padding: 10px;
  /* **背景颜色 */
  background-color: rgb(232, 223, 181);
  border: none;
  /* **半透明0-1,1完全透明 */
  opacity: 0.5;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
  color: #409eff;
}

.login-form {
  width: 100%;
}

.captcha-image {
  cursor: pointer;
  /* 当鼠标悬停时显示为可点击状态 */
  margin-left: 10px;
  /* 与输入框保持一定间距 */
  height: 36px;
  /* 控制图片高度，根据实际情况调整 */
  vertical-align: middle;
  /* 垂直居中对齐 */
}
</style>