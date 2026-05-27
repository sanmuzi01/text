<template>
  <div class="login-container">
    <div class="login-overlay"></div>
    
    <div class="login-card">
      <!-- 登录页面标题 -->
      <div class="login-header">
        <div class="login-logo">
          <i class="fas fa-heartbeat"></i>
        </div>
        <h1 class="login-title">健身房健康管理登录</h1>
        <p class="login-subtitle">请输入您的账号信息</p>
      </div>

      <div class="login-form">
        <el-form :model="loginForm" @submit.prevent="handleLogin">
          <el-row>
            <el-col :span="24">
              <el-form-item label="用户名" label-width="80px">
                <el-input 
                  v-model="loginForm.username" 
                  autocomplete="off" 
                  prefix-icon="user" 
                  maxlength="10"
                  show-word-limit 
                  size="large"
                  placeholder="请输入用户名"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="密 码" label-width="80px">
                <el-input 
                  type="password" 
                  v-model="loginForm.password" 
                  autocomplete="off" 
                  prefix-icon="lock"
                  show-password 
                  size="large"
                  placeholder="请输入密码"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="17">
              <el-form-item label="验证码" label-width="80px">
                <el-input 
                  v-model="loginForm.captcha" 
                  autocomplete="off" 
                  prefix-icon="check" 
                  size="large"
                  placeholder="请输入验证码"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="7">
              <!-- 绑定点击事件来更新验证码图片 -->
              <img :src="captchaUrl" @click="updateCaptcha" class="captcha-image" alt="验证码">
            </el-col>
          </el-row>

          <el-form-item>
            <el-button 
              type="primary" 
              @click="handleLogin"
              class="login-button"
              :loading="loading"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
        
        <!-- 无帐号，点此注册 -->
        <div class="login-footer">
          <el-text>
            若无帐号，点此>> 
            <RouterLink to="/register" class="register-link">注册</RouterLink>
          </el-text>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';
import { login } from '@/api/login.js';
import { ElMessage } from 'element-plus';

// 登录加载状态
const loading = ref(false);

// 验证码图片URL
const captchaUrl = ref('/api/captcha/arithmetic');

// 更新验证码的函数
function updateCaptcha() {
  captchaUrl.value = `/api/captcha/arithmetic?t=${new Date().getTime()}`;
}

// 定时更新验证码
setInterval(updateCaptcha, 300000); // 每5分钟更新一次验证码

const loginForm = ref({
  username: '',
  password: '',
  captcha: ''
});

const router = useRouter();

// 登录处理函数

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
  //跳转到home页面
  // router.push({ name: 'Dashboard' })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* 替换为指定背景图片 */
  background-image: url('https://pic.616pic.com/bg_w1180/00/09/54/YAqekwMmmg.jpg!/fw/1120');
  background-size: cover; /* 图片全屏覆盖 */
  background-position: center; /* 图片居中 */
  background-repeat: no-repeat; /* 禁止重复 */
  position: relative;
  overflow: hidden;
}

/* 移除原渐变动画（因使用图片背景无需动画） */

.login-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4); /* 保持半透明遮罩，确保文字清晰 */
}

.login-card {
  width: 480px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  padding: 40px;
  position: relative;
  z-index: 10;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-logo {
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

.login-title {
  font-size: 28px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
}

.login-subtitle {
  font-size: 14px;
  color: #666;
}

.login-form {
  width: 100%;
}

.login-form .el-form-item {
  margin-bottom: 25px;
}

.login-form .el-input {
  height: 48px;
}

.login-form .el-input__inner {
  border-radius: 8px;
  padding-left: 40px;
  border-color: #dcdfe6;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.login-form .el-input__inner:focus {
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.login-form .el-input__prefix {
  left: 12px;
  color: #999;
}


/* 修改验证码输入框宽度 */
.login-form .el-col-17 {
  width: calc(70% - 10px); /* 调整输入框宽度 */
}

/* 确保验证码图片容器宽度不变 */
.login-form .el-col-7 {
  width: 30%;
}

.captcha-image {
  cursor: pointer;
  margin-left: 5px;
  height: 48px;
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.captcha-image:hover {
  transform: scale(1.03);
}

.login-button {

  width: 60%;
  height: 50px;
  font-size: 18px;
  font-weight: 500;
  border-radius: 8px;
  background: linear-gradient(135deg, #1976d2, #2196f3);
  border: none;
  transition: all 0.3s;
  display: block;
  margin: 0 auto;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(33, 150, 243, 0.4);
}

.login-footer {
  text-align: right;
  margin-top: 20px;
  font-size: 14px;
}

.register-link {
  color: #1976d2;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.register-link:hover {
  color: #0d47a1;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 576px) {
  .login-card {
    width: 90%;
    padding: 30px 25px;
  }
  
  .login-title {
    font-size: 24px;
  }
  
  .login-form .el-form-item {
    margin-bottom: 20px;
  }
  
  .login-form .el-input {
    height: 44px;
  }
  
  .login-button {
    height: 46px;
    font-size: 16px;
  }
}
</style>