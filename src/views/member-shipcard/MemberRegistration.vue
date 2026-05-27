<template>
  <div class="personal-info-container bg-gray-50 min-h-screen p-4 md:p-6">
    <!-- 页面容器 -->
    <div class="max-w-7xl mx-auto">
      <!-- 页面标题与操作区 -->
      <div class="page-header flex flex-wrap items-center justify-between mb-6 gap-4">
        <h2 class="title text-[clamp(1.5rem,3vw,2rem)] font-bold text-gray-800 flex items-center">
          <i class="fas fa-users mr-2 text-blue-600"></i>会员账号管理
        </h2>
        <div class="btn-group flex flex-wrap items-center gap-3">
          <!-- 添加账号按钮 -->
          <el-button 
            type="primary" 
            icon="Plus" 
            @click="openDrawer"
            class="transition-all duration-300 hover:shadow-lg"
          >
            添加账号
          </el-button>
          <!-- 批量停用按钮 -->
          <el-button 
            type="danger" 
            icon="Open" 
            @click="handleBatchDisable"
            class="transition-all duration-300 hover:shadow-lg"
            :disabled="selectedRows.length === 0"
          >
            批量停用
          </el-button>
          <!-- 搜索框 -->
          <div class="relative w-full sm:w-auto">
            <el-input
              v-model="searchKey"
              placeholder="搜索姓名/电话"
              clearable
              class="search-input w-full sm:w-60"
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <i class="el-icon-search text-gray-400"></i>
              </template>
            </el-input>
          </div>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="stat-card bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-all duration-300">
          <div class="flex items-center">
            <div class="stat-icon w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <i class="fas fa-users text-blue-500 text-xl"></i>
            </div>
            <div>
              <div class="stat-number text-2xl font-bold text-blue-600">{{ totalMembers }}</div>
              <div class="stat-title text-gray-500 text-sm">总会员数</div>
            </div>
          </div>
        </div>
        <div class="stat-card bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition-all duration-300">
          <div class="flex items-center">
            <div class="stat-icon w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <i class="fas fa-coins text-green-500 text-xl"></i>
            </div>
            <div>
              <div class="stat-number text-2xl font-bold text-green-600">¥{{ totalBalance }}</div>
              <div class="stat-title text-gray-500 text-sm">总账户余额</div>
            </div>
          </div>
        </div>
        <div class="stat-card bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500 hover:shadow-md transition-all duration-300">
          <div class="flex items-center">
            <div class="stat-icon w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <i class="fas fa-check-circle text-purple-500 text-xl"></i>
            </div>
            <div>
              <div class="stat-number text-2xl font-bold text-purple-600">{{ activeMembers }}</div>
              <div class="stat-title text-gray-500 text-sm">活跃会员数</div>
            </div>
          </div>
        </div>
        <div class="stat-card bg-white p-4 rounded-xl shadow-sm border-l-4 border-orange-500 hover:shadow-md transition-all duration-300">
          <div class="flex items-center">
            <div class="stat-icon w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mr-3">
              <i class="fas fa-book text-orange-500 text-xl"></i>
            </div>
            <div>
              <div class="stat-number text-2xl font-bold text-orange-600">{{ totalCourses }}</div>
              <div class="stat-title text-gray-500 text-sm">课程总数</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 会员信息表格 -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-6 transition-all duration-300 hover:shadow-md">
        <el-table
          :data="paginatedData"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
          class="mb-0"
          :row-class-name="tableRowClassName"
        >
          <!-- 多选列 -->
          <el-table-column
            type="selection"
            width="35"
            align="center"
          />
          <!-- ID 列 -->
          <el-table-column
            prop="id"
            label="ID"
            width="50"
            align="center"
          />
          <!-- 姓名列 -->
          <el-table-column
            prop="name"
            label="姓名"
            min-width="67"
            align="center"
          />
          <!-- 电话列 -->
          <el-table-column
            prop="phone"
            label="电话"
            min-width="120"
            align="center"
          />
          <!-- 邮箱列 -->
          <el-table-column
            prop="email"
            label="邮箱"
            min-width="180"
            align="center"
          />
          <!-- 性别列 -->
          <el-table-column
            prop="gender"
            label="性别"
            width="90"
            align="center"
          >
            <template #default="scope">
              <el-tag :type="scope.row.gender === '男' ? 'info' : 'success'" class="w-16">
                {{ scope.row.gender }}
              </el-tag>
            </template>
          </el-table-column>
          <!-- 生日列 -->
          <el-table-column
            label="生日"
            width="90"
            align="center"
          >
            <template #default="scope">
              {{ formatBirthday(scope.row.birthday) }}
            </template>
          </el-table-column>
          <!-- 注册时间列 -->
          <el-table-column
            prop="registerDate"
            label="注册时间"
            width="110"
            align="center"
          />
          <!-- 金额列 -->
          <el-table-column
            label="账户余额"
            width="81"
            align="center"
          >
            <template #default="scope">
              <span class="text-blue-600 font-semibold">¥{{ scope.row.balance }}</span>
            </template>
          </el-table-column>
          <!-- 状态列 -->
          <el-table-column
            label="状态"
            width="105"
            align="center"
          >
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)" effect="dark" class="w-20">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <!-- 操作列 -->
          <el-table-column
            label="操作"
            width="230"
            align="center"
          >
            <template #default="scope">
              <div class="flex justify-center space-x-2">
                <el-button
                  type="primary"
                  icon="Edit"
                  size="small"
                  @click="handleEdit(scope.row)"
                  class="transition-all duration-200 hover:shadow-md"
                >
                  编辑
                </el-button>
                <el-button
                  :type="scope.row.status === '使用中' ? 'danger' : 'success'"
                  :icon="scope.row.status === '使用中' ? 'Switch' : 'Check'"
                  size="small"
                  @click="handleToggleStatus(scope.row)"
                  class="transition-all duration-200 hover:shadow-md"
                >
                  {{ scope.row.status === '使用中' ? '停用' : '启用' }}
                </el-button>
                <el-button
                  type="warning"
                  icon="Tickets"
                  size="small"
                  @click="openCourseDialog(scope.row)"
                  class="transition-all duration-200 hover:shadow-md"
                >
                  选课
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页控件 -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 bg-white p-4 rounded-xl shadow-sm">
        <div class="text-gray-500 text-sm">
          显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, tableData.length) }} 条，共 {{ tableData.length }} 条记录
        </div>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 15, 20]"
          layout="sizes, prev, pager, next, jumper"
          :total="tableData.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          class="pagination"
        />
      </div>

      <!-- 抽屉：添加/编辑账号信息 -->
      <el-drawer
        :title="form.id ? '编辑账号信息' : '添加新账号'"
        v-model="drawerVisible"
        direction="rtl"
        size="40%"
        class="drawer-container"
        :before-close="handleDrawerClose"
      >
        <el-form
          :model="form"
          :rules="rules"
          ref="formRef"
          label-width="100px"
          class="p-6 space-y-4"
        >
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" class="transition-all duration-200 focus:border-blue-500" />
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入电话" class="transition-all duration-200 focus:border-blue-500" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" class="transition-all duration-200 focus:border-blue-500" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="form.gender" class="flex gap-4">
              <el-radio label="男" class="cursor-pointer">男</el-radio>
              <el-radio label="女" class="cursor-pointer">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="生日" prop="birthday">
            <el-date-picker
              v-model="form.birthday"
              type="date"
              placeholder="选择生日"
              value-format="YYYY-MM-DD"
              class="w-full transition-all duration-200 focus:border-blue-500"
            />
          </el-form-item>
          <el-form-item label="账户余额" prop="balance">
            <el-input-number v-model="form.balance" :min="0" :step="100" class="w-full transition-all duration-200 focus:border-blue-500" />
          </el-form-item>
          <el-form-item label="注册时间" prop="registerDate">
            <el-date-picker
              v-model="form.registerDate"
              type="date"
              placeholder="选择注册时间"
              value-format="YYYY-MM-DD"
              class="w-full transition-all duration-200 focus:border-blue-500"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status" class="flex gap-4">
              <el-radio label="使用中" class="cursor-pointer">使用中</el-radio>
              <el-radio label="停用" class="cursor-pointer">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="flex justify-end gap-2 pt-4">
            <el-button @click="drawerVisible = false" class="transition-all duration-200 hover:shadow-md">取消</el-button>
            <el-button type="primary" @click="handleSubmit" class="transition-all duration-200 hover:shadow-md">保存</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>

      <!-- 选课对话框 -->
      <el-dialog
        v-model="courseDialogVisible"
        :title="`为 ${selectedMember?.name} 选择课程`"
        width="70%"
        class="course-dialog"
        :before-close="handleCourseDialogClose"
      >
        <el-tabs v-model="activeCourseTab" class="course-tabs">
          <el-tab-pane label="普通课程" name="normal" class="py-4">
            <el-table :data="normalCourses" border class="course-table">
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column prop="id" label="ID" width="70" align="center" />
              <el-table-column prop="courseName" label="课程名称" min-width="150" />
              <el-table-column prop="time" label="课程时间" min-width="180" />
              <el-table-column prop="equipment" label="健身器材" min-width="150" />
              <el-table-column label="操作" width="120" align="center">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="selectCourse(scope.row, 'normal')" class="transition-all duration-200 hover:shadow-md">选择</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="私教课程" name="private" class="py-4">
            <el-table :data="privateCourses" border class="course-table">
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column prop="id" label="ID" width="70" align="center" />
              <el-table-column prop="courseName" label="课程名称" min-width="150" />
              <el-table-column prop="coach" label="教练" min-width="120" />
              <el-table-column prop="time" label="课程时间" min-width="180" />
              <el-table-column prop="equipment" label="健身器材" min-width="150" />
              <el-table-column label="操作" width="120" align="center">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="selectCourse(scope.row, 'private')" class="transition-all duration-200 hover:shadow-md">选择</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        
        <div class="selected-courses mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <div class="selected-title text-blue-600 font-semibold mb-3 flex items-center">
            <i class="fas fa-list-ul mr-2"></i>已选课程
          </div>
          <div class="selected-list flex flex-wrap gap-2">
            <el-tag 
              v-for="(course, index) in selectedCourses" 
              :key="index"
              type="success"
              closable
              @close="removeCourse(index)"
              class="course-tag py-1 px-3 transition-all duration-200 hover:scale-105"
            >
              <i :class="course.type === 'normal' ? 'fas fa-book mr-1' : 'fas fa-user-graduate mr-1'"></i>
              {{ course.courseName }}
            </el-tag>
          </div>
        </div>
        
        <template #footer>
          <el-button @click="courseDialogVisible = false" class="transition-all duration-200 hover:shadow-md">取消</el-button>
          <el-button type="primary" @click="saveCourses" class="transition-all duration-200 hover:shadow-md">保存选课</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
// 保持原有JavaScript逻辑不变
import { ref, reactive, computed, onMounted } from 'vue'
import { 
  ElTable, 
  ElTableColumn, 
  ElButton, 
  ElInput, 
  ElDrawer, 
  ElForm, 
  ElFormItem, 
  ElTag, 
  ElRadioGroup, 
  ElRadio, 
  ElDatePicker, 
  ElMessageBox, 
  ElMessage,
  ElPagination,
  ElDialog,
  ElTabs,
  ElTabPane,
  ElInputNumber
} from 'element-plus'

// 表格数据
const tableData = ref([])

// 初始化模拟数据
const initMockData = () => {
  const mockData = []
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '王十二', '刘十三', '陈十四', '杨十五', '黄十六', '赵十七', '钱十八']
  const genders = ['男', '女']
  const statuses = ['使用中', '停用']
  
  for (let i = 1; i <= 18; i++) {
    const name = names[i % names.length]
    const phone = `138${String(i).padStart(4, '0')}${String(i+1000).padStart(4, '0')}`
    
    mockData.push({
      id: i,
      name: name,
      phone: phone,
      email: `${name.toLowerCase()}@example.com`,
      gender: genders[i % 2],
      birthday: `199${i % 10}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      registerDate: `2023-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      balance: Math.floor(Math.random() * 5000) + 500,
      status: statuses[i % 2],
      courses: []
    })
  }
  
  return mockData
}

// 普通课程数据
const normalCourses = ref([
  { id: 1, courseName: '太极养生', time: '每周一、四 07:00-08:00', equipment: '瑜伽垫' },
  { id: 2, courseName: '形体芭蕾', time: '每周三、五 16:00-17:30', equipment: '把杆' },
  { id: 3, courseName: '劲爆单车', time: '每周二、四、六 19:30-20:30', equipment: '动感单车' },
  { id: 4, courseName: 'HIT顶级派训练', time: '每周一、三、五 06:30-07:30', equipment: '跳绳' },
  { id: 5, courseName: '亲子瑜伽', time: '每周日 10:00-11:30', equipment: '瑜伽垫' },
  { id: 6, courseName: '拳击健身', time: '每周二、四、六 20:00-21:30', equipment: '沙袋' },
  { id: 7, courseName: '普拉提核心训练', time: '每周一、五 15:00-16:30', equipment: '普拉提床' },
  { id: 8, courseName: '有氧舞蹈', time: '每周三、六 10:00-11:30', equipment: '跳绳' },
  { id: 9, courseName: '核心力量训练', time: '每周二、四 18:30-20:00', equipment: '哑铃' },
  { id: 10, courseName: '游泳训练', time: '每周一、三、五 14:00-15:30', equipment: '泳镜' },
])

// 私教课程数据
const privateCourses = ref([
  { id: 1, courseName: '一对一助学班', coach: '张教练', time: '每周一、三、五 19:00-20:30', equipment: '哑铃' },
  { id: 2, courseName: '核心力量训练', coach: '李教练', time: '每周二、四 18:30-20:00', equipment: '杠铃' },
  { id: 3, courseName: '掌柜技巧提升', coach: '王教练', time: '每周三、六 10:00-11:30', equipment: '沙袋' },
  { id: 4, courseName: '乒乓球训练', coach: '赵教练', time: '每周一、三、五 13:00-14:30', equipment: '乒乓球拍' },
  { id: 5, courseName: '拳击私教课', coach: '钱教练', time: '每周二、四 20:00-21:30', equipment: '拳击手套' },
  { id: 6, courseName: '瑜伽私教课', coach: '孙教练', time: '每周一、三、五 09:00-10:30', equipment: '瑜伽垫' },
  { id: 7, courseName: '体能提升训练', coach: '周教练', time: '每周二、四、六 18:00-19:30', equipment: '综合器械' },
  { id: 8, courseName: '康复训练', coach: '吴教练', time: '每周一、五 16:00-17:30', equipment: '康复器械' },
  { id: 9, courseName: '增肌训练', coach: '郑教练', time: '每周二、四、六 19:00-20:30', equipment: '杠铃' },
  { id: 10, courseName: '减脂训练', coach: '王教练', time: '每周一、三、五 17:00-18:30', equipment: '跑步机' },
])

// 分页相关变量
const currentPage = ref(1)
const pageSize = ref(10)

// 分页数据计算
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tableData.value.slice(start, end)
})

// 分页大小改变
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

// 当前页改变
const handleCurrentChange = (page) => {
  currentPage.value = page
}

// 搜索关键字
const searchKey = ref('')
// 多选选中项（批量停用）
const selectedRows = ref([])
// 抽屉显隐
const drawerVisible = ref(false)
// 表单实例
const formRef = ref(null)
// 表单数据 & 校验规则
const form = reactive({
  id: '',
  name: '',
  phone: '',
  email: '',
  gender: '男',
  birthday: '',
  registerDate: '',
  balance: 1000,
  status: '使用中'
})
const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入电话', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  birthday: [
    { required: true, message: '请选择生日', trigger: 'change' }
  ],
  registerDate: [
    { required: true, message: '请选择注册时间', trigger: 'change' }
  ],
  balance: [
    { required: true, message: '请输入账户余额', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 选课相关变量
const courseDialogVisible = ref(false)
const activeCourseTab = ref('normal')
const selectedMember = ref(null)
const selectedCourses = ref([])

// ========== 计算属性 ==========
// 总会员数
const totalMembers = computed(() => tableData.value.length)
// 总账户余额
const totalBalance = computed(() => {
  return tableData.value.reduce((sum, member) => sum + member.balance, 0)
})
// 活跃会员数
const activeMembers = computed(() => {
  return tableData.value.filter(member => member.status === '使用中').length
})
// 课程总数
const totalCourses = computed(() => normalCourses.value.length + privateCourses.value.length)

// ========== 工具方法 ==========
// 格式化生日为"月日"
const formatBirthday = (birthday) => {
  if (!birthday) return ''
  const [, month, day] = birthday.split('-')
  return `${month}月${day}日`
}

// 获取状态标签颜色
const getStatusType = (status) => {
  return status === '使用中' ? 'success' : 'danger'
}

// 表格行样式
const tableRowClassName = ({ row }) => {
  return row.status === '停用' ? 'row-disabled' : ''
}

// 关闭抽屉前的处理
const handleDrawerClose = () => {
  formRef.value?.resetFields()
}

// 关闭选课对话框前的处理
const handleCourseDialogClose = () => {
  selectedCourses.value = []
}

// ========== 交互逻辑 ==========
// 打开抽屉（添加/编辑）
const openDrawer = () => {
  form.id = ''
  form.name = ''
  form.phone = ''
  form.email = ''
  form.gender = '男'
  form.birthday = ''
  form.registerDate = ''
  form.balance = 1000
  form.status = '使用中'
  formRef.value?.resetFields()
  drawerVisible.value = true
}

// 编辑行：回显数据到表单
const handleEdit = (row) => {
  form.id = row.id
  form.name = row.name
  form.phone = row.phone
  form.email = row.email
  form.gender = row.gender
  form.birthday = row.birthday
  form.registerDate = row.registerDate
  form.balance = row.balance
  form.status = row.status
  drawerVisible.value = true
}

// 提交表单（新增/编辑）
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (form.id) {
        // 编辑：更新表格数据
        const index = tableData.value.findIndex(item => item.id === form.id)
        tableData.value.splice(index, 1, { ...form })
        ElMessage.success('编辑成功！')
      } else {
        // 新增：模拟ID自增
        const newId = Math.max(...tableData.value.map(m => m.id)) + 1
        form.id = newId
        tableData.value.push({ ...form })
        ElMessage.success('添加成功！')
      }
      drawerVisible.value = false
    }
  })
}

// 单个账号状态切换（停用↔启用）
const handleToggleStatus = (row) => {
  const targetStatus = row.status === '使用中' ? '停用' : '使用中'
  ElMessageBox.confirm(
    `确定要${targetStatus}该账号吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: targetStatus === '停用' ? 'warning' : 'success'
    }
  ).then(() => {
    row.status = targetStatus
    ElMessage.success(`${targetStatus}成功！`)
  }).catch(() => {
    ElMessage.info('已取消操作')
  })
}

// 批量停用
const handleBatchDisable = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要停用的账号')
    return
  }
  ElMessageBox.confirm(
    `确定要停用选中的 ${selectedRows.value.length} 个账号吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    selectedRows.value.forEach(row => {
      row.status = '停用'
    })
    ElMessage.success(`已成功停用 ${selectedRows.value.length} 个账号！`)
    selectedRows.value = []
  }).catch(() => {
    ElMessage.info('已取消操作')
  })
}

// 表格多选事件
const handleSelectionChange = (val) => {
  selectedRows.value = val
}

// 搜索功能
const handleSearch = () => {
  if (!searchKey.value) return
  const key = searchKey.value.toLowerCase()
  tableData.value = tableData.value.filter(item => 
    item.name.toLowerCase().includes(key) || 
    item.phone.includes(key)
  )
}

// 打开选课对话框
const openCourseDialog = (row) => {
  selectedMember.value = row
  selectedCourses.value = [...row.courses]
  courseDialogVisible.value = true
}

// 选择课程
const selectCourse = (course, type) => {
  // 检查是否已选择
  const isSelected = selectedCourses.value.some(c => 
    c.id === course.id && c.type === type
  )
  
  if (!isSelected) {
    selectedCourses.value.push({
      ...course,
      type: type
    })
    ElMessage.success(`已选择课程: ${course.courseName}`)
  } else {
    ElMessage.warning('该课程已选择')
  }
}

// 移除课程
const removeCourse = (index) => {
  selectedCourses.value.splice(index, 1)
}

// 保存选课
const saveCourses = () => {
  if (selectedMember.value) {
    const memberIndex = tableData.value.findIndex(m => m.id === selectedMember.value.id)
    if (memberIndex !== -1) {
      tableData.value[memberIndex].courses = [...selectedCourses.value]
      ElMessage.success('课程选择已保存')
      courseDialogVisible.value = false
    }
  }
}

// 初始化数据
onMounted(() => {
  tableData.value = initMockData()
})
</script>

<style scoped>
/* 基础样式 */
.personal-info-container {
  background-color: #f9fafb;
}

/* 表格样式 */
.row-disabled {
  --el-table-tr-bg-color: #f5f5f5;
  color: #9e9e9e;
}

/* 卡片和组件样式 */
.stat-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

/* 按钮和交互元素样式 */
.el-button {
  transition: all 0.2s ease;
}

.el-button:hover {
  transform: translateY(-1px);
}

/* 表格和表单样式 */
.el-table {
  border-radius: 8px 8px 0 0;
}

.el-table th {
  background-color: #f8fafc;
  font-weight: 600;
}

.el-form-item {
  margin-bottom: 16px;
}

/* 标签样式 */
.course-tag {
  background-color: #f0fdf4;
  border-color: #4ade80;
  color: #166534;
}

.course-tag:hover {
  background-color: #dcfce7;
}

/* 分页样式 */
.el-pagination {
  margin: 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .btn-group {
    width: 100%;
    justify-content: flex-start;
  }
  
  .stats-container {
    grid-template-columns: 1fr 1fr;
  }
  
  .course-dialog {
    width: 95% !important;
  }
}

@media (max-width: 480px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .el-table {
    font-size: 12px;
  }
  
  .el-table-column {
    min-width: auto !important;
  }
}
</style>