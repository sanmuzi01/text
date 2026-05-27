<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <div class="max-w-4xl mx-auto">
      <!-- 管理员个人信息卡片 -->
      <el-card class="mb-6 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border-none">
        <template #header>
          <div class="flex justify-between items-center pb-2 border-b border-gray-100">
            <h1 class="text-xl font-bold text-gray-800 flex items-center">
              <i class="fa fa-user-circle text-blue-500 mr-2"></i>管理员个人信息
            </h1>
            <el-button 
              type="primary" 
              @click="enterEditMode"
              class="transition-all duration-200 hover:shadow-md"
            >
              <i class="fa fa-edit mr-2"></i>编辑信息
            </el-button>
          </div>
        </template>
        
        <div class="grid grid-cols-1 md:grid-cols-5 gap-6 p-6">
          <!-- 头像区域 -->
          <div class="md:col-span-1 flex flex-col items-center justify-center">
            <div class="relative group cursor-pointer mb-4">
              <div class="w-36 h-36 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-md transition-all duration-300 group-hover:shadow-xl">
                <img 
                  :src="adminInfo.avatar" 
                  alt="管理员头像" 
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
              </div>
              <div class="absolute -bottom-2 right-0 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110">
                <i class="fa fa-camera"></i>
              </div>
            </div>
            <el-button 
              v-if="state.editMode" 
              type="primary" 
              size="small" 
              @click="openAvatarUpload"
              class="mt-2 transition-all duration-200"
            >
              <i class="fa fa-upload mr-1"></i>更换头像
            </el-button>
            <p class="text-gray-500 text-sm mt-2"></p>
          </div>
          
          <!-- 信息表单区域 -->
          <el-form :model="adminInfo" label-width="100px" class="md:col-span-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <el-form-item label="用户名" class="mb-2">
                <el-input 
                  v-model="adminInfo.username" 
                  :disabled="!state.editMode" 
                  class="rounded-md border-gray-200 focus:border-blue-500 transition-colors duration-200"
                  :class="!state.editMode ? 'bg-gray-50' : ''"
                />
              </el-form-item>
              
              <el-form-item label="真实姓名" class="mb-2">
                <el-input 
                  v-model="adminInfo.realName" 
                  :disabled="!state.editMode" 
                  class="rounded-md border-gray-200 focus:border-blue-500 transition-colors duration-200"
                  :class="!state.editMode ? 'bg-gray-50' : ''"
                />
              </el-form-item>
              
              <el-form-item label="手机号" class="mb-2">
                <el-input 
                  v-model="adminInfo.phone" 
                  :disabled="!state.editMode" 
                  class="rounded-md border-gray-200 focus:border-blue-500 transition-colors duration-200"
                  :class="!state.editMode ? 'bg-gray-50' : ''"
                />
              </el-form-item>
              
              <el-form-item label="邮箱" class="mb-2">
                <el-input 
                  v-model="adminInfo.email" 
                  :disabled="!state.editMode" 
                  class="rounded-md border-gray-200 focus:border-blue-500 transition-colors duration-200"
                  :class="!state.editMode ? 'bg-gray-50' : ''"
                />
              </el-form-item>
              
              <el-form-item label="性别" class="mb-2">
                <el-radio-group 
                  v-model="adminInfo.gender" 
                  :disabled="!state.editMode"
                  class="flex space-x-4"
                >
                  <el-radio label="male" class="cursor-pointer flex items-center">
                    <i class="fa fa-male text-blue-500 mr-1"></i>男
                  </el-radio>
                  <el-radio label="female" class="cursor-pointer flex items-center">
                    <i class="fa fa-female text-pink-500 mr-1"></i>女
                  </el-radio>
                  <el-radio label="other" class="cursor-pointer flex items-center">
                    <i class="fa fa-question-circle text-gray-500 mr-1"></i>其他
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="状态" class="mb-2">
                <el-tag 
                  :type="adminInfo.status ? 'success' : 'danger'" 
                  class="text-sm py-1 px-3 rounded-full"
                >
                  <i :class="adminInfo.status ? 'fa fa-check-circle mr-1' : 'fa fa-times-circle mr-1'"></i>
                  {{ adminInfo.status ? '已启用' : '已禁用' }}
                </el-tag>
              </el-form-item>
              
              <el-form-item label="创建时间" class="mb-2">
                <el-input 
                  v-model="adminInfo.createTime" 
                  disabled 
                  class="rounded-md border-gray-200 bg-gray-50"
                />
              </el-form-item>
              
              <el-form-item label="上次登录" class="mb-2">
                <el-input 
                  v-model="adminInfo.lastLoginTime" 
                  disabled 
                  class="rounded-md border-gray-200 bg-gray-50"
                />
              </el-form-item>
            </div>
            
            <div class="flex justify-end mt-6 space-x-3" v-if="state.editMode">
              <el-button 
                @click="cancelEdit"
                class="border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              >
                取消
              </el-button>
              <el-button 
                type="primary" 
                @click="saveProfile"
                class="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                <i class="fa fa-save mr-1"></i>保存信息
              </el-button>
            </div>
          </el-form>
        </div>
      </el-card>
      
      <!-- 修改密码卡片 -->
      <el-card class="mb-6 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border-none">
        <template #header>
          <div class="pb-2 border-b border-gray-100">
            <h1 class="text-xl font-bold text-gray-800 flex items-center">
              <i class="fa fa-lock text-purple-500 mr-2"></i>修改密码
            </h1>
          </div>
        </template>
        
        <el-form 
          :model="passwordForm" 
          :rules="passwordRules" 
          ref="passwordFormRef" 
          label-width="120px"
          class="p-6"
        >
          <div class="max-w-md">
            <el-form-item label="当前密码" prop="oldPassword" class="mb-4">
              <el-input 
                v-model="passwordForm.oldPassword" 
                type="password" 
                class="rounded-md border-gray-200 focus:border-blue-500 transition-colors duration-200"
                placeholder="请输入当前密码"
              />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword" class="mb-4">
              <el-input 
                v-model="passwordForm.newPassword" 
                type="password" 
                class="rounded-md border-gray-200 focus:border-blue-500 transition-colors duration-200"
                placeholder="请输入新密码（至少6位）"
              />
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmPassword" class="mb-4">
              <el-input 
                v-model="passwordForm.confirmPassword" 
                type="password" 
                class="rounded-md border-gray-200 focus:border-blue-500 transition-colors duration-200"
                placeholder="请再次输入新密码"
              />
            </el-form-item>
            <el-form-item class="mt-6">
              <el-button 
                type="primary" 
                @click="changePassword"
                class="bg-purple-600 hover:bg-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                <i class="fa fa-refresh mr-1"></i>修改密码
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-card>
      
      <!-- 头像上传弹窗 -->
      <el-dialog
        title="上传头像"
        v-model="state.avatarDialogVisible"
        width="90%"
        max-width="400px"
        center
        class="rounded-xl overflow-hidden"
      >
        <div class="flex flex-col items-center p-4">
          <p class="text-gray-500 text-sm mb-4">请选择JPG/PNG格式图片，大小不超过2MB</p>
          <el-upload
            class="avatar-uploader w-full"
            action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <div class="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-2 dashed border-gray-200 hover:border-blue-500 transition-colors duration-300 bg-gray-50">
              <img 
                v-if="state.uploadAvatarUrl" 
                :src="state.uploadAvatarUrl" 
                class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                alt="预览图" 
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <i class="fa fa-plus text-2xl text-gray-400"></i>
                <span class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">点击上传</span>
              </div>
            </div>
          </el-upload>
        </div>
        
        <template #footer>
          <div class="flex justify-center gap-3">
            <el-button 
              @click="state.avatarDialogVisible = false"
              class="border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              取消
            </el-button>
            <el-button 
              type="primary" 
              @click="saveAvatar"
              class="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              <i class="fa fa-check mr-1"></i>确认保存
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 模拟管理员数据
const adminInfo = reactive({
  id: 1,
  username: 'admin',
  realName: '系统管理员',
  phone: '13800138000',
  email: 'admin@example.com',
  gender: 'male',
  avatar: new URL('@/assets/img/4.jpg', import.meta.url).href,
  createTime: '2023-01-01 10:00:00',
  lastLoginTime: '2025-07-06 08:30:25',
  status: true
})

// 状态管理
const state = reactive({
  editMode: false,
  avatarDialogVisible: false,
  uploadAvatarUrl: '',
  tempAdminInfo: {}
})

// 密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码表单验证规则
const passwordRules = reactive({
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: (rule, value) => {
        if (value !== passwordForm.newPassword) {
          return new Error('两次输入的密码不一致')
        }
        return true
      }, trigger: 'blur' }
  ]
})

// 表单引用
const passwordFormRef = ref(null)

// 生命周期钩子
onMounted(() => {
  // 初始化临时数据
  state.tempAdminInfo = { ...adminInfo }
})

// 进入编辑模式
const enterEditMode = () => {
  state.editMode = true
  state.tempAdminInfo = { ...adminInfo }
}

// 取消编辑
const cancelEdit = () => {
  state.editMode = false
  // 恢复数据
  Object.assign(adminInfo, state.tempAdminInfo)
}

// 保存个人信息
const saveProfile = () => {
  // 模拟保存到后端
  setTimeout(() => {
    Object.assign(adminInfo, state.tempAdminInfo)
    state.editMode = false
    ElMessage.success('个人信息更新成功')
  }, 500)
}

// 打开头像上传弹窗
const openAvatarUpload = () => {
  // 先设置预览图为当前头像
  state.uploadAvatarUrl = adminInfo.avatar
  state.avatarDialogVisible = true
}

// 上传头像前的处理
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJPG) {
    ElMessage.error('请上传JPG/PNG格式的图片')
    return false
  }
  
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2MB')
    return false
  }
  
  // 预览图片
  const reader = new FileReader()
  reader.onload = (e) => {
    state.uploadAvatarUrl = e.target.result
  }
  reader.readAsDataURL(file)
  
  // 模拟上传到服务器
  return false
}

// 保存头像
const saveAvatar = () => {
  if (state.uploadAvatarUrl && state.uploadAvatarUrl !== adminInfo.avatar) {
    adminInfo.avatar = state.uploadAvatarUrl
    state.avatarDialogVisible = false
    ElMessage.success('头像更新成功')
  } else if (!state.uploadAvatarUrl) {
    ElMessage.warning('请先选择图片')
  }
}

// 修改密码
const changePassword = () => {
  if (passwordFormRef.value) {
    passwordFormRef.value.validate((valid) => {
      if (!valid) return
      
      // 模拟验证当前密码
      if (passwordForm.oldPassword !== '123456') {
        ElMessage.error('当前密码不正确')
        return
      }
      
      // 模拟保存新密码
      setTimeout(() => {
        passwordForm.oldPassword = ''
        passwordForm.newPassword = ''
        passwordForm.confirmPassword = ''
        passwordFormRef.value.resetFields()
        ElMessage.success('密码修改成功，请使用新密码登录')
      }, 500)
    })
  }
}
</script>

<style scoped>
/* 头像上传区域样式 */
.avatar-uploader {
  text-align: center;
}

/* 输入框禁用状态样式 */
.el-input.is-disabled .el-input__inner {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

/* 单选按钮样式优化 */
.el-radio__input.is-checked .el-radio__inner {
  border-color: #4f46e5;
  background-color: #4f46e5;
}

.el-radio__input.is-checked + .el-radio__label {
  color: #4f46e5;
}

/* 按钮样式优化 */
.el-button--primary {
  border: none;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .grid-cols-1\.md\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .md\:col-span-4, .md\:col-span-1 {
    grid-column: span 1;
  }
  
  .el-card__body {
    padding: 16px !important;
  }
}
</style>