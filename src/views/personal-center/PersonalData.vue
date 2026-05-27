<template>
  <div class="p-4 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <!-- 页面标题 -->
      <div v-if="isLoaded" class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">个人资料管理</h1>
        <p class="text-gray-600 mt-1">管理个人信息记录</p>
      </div>
      
      <!-- 加载状态 -->
      <div v-else class="flex justify-center items-center h-64">
        <el-spinner size="large" />
        <span class="ml-2 text-gray-500">加载中...</span>
      </div>

      <!-- 工具栏 -->
      <div v-if="isLoaded" class="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="flex flex-wrap gap-2">
          <!-- 添加记录按钮 -->
          <el-button 
            type="primary" 
            @click="openAddDialog" 
            :loading="isLoading"
            class="px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            <el-icon><Plus /></el-icon> 添加记录
          </el-button>
          <!-- 批量删除按钮 -->
          <el-button 
            type="danger" 
            @click="deleteSelected" 
            :disabled="selectedRows.length === 0 || isLoading" 
            :loading="isLoading"
            class="px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            <el-icon><Delete /></el-icon> 批量删除
          </el-button>
        </div>
        <div class="w-full md:w-auto">
          <!-- 搜索框和按钮独立布局 -->
          <div class="flex items-center gap-2">
            <el-input 
              v-model="searchQuery" 
              placeholder="搜索姓名/电话" 
              clearable 
              @clear="handleSearch" 
              @keyup.enter="handleSearch" 
              class="flex-1 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            />
            <el-button 
              icon="Search" 
              @click="handleSearch" 
              :loading="isLoading"
              class="bg-primary text-white hover:bg-primary/90 transition-colors duration-300 rounded-lg px-4 py-2"
            />
          </div>
        </div>
      </div>

      <!-- 表格 -->
      <div v-if="isLoaded" class="bg-white rounded-xl shadow-md overflow-hidden">
        <el-table
          v-loading="isLoading"
          :data="currentTableData"
          border
          stripe
          highlight-current-row
          @selection-change="handleSelectionChange"
          ref="tableRef"
          class="rounded-xl"
        >
          <!-- 选择列 -->
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="ID" width="80"></el-table-column>
          <el-table-column prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="phone" label="电话" width="130"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="gender" label="性别" width="80">
            <template #default="scope">
              <el-tag 
                :type="scope.row.gender === '男' ? 'primary' : 'success'"
                class="px-2 py-1 rounded-full text-sm"
              >
                {{ scope.row.gender }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="birthday" label="生日" width="130"></el-table-column>
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <!-- 编辑按钮 -->
              <el-button 
                size="small" 
                type="primary" 
                @click="openEditDialog(scope.row)" 
                :loading="isLoading"
                class="px-3 py-1 rounded-lg hover:shadow-md transition-all duration-300"
              >
                <el-icon><Edit /></el-icon> 编辑
              </el-button>
              <!-- 删除按钮 -->
              <el-button 
                size="small" 
                type="danger" 
                @click="deleteRecord(scope.row)" 
                :disabled="isLoading"
                :loading="isLoading"
                class="px-3 py-1 rounded-lg hover:shadow-md transition-all duration-300"
              >
                <el-icon><Delete /></el-icon> 删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="p-4 border-t flex justify-between items-center">
          <div class="text-sm text-gray-600">共 {{ total }} 条记录</div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            class="el-pagination--small"
          ></el-pagination>
        </div>
      </div>

      <!-- 添加/编辑弹窗 -->
      <el-dialog
        v-if="isLoaded"
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '添加个人信息' : '编辑个人信息'"
        width="50%"
        center
        :before-close="handleCloseDialog"
        :lock-scroll="false"
        class="rounded-xl shadow-lg"
      >
        <template #default>
          <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px" class="p-6">
            <el-form-item label="姓名" prop="name">
              <el-input 
                v-model="formData.name" 
                autocomplete="off" 
                :disabled="isLoading"
                class="rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              />
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input 
                v-model="formData.phone" 
                autocomplete="off" 
                :disabled="isLoading"
                class="rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input 
                v-model="formData.email" 
                autocomplete="off" 
                :disabled="isLoading"
                class="rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              />
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="formData.gender" :disabled="isLoading">
                <el-radio :label="'男'">男</el-radio>
                <el-radio :label="'女'">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="生日" prop="birthday">
              <el-date-picker
                v-model="formData.birthday"
                type="date"
                placeholder="选择日期"
                value-format="YYYY-MM-DD"
                :disabled="isLoading"
                class="w-full rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              />
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <div class="flex justify-end gap-3 px-6 pb-6">
            <el-button 
              @click="dialogVisible = false" 
              :disabled="isLoading"
              class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors duration-300"
            >
              取消
            </el-button>
            <el-button 
              type="primary" 
              @click="submitForm" 
              :loading="isLoading" 
              :disabled="isLoading"
              class="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 transition-colors duration-300"
            >
              确定
            </el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 删除确认弹窗 -->
      <el-dialog
        v-if="isLoaded"
        v-model="deleteDialogVisible"
        title="确认删除"
        width="30%"
        :before-close="handleCloseDeleteDialog"
        class="rounded-xl shadow-lg"
      >
        <template #content>
          <!-- 单条删除 -->
          <div v-if="deleteIds.length === 1" class="text-center py-6">
            <div class="text-lg font-medium text-gray-800 mb-2">{{ deleteRecordName }}</div>
            <div class="text-gray-600 mb-4">ID: {{ deleteRecordId }}</div>
            <p class="text-gray-600">确定要删除这条记录吗？此操作不可撤销。</p>
          </div>
          <!-- 批量删除 -->
          <div v-else class="text-center py-6">
            <div class="text-lg font-medium text-gray-800 mb-2">{{ deleteIds.length }} 条记录</div>
            <p class="text-gray-600">确定要删除选中的记录吗？此操作不可撤销。</p>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end gap-3 px-6 pb-6">
            <el-button 
              @click="deleteDialogVisible = false" 
              :disabled="isLoading"
              class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors duration-300"
            >
              取消
            </el-button>
            <el-button 
              type="danger" 
              @click="confirmDelete" 
              :loading="isLoading" 
              :disabled="isLoading"
              class="px-4 py-2 rounded-lg bg-danger hover:bg-danger/90 transition-colors duration-300"
            >
              确定
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
// 原有script内容保持不变（所有功能逻辑完整保留）
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Search } from '@element-plus/icons-vue'

// 表单验证规则
const rules = reactive({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在2-20个字符之间', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
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
  ]
})

// 模拟数据（扩展到18条）
const mockData = [
  { id: 1, name: '张三', phone: '13800138000', email: 'zhangsan@example.com', gender: '男', birthday: '1990-01-01' },
  { id: 2, name: '李四', phone: '13900139000', email: 'lisi@example.com', gender: '男', birthday: '1991-02-02' },
  { id: 3, name: '王五', phone: '13700137000', email: 'wangwu@example.com', gender: '女', birthday: '1992-03-03' },
  { id: 4, name: '赵六', phone: '13600136000', email: 'zhaoliu@example.com', gender: '男', birthday: '1993-04-04' },
  { id: 5, name: '钱七', phone: '13500135000', email: 'qianqi@example.com', gender: '女', birthday: '1994-05-05' },
  { id: 6, name: '孙八', phone: '13400134000', email: 'sunba@example.com', gender: '男', birthday: '1995-06-06' },
  { id: 7, name: '周九', phone: '13300133000', email: 'zhoujiu@example.com', gender: '女', birthday: '1996-07-07' },
  { id: 8, name: '吴十', phone: '13200132000', email: 'wushi@example.com', gender: '男', birthday: '1997-08-08' },
  { id: 9, name: '郑十一', phone: '13100131000', email: 'zhengshiyi@example.com', gender: '女', birthday: '1998-09-09' },
  { id: 10, name: '王十二', phone: '13000130000', email: 'wangshier@example.com', gender: '男', birthday: '1999-10-10' },
  { id: 11, name: '陈十三', phone: '13812345678', email: 'chenshisan@example.com', gender: '男', birthday: '2000-01-01' },
  { id: 12, name: '杨十四', phone: '13912345678', email: 'yangshisi@example.com', gender: '女', birthday: '2001-02-02' },
  { id: 13, name: '黄十五', phone: '13712345678', email: 'huangshiwu@example.com', gender: '男', birthday: '2002-03-03' },
  { id: 14, name: '周十六', phone: '13612345678', email: 'zhoushiliu@example.com', gender: '女', birthday: '2003-04-04' },
  { id: 15, name: '吴十七', phone: '13512345678', email: 'wushishiqi@example.com', gender: '男', birthday: '2004-05-05' },
  { id: 16, name: '郑十八', phone: '13412345678', email: 'zhengshiba@example.com', gender: '女', birthday: '2005-06-06' },
  { id: 17, name: '冯十九', phone: '13312345678', email: 'fengshijiu@example.com', gender: '男', birthday: '2006-07-07' },
  { id: 18, name: '陈二十', phone: '13212345678', email: 'chenershi@example.com', gender: '女', birthday: '2007-08-08' }
]

// 数据状态
const tableData = ref([])          // 原始数据（全量）
const currentTableData = ref([])   // 当前页数据
const total = ref(0)               // 总记录数
const currentPage = ref(1)         // 当前页码
const pageSize = ref(10)           // 每页条数
const searchQuery = ref('')        // 搜索关键词
const selectedRows = ref([])       // 表格选中行
const dialogVisible = ref(false)   // 编辑/添加弹窗状态
const deleteDialogVisible = ref(false) // 删除确认弹窗状态
const formData = reactive({        // 表单数据
  id: null,
  name: '',
  phone: '',
  email: '',
  gender: '男',
  birthday: ''
})
const formRef = ref(null)          // 表单引用
const tableRef = ref(null)         // 表格引用
const dialogType = ref('add')      // 弹窗类型：add/edit
const deleteIds = ref([])          // 待删除的ID列表
const deleteRecordName = ref('')   // 单条删除的记录姓名
const deleteRecordId = ref('')     // 单条删除的记录ID
const isLoading = ref(false)       // 加载状态（防止重复操作）
const isLoaded = ref(false)        // 数据初始化完成标志

// 获取数据（带搜索和分页）
const fetchData = (page = 1, size = 10, query = '') => {
  isLoading.value = true
  try {
    setTimeout(() => {
      // 1. 过滤数据
      let filteredData = [...tableData.value]
      if (query) {
        const q = query.toLowerCase()
        filteredData = filteredData.filter(item => 
          item.name.toLowerCase().includes(q) || 
          item.phone.includes(q)
        )
      }

      // 2. 分页处理
      const start = (page - 1) * size
      const end = start + size
      currentTableData.value = filteredData.slice(start, end)
      total.value = filteredData.length

      // 3. 处理页码越界（删除后页码可能超出范围）
      if (page > Math.ceil(total.value / size) && page > 1) {
        currentPage.value = page - 1
        fetchData(currentPage.value, size, query)
        return
      }

      isLoading.value = false
    }, 300)
  } catch (error) {
    ElMessage.error('数据加载失败，请稍后重试')
    console.error('fetchData error:', error)
    isLoading.value = false
  }
}

// 初始化数据
const initData = async () => {
  try {
    tableData.value = [...mockData]
    await nextTick()
    isLoaded.value = true
    fetchData() // 初始加载第一页
  } catch (error) {
    ElMessage.error('初始化失败，请稍后重试')
    console.error('initData error:', error)
  }
}

onMounted(() => {
  initData()
})

// 监听搜索变化（自动触发分页）
watch(searchQuery, () => {
  currentPage.value = 1
  fetchData(currentPage.value, pageSize.value, searchQuery.value)
})

// 分页事件：改变每页条数
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  fetchData(currentPage.value, newSize, searchQuery.value)
}

// 分页事件：改变当前页码
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  fetchData(newPage, pageSize.value, searchQuery.value)
}

// 表格选中事件（批量删除依赖）
const handleSelectionChange = (val) => {
  selectedRows.value = val
}

// 搜索按钮事件
const handleSearch = () => {
  currentPage.value = 1
  fetchData(currentPage.value, pageSize.value, searchQuery.value)
}

// 打开添加弹窗
const openAddDialog = () => {
  dialogType.value = 'add'
  // 重置表单
  formData.id = null
  formData.name = ''
  formData.phone = ''
  formData.email = ''
  formData.gender = '男'
  formData.birthday = ''
  if (formRef.value) formRef.value.resetFields()
  dialogVisible.value = true
}

// 打开编辑弹窗（接收行数据）
const openEditDialog = (row) => {
  dialogType.value = 'edit'
  // 深拷贝数据到表单（避免影响原始数据）
  Object.assign(formData, { ...row })
  dialogVisible.value = true
}

// 关闭编辑/添加弹窗（处理未保存提示）
const handleCloseDialog = (done) => {
  if (formRef.value) {
    formRef.value.validate((valid) => {
      if (valid) {
        ElMessageBox.confirm('确定要关闭吗？您可能有未保存的更改。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
          dialogVisible.value = false
        }).catch(() => { /* 取消关闭 */ })
      } else {
        done()
        dialogVisible.value = false
      }
    })
  } else {
    done()
    dialogVisible.value = false
  }
}

// 提交表单（添加/编辑）
const submitForm = () => {
  if (!formRef.value) return

  formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      isLoading.value = true
      if (dialogType.value === 'add') {
        await addRecord()
      } else {
        await updateRecord()
      }
    } catch (error) {
      ElMessage.error('操作失败，请稍后重试')
      console.error('submitForm error:', error)
    } finally {
      isLoading.value = false
      dialogVisible.value = false
    }
  })
}

// 添加记录（模拟接口）
const addRecord = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 生成唯一ID
      const newId = tableData.value.length > 0 
        ? Math.max(...tableData.value.map(item => item.id)) + 1 
        : 1
      // 添加到原始数据
      tableData.value.push({ ...formData, id: newId })
      // 刷新表格
      fetchData()
      ElMessage.success('添加成功')
      resolve(true)
    }, 300)
  })
}

// 编辑记录（模拟接口）
const updateRecord = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 查找要更新的记录索引
      const index = tableData.value.findIndex(item => item.id === formData.id)
      if (index !== -1) {
        // 更新原始数据
        tableData.value.splice(index, 1, { ...formData })
        // 刷新表格
        fetchData(currentPage.value, pageSize.value, searchQuery.value)
        ElMessage.success('更新成功')
      } else {
        ElMessage.error('记录不存在')
      }
      resolve(index !== -1)
    }, 300)
  })
}

// 单条删除：接收行数据，记录ID和姓名
const deleteRecord = (row) => {
  deleteIds.value = [row.id]
  deleteRecordName.value = row.name
  deleteRecordId.value = row.id
  deleteDialogVisible.value = true
}

// 批量删除：获取选中行的ID
const deleteSelected = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的记录')
    return
  }
  deleteIds.value = selectedRows.value.map(item => item.id)
  deleteRecordName.value = '' // 批量删除时清空姓名
  deleteRecordId.value = ''   // 清空ID
  deleteDialogVisible.value = true
}

// 关闭删除确认弹窗（清空状态）
const handleCloseDeleteDialog = () => {
  deleteDialogVisible.value = false
  deleteIds.value = []
  deleteRecordName.value = ''
  deleteRecordId.value = ''
}

// 确认删除（核心逻辑）
const confirmDelete = async () => {
  if (deleteIds.value.length === 0) return

  try {
    // 显示加载状态
    isLoading.value = true
    
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 从原始数据中移除记录
    tableData.value = tableData.value.filter(item => !deleteIds.value.includes(item.id))
    
    // 刷新表格（保持当前分页状态）
    fetchData(currentPage.value, pageSize.value, searchQuery.value)
    
    // 清空选中状态
    if (tableRef.value) tableRef.value.clearSelection()
    selectedRows.value = []
    
    // 清空删除状态
    deleteIds.value = []
    deleteRecordName.value = ''
    deleteRecordId.value = ''
    deleteDialogVisible.value = false
    
    // 提示成功
    ElMessage.success(`成功删除 ${deleteIds.value.length} 条记录`)
  } catch (error) {
    ElMessage.error('删除失败，请稍后重试')
    console.error('confirmDelete error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 全局样式 */
:root {
  --primary: #409eff;
  --danger: #f56c6c;
  --gray-100: #f5f7fa;
  --gray-200: #e4e7ed;
  --gray-300: #dcdfe6;
  --gray-400: #c0c4cc;
  --gray-500: #909399;
  --gray-600: #606266;
  --gray-700: #303133;
  --gray-800: #1e1e1e;
}

/* 基础样式 */
* {
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'Noto Sans SC', sans-serif;
  line-height: 1.5;
  color: var(--gray-700);
}

/* 卡片容器 */
.bg-white.rounded-xl.shadow-md {
  border-radius: 0.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.bg-white.rounded-xl.shadow-md:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
}

/* 按钮样式 */
.el-button {
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-1px);
}

.el-button:active {
  transform: translateY(0);
}

/* 输入框样式 */
.el-input__inner {
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  transition: all 0.3s ease;
}

.el-input__inner:focus {
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.2);
}

/* 表格样式 */
.el-table {
  border-radius: 0.75rem;
}

.el-table__header th {
  background-color: var(--gray-100);
  font-weight: 600;
}

.el-table__row {
  transition: all 0.2s ease;
}

.el-table__row:hover {
  background-color: rgba(64, 158, 255, 0.05);
}

/* 分页样式 */
.el-pagination {
  margin-top: 1rem;
}

/* 弹窗样式 */
.el-dialog {
  border-radius: 0.75rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.el-dialog__header {
  background-color: var(--gray-100);
  border-radius: 0.75rem 0.75rem 0 0;
  padding: 1rem 1.5rem;
}

.el-dialog__title {
  font-weight: 600;
}

.el-dialog__body {
  padding: 1.5rem;
}

.el-dialog__footer {
  padding: 0 1.5rem 1.5rem;
}

/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease forwards;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .max-w-7xl.mx-auto {
    padding: 0 1rem;
  }
  
  .flex.flex-col.md:flex-row {
    flex-direction: column;
  }
  
  .w-full.md:w-auto {
    width: 100%;
    margin-top: 1rem;
  }
  
  .el-dialog {
    width: 90% !important;
  }
}
</style>