<template>
  <div class="message-management-container">
    <!-- 头部区域 -->
    <div class="header flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">消息通知管理</h1>
      <el-button type="primary" @click="openCreateDialog" class="transition-all duration-300 hover:shadow-lg">
        <el-icon><Plus /></el-icon> 添加消息
      </el-button>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section flex flex-wrap gap-4 mb-6 bg-white rounded-xl shadow-md p-6">
      <el-input
        v-model="searchQuery"
        placeholder="搜索标题或内容"
        clearable
        @keyup.enter="filterMessages"
        class="w-full sm:w-[300px]"
      >
        <template #append>
          <el-button @click="filterMessages">
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input>

      <el-select
        v-model="statusFilter"
        placeholder="筛选状态"
        clearable
        @change="filterMessages"
        class="w-full sm:w-[200px]"
      >
        <el-option label="全部" value=""></el-option>
        <el-option label="未读" value="unread"></el-option>
        <el-option label="已读" value="read"></el-option>
      </el-select>

      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="filterMessages"
        class="w-full sm:w-[300px]"
      />

      <div class="ml-auto flex items-center gap-2">
        <span class="text-sm text-gray-500">共 {{ total }} 条</span>
        <el-pagination
          v-model:current-page="currentPage"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="message-list bg-white rounded-xl shadow-md p-6">
      <el-card
        v-for="message in filteredMessages"
        :key="message.id"
        class="mb-4 message-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      >
        <div class="message-card-header flex justify-between items-center mb-3">
          <h3 class="text-lg font-medium text-gray-800">{{ message.title }}</h3>
          <el-tag 
            :type="message.status === 'read' ? 'success' : 'primary'"
            class="px-3 py-1 rounded-full text-sm font-medium"
          >
            {{ message.status === 'read' ? '已读' : '未读' }}
          </el-tag>
        </div>
        <p class="message-content text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {{ message.content }}
        </p>
        <div class="message-meta flex justify-between text-sm text-gray-500 mb-3">
          <span>创建时间: {{ formatDate(message.createTime) }}</span>
          <span>更新时间: {{ formatDate(message.updateTime) }}</span>
        </div>
        <div class="message-actions flex justify-end gap-2">
          <el-button type="primary" size="small" @click="handleView(message)" class="transition-all duration-300 hover:shadow-md">
            <el-icon><View /></el-icon> 查看
          </el-button>
          <el-button type="warning" size="small" @click="openEditDialog(message)" class="transition-all duration-300 hover:shadow-md">
            <el-icon><Edit /></el-icon> 编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(message.id)" class="transition-all duration-300 hover:shadow-md">
            <el-icon><Delete /></el-icon> 删除
          </el-button>
        </div>
      </el-card>

      <!-- 空状态 -->
      <div v-if="!filteredMessages.length" class="empty-state flex flex-col items-center justify-center py-16">
        <el-empty description="暂无消息"></el-empty>
        <el-button type="primary" @click="openCreateDialog" class="mt-4 transition-all duration-300 hover:shadow-lg">
          创建第一条消息
        </el-button>
      </div>
    </div>

    <!-- 查看弹窗 -->
    <el-dialog
      title="消息详情"
      v-model="viewDialogVisible"
      width="600px"
      :close-on-click-modal="false"
      class="rounded-xl overflow-hidden shadow-xl"
    >
      <template #default>
        <div class="space-y-4">
          <div class="flex items-start">
            <div class="w-24 text-gray-500">标题:</div>
            <div class="font-medium text-gray-800">{{ viewMessage.title }}</div>
          </div>
          <div class="flex items-start">
            <div class="w-24 text-gray-500">状态:</div>
            <el-tag 
              :type="viewMessage.status === 'read' ? 'success' : 'primary'"
              class="px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ viewMessage.status === 'read' ? '已读' : '未读' }}
            </el-tag>
          </div>
          <div class="flex items-start">
            <div class="w-24 text-gray-500">内容:</div>
            <div class="whitespace-pre-wrap text-gray-700 leading-relaxed">{{ viewMessage.content }}</div>
          </div>
          <div class="flex items-start">
            <div class="w-24 text-gray-500">创建时间:</div>
            <div class="text-gray-600">{{ formatDate(viewMessage.createTime) }}</div>
          </div>
          <div class="flex items-start">
            <div class="w-24 text-gray-500">更新时间:</div>
            <div class="text-gray-600">{{ formatDate(viewMessage.updateTime) }}</div>
          </div>
        </div>
      </template>
      <template #footer>
        <el-button @click="viewDialogVisible = false" class="transition-all duration-300 hover:shadow-md">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 编辑/创建弹窗 -->
    <el-dialog
      :title="dialogTitle"
      v-model="editDialogVisible"
      width="600px"
      :close-on-click-modal="false"
      class="rounded-xl overflow-hidden shadow-xl"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入消息标题" class="rounded-lg" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            type="textarea"
            v-model="formData.content"
            :rows="4"
            placeholder="请输入消息内容"
            class="rounded-lg"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="unread">未读</el-radio>
            <el-radio label="read">已读</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer flex justify-end gap-4">
          <el-button @click="resetForm" class="transition-all duration-300 hover:shadow-md">重置</el-button>
          <el-button type="primary" @click="submitForm" class="transition-all duration-300 hover:shadow-md">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import {
  ElButton,
  ElCard,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElPagination,
  ElRadio,
  ElRadioGroup,
  ElSelect,
  ElOption,
  ElTag,
  ElMessageBox,
  ElMessage,
  ElEmpty,
  ElIcon
} from 'element-plus'
import { Plus, Search, Edit, Delete, View } from '@element-plus/icons-vue'

// 模拟数据
const initialMessages = [
  {
    id: 1,
    title: '系统升级通知',
    content: '系统将于7月10日23:00-次日5:00进行升级维护，期间可能无法正常访问，请提前做好准备。',
    status: 'unread',
    createTime: new Date('2025-07-05T10:30:00').getTime(),
    updateTime: new Date('2025-07-05T10:30:00').getTime()
  },
  {
    id: 2,
    title: '订单发货提醒',
    content: '您的订单#20250701已发货，预计7月8日送达。',
    status: 'read',
    createTime: new Date('2025-07-04T15:45:00').getTime(),
    updateTime: new Date('2025-07-04T15:45:00').getTime()
  },
  {
    id: 3,
    title: '夏日促销活动',
    content: '7月10日至7月20日，全场满200减50，新用户首单立减30，快来选购！',
    status: 'unread',
    createTime: new Date('2025-07-03T09:15:00').getTime(),
    updateTime: new Date('2025-07-03T09:15:00').getTime()
  },
  {
    id: 4,
    title: '会员权益更新',
    content: '您的会员等级已提升至钻石会员，可享受专属客服、优先发货等特权。',
    status: 'unread',
    createTime: new Date('2025-07-02T16:20:00').getTime(),
    updateTime: new Date('2025-07-02T16:20:00').getTime()
  },
  {
    id: 5,
    title: '账号安全提示',
    content: '您的账号于7月1日在异地登录，如非本人操作，请及时修改密码。',
    status: 'read',
    createTime: new Date('2025-07-01T14:30:00').getTime(),
    updateTime: new Date('2025-07-01T14:30:00').getTime()
  },
  {
    id: 6,
    title: '邀请好友奖励',
    content: '邀请好友注册并成功消费，您将获得50元优惠券，好友首单立减20元。',
    status: 'unread',
    createTime: new Date('2025-06-30T11:45:00').getTime(),
    updateTime: new Date('2025-06-30T11:45:00').getTime()
  }
]

// 状态管理
const messages = ref([...initialMessages]) // 所有消息
const searchQuery = ref('') // 搜索关键词
const statusFilter = ref('') // 状态筛选
const dateRange = ref([]) // 日期范围筛选
const currentPage = ref(1) // 当前页码
const pageSize = ref(10) // 每页条数
const viewDialogVisible = ref(false) // 查看弹窗显示状态
const editDialogVisible = ref(false) // 编辑/创建弹窗显示状态
const isEditMode = ref(false) // 是否为编辑模式
const formRef = ref(null) // 表单引用
const formData = reactive({ // 表单数据
  id: null,
  title: '',
  content: '',
  status: 'unread'
})
const viewMessage = ref({}) // 查看的消息
const dialogTitle = computed(() => isEditMode.value ? '编辑消息' : '创建消息') // 弹窗标题

// 表单验证规则
const rules = reactive({
  title: [
    { required: true, message: '请输入消息标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度在2-50个字符之间', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入消息内容', trigger: 'blur' },
    { min: 5, message: '内容长度至少5个字符', trigger: 'blur' }
  ]
})

// 计算属性：筛选后的消息
const filteredMessages = computed(() => {
  let result = [...messages.value]
  
  // 关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(msg => 
      msg.title.toLowerCase().includes(query) || 
      msg.content.toLowerCase().includes(query)
    )
  }
  
  // 状态筛选
  if (statusFilter.value) {
    result = result.filter(msg => msg.status === statusFilter.value)
  }
  
  // 日期范围筛选
  if (dateRange.value.length === 2) {
    const [start, end] = dateRange.value
    result = result.filter(msg => {
      const msgTime = new Date(msg.createTime)
      return msgTime >= start && msgTime <= end
    })
  }
  
  // 分页
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return result.slice(startIndex, endIndex)
})

// 计算属性：消息总数
const total = computed(() => {
  let result = [...messages.value]
  
  // 应用筛选条件
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(msg => 
      msg.title.toLowerCase().includes(query) || 
      msg.content.toLowerCase().includes(query)
    )
  }
  
  if (statusFilter.value) {
    result = result.filter(msg => msg.status === statusFilter.value)
  }
  
  if (dateRange.value.length === 2) {
    const [start, end] = dateRange.value
    result = result.filter(msg => {
      const msgTime = new Date(msg.createTime)
      return msgTime >= start && msgTime <= end
    })
  }
  
  return result.length
})

// 格式化日期
const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

// 筛选消息
const filterMessages = () => {
  currentPage.value = 1 // 重置页码
}

// 处理分页变化
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
}

// 查看消息
const handleView = (message) => {
  viewMessage.value = { ...message }
  viewDialogVisible.value = true
  
  // 如果是未读消息，标记为已读
  if (message.status === 'unread') {
    const index = messages.value.findIndex(msg => msg.id === message.id)
    if (index !== -1) {
      messages.value[index] = {
        ...messages.value[index],
        status: 'read',
        updateTime: new Date().getTime()
      }
    }
  }
}

// 打开编辑对话框
const openEditDialog = (message) => {
  isEditMode.value = true
  formData.id = message.id
  formData.title = message.title
  formData.content = message.content
  formData.status = message.status
  editDialogVisible.value = true
}

// 打开创建对话框
const openCreateDialog = () => {
  isEditMode.value = false
  resetForm()
  editDialogVisible.value = true
}

// 重置表单
const resetForm = () => {
  formData.id = null
  formData.title = ''
  formData.content = ''
  formData.status = 'unread'
  formRef.value?.resetFields()
}

// 提交表单
const submitForm = async () => {
  try {
    await formRef.value.validate()
    
    if (isEditMode.value) {
      // 编辑逻辑
      const index = messages.value.findIndex(msg => msg.id === formData.id)
      if (index !== -1) {
        messages.value[index] = {
          ...messages.value[index],
          title: formData.title,
          content: formData.content,
          status: formData.status,
          updateTime: new Date().getTime()
        }
        ElMessage.success('消息更新成功')
      }
    } else {
      // 创建逻辑
      const newId = messages.value.length > 0 
        ? Math.max(...messages.value.map(msg => msg.id)) + 1 
        : 1
      
      const newMessage = {
        id: newId,
        title: formData.title,
        content: formData.content,
        status: formData.status,
        createTime: new Date().getTime(),
        updateTime: new Date().getTime()
      }
      
      messages.value.unshift(newMessage) // 添加到列表顶部
      ElMessage.success('消息创建成功')
    }
    
    editDialogVisible.value = false
  } catch (error) {
    ElMessage.error('表单验证失败，请检查输入')
  }
}

// 删除消息
const handleDelete = (id) => {
  ElMessageBox.confirm(
    '确定要删除这条消息吗？删除后将无法恢复。',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    messages.value = messages.value.filter(msg => msg.id !== id)
    ElMessage.success('消息已删除')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 初始化
onMounted(() => {
  // 从本地存储加载数据（如果有）
  const savedMessages = localStorage.getItem('message_notifications')
  if (savedMessages) {
    messages.value = JSON.parse(savedMessages)
  }
})

// 监听消息变化，保存到本地存储
watch(messages, (newMessages) => {
  localStorage.setItem('message_notifications', JSON.stringify(newMessages))
}, { deep: true })
</script>

<style scoped>
/* 全局变量 */
:root {
  --primary-color: #409eff;
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --danger-color: #f56c6c;
  --info-color: #909399;
  --bg-color: #f5f7fa;
  --card-bg: #ffffff;
  --border-radius: 12px;
  --shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  --transition: all 0.3s ease;
}

/* 容器样式 */
.message-management-container {
  padding: 2rem;
  background-color: var(--bg-color);
  min-height: 100vh;
}

/* 卡片组件优化 */
.message-card {
  border-radius: var(--border-radius);
  border: 1px solid #ebeef5;
  overflow: hidden;
}

.message-card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}

/* 按钮样式优化 */
.el-button {
  border-radius: 8px;
  transition: var(--transition);
}

.el-button:hover {
  transform: translateY(-1px);
}

/* 标签样式优化 */
.el-tag {
  border-radius: 12px;
  padding: 0 10px;
}

/* 输入框样式优化 */
.el-input__inner, .el-textarea__inner {
  border-radius: 8px;
  transition: var(--transition);
}

.el-input__inner:focus, .el-textarea__inner:focus {
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  border-color: var(--primary-color);
}

/* 分页样式优化 */
.el-pagination {
  display: flex;
  align-items: center;
}

.el-pagination__item {
  border-radius: 6px;
  margin: 0 2px;
}

/* 弹窗样式优化 */
.el-dialog {
  border-radius: var(--border-radius);
  overflow: hidden;
}

.el-dialog__header {
  background-color: #fafafa;
  border-bottom: 1px solid #ebeef5;
}

.el-dialog__footer {
  border-top: 1px solid #ebeef5;
}

/* 空状态样式 */
.empty-state {
  padding: 4rem 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .message-management-container {
    padding: 1rem;
  }
  
  .filter-section {
    flex-direction: column;
  }
  
  .filter-section > div {
    width: 100%;
    max-width: 100%;
  }
  
  .message-meta {
    flex-direction: column;
    gap: 4px;
  }
}
</style>