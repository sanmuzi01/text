<template>
  <div class="private-coach-management">
    <!-- 顶部操作区 -->
    <div class="header-section">
      <h2 class="page-title">私人助教课程管理</h2>
      <el-button type="primary" @click="openAddModal" class="primary-btn">
        <i class="fas fa-plus mr-2"></i>添加私教课程
      </el-button>
    </div>

    <!-- 搜索表单卡片 -->
    <div class="search-card">
      <el-form :model="searchParams" class="search-form" inline>
        <el-form-item label="课程名称">
          <el-input 
            v-model="searchParams.courseName" 
            placeholder="请输入私教课程名称" 
            clearable 
            class="custom-input"
          />
        </el-form-item>
        <el-form-item label="专属教练">
          <el-input 
            v-model="searchParams.coachName" 
            placeholder="请输入教练姓名" 
            clearable 
            class="custom-input"
          />
        </el-form-item>
        <el-form-item label="课程类型">
          <el-input 
            v-model="searchParams.courseType" 
            placeholder="请输入课程类型" 
            clearable 
            class="custom-input"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" class="search-btn">
            <i class="fas fa-search mr-1"></i>搜索
          </el-button>
          <el-button @click="resetSearch" class="reset-btn">
            <i class="fas fa-refresh mr-1"></i>重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 课程列表卡片 -->
    <div class="table-card">
      <el-table 
        :data="tableData" 
        border 
        stripe 
        style="width: 100%" 
        :loading="loading"
        class="custom-table"
      >
        <el-table-column prop="id" label="ID" width="80" align="center" />
        
        <el-table-column label="专属教练" align="center" min-width="140">
          <template #default="scope">
            <div class="coach-info">
              <el-avatar :src="scope.row.coachAvatar" size="40" class="coach-avatar" />
              <div class="coach-detail">
                <div class="coach-name">{{ scope.row.coachName }}</div>
                <div class="coach-level text-xs text-gray-500">{{ scope.row.coachLevel }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="courseName" label="课程名称" min-width="150" align="center"/>
        
        <el-table-column prop="courseTime" label="课程时间" min-width="200" />
        
        <el-table-column label="课程类型" align="center" min-width="120">
          <template #default="scope">
            <el-tag 
              :type="scope.row.typeColor" 
              size="mini"
              class="type-tag"
            >
              {{ scope.row.courseType }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <div class="button-group">
              <el-button 
                type="primary" 
                size="mini" 
                @click="openEditModal(scope.row)"
                class="edit-btn"
              >
                <i class="fas fa-edit mr-1"></i>编辑
              </el-button>
              <el-button 
                type="danger" 
                size="mini" 
                @click="showDeleteConfirm(scope.row)"
                class="delete-btn"
              >
                <i class="fas fa-trash mr-1"></i>删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页组件 -->
    <div class="pagination-wrap">
      <span class="total-count">共 {{ total }} 条记录</span>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="pagination"
      />
    </div>

    <!-- 添加/编辑弹窗 -->
    <el-dialog 
      v-model="modalVisible" 
      :title="modalTitle" 
      width="500px"
      class="custom-dialog"
    >
      <el-form 
        :model="formData" 
        :rules="formRules" 
        ref="formRef" 
        label-width="120px"
        class="modal-form"
      >
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="formData.courseName" placeholder="请输入私教课程名称" class="custom-input" />
        </el-form-item>
        <el-form-item label="课程时间" prop="courseTime">
          <el-input v-model="formData.courseTime" placeholder="请输入课程时间" class="custom-input" />
        </el-form-item>
        <el-form-item label="专属教练" prop="coachName">
          <el-input v-model="formData.coachName" placeholder="请输入专属教练姓名" class="custom-input" />
        </el-form-item>
        <el-form-item label="教练等级" prop="coachLevel">
          <el-select v-model="formData.coachLevel" placeholder="请选择教练等级" class="custom-input">
            <el-option label="初级教练" value="初级教练"></el-option>
            <el-option label="中级教练" value="中级教练"></el-option>
            <el-option label="高级教练" value="高级教练"></el-option>
            <el-option label="金牌教练" value="金牌教练"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程类型" prop="courseType">
          <el-input v-model="formData.courseType" placeholder="请输入课程类型（如：力量训练、有氧训练）" class="custom-input" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="modalVisible = false" class="cancel-btn">取消</el-button>
          <el-button type="primary" @click="submitForm" class="confirm-btn">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除确认弹窗 -->
    <el-dialog 
      v-model="deleteModalVisible" 
      title="确认删除" 
      width="350px"
      class="custom-dialog"
    >
      <div class="delete-confirm-content">
        <i class="fas fa-exclamation-triangle text-orange-500 text-2xl mb-3"></i>
        <p>确定要删除私教课程「{{ deleteCourseName }}」吗？</p>
        <p class="text-sm text-gray-500 mt-2">删除后ID将重新从1开始排序</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteModalVisible = false" class="cancel-btn">取消</el-button>
          <el-button type="danger" @click="confirmDelete" class="delete-confirm-btn">确定删除</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 初始化数据
const initialData = [
  { 
    id: 1, 
    courseName: '一对一肌肉塑形', 
    courseTime: '每周一、三、五 19:00-20:30', 
    coachName: '张健', 
    coachAvatar: 'https://picsum.photos/seed/coach1/40/40', 
    coachLevel: '高级教练',
    courseType: '力量训练',
    createTime: Date.now() - 18 * 86400 * 1000 
  },
  { 
    id: 2, 
    courseName: '核心力量训练', 
    courseTime: '每周二、四 18:30-20:00', 
    coachName: '李娜', 
    coachAvatar: 'https://picsum.photos/seed/coach2/40/40', 
    coachLevel: '金牌教练',
    courseType: '核心训练',
    createTime: Date.now() - 17 * 86400 * 1000 
  },
  { 
    id: 3, 
    courseName: '有氧舞蹈私教', 
    courseTime: '每周三、六 10:00-11:30', 
    coachName: '王丽', 
    coachAvatar: 'https://picsum.photos/seed/coach3/40/40', 
    coachLevel: '中级教练',
    courseType: '有氧训练',
    createTime: Date.now() - 16 * 86400 * 1000 
  },
  { 
    id: 4, 
    courseName: '普拉提核心训练', 
    courseTime: '每周一、五 15:00-16:30', 
    coachName: '陈芳', 
    coachAvatar: 'https://picsum.photos/seed/coach4/40/40', 
    coachLevel: '高级教练',
    courseType: '柔韧性训练',
    createTime: Date.now() - 15 * 86400 * 1000 
  },
  { 
    id: 5, 
    courseName: '拳击健身私教', 
    courseTime: '每周二、四、六 20:00-21:30', 
    coachName: '赵强', 
    coachAvatar: 'https://picsum.photos/seed/coach5/40/40', 
    coachLevel: '金牌教练',
    courseType: '格斗训练',
    createTime: Date.now() - 14 * 86400 * 1000 
  }
]

// 本地存储配置
const STORAGE_KEY = 'private_coach_course_data'
let localData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [...initialData]

// 搜索参数
const searchParams = reactive({
  courseName: '',
  coachName: '',
  courseType: ''
})

// 表格数据
const tableData = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)

// 弹窗状态
const modalVisible = ref(false)
const modalTitle = ref('添加私教课程')
const modalType = ref('add') 
const formData = reactive({
  id: null,
  courseName: '',
  courseTime: '',
  coachName: '',
  coachLevel: '',
  courseType: ''
})
const formRef = ref(null)

// 删除弹窗
const deleteModalVisible = ref(false)
const deleteCourseName = ref('')
const deleteCourseId = ref(null)

// 表单验证规则
const formRules = reactive({
  courseName: [
    { required: true, message: '请输入课程名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度需在2-50字符之间', trigger: 'blur' }
  ],
  courseTime: [
    { required: true, message: '请输入课程时间', trigger: 'blur' }
  ],
  coachName: [
    { required: true, message: '请输入专属教练', trigger: 'blur' }
  ],
  coachLevel: [
    { required: true, message: '请选择教练等级', trigger: 'change' }
  ],
  courseType: [
    { required: true, message: '请输入课程类型', trigger: 'blur' }
  ]
})

// 数据加载函数
const loadData = () => {
  loading.value = true
  nextTick(() => {
    // 数据过滤
    const filtered = localData.filter(item => {
      const nameMatch = searchParams.courseName 
        ? item.courseName.includes(searchParams.courseName) 
        : true
      const coachMatch = searchParams.coachName 
        ? item.coachName.includes(searchParams.coachName) 
        : true
      const typeMatch = searchParams.courseType 
        ? item.courseType.includes(searchParams.courseType) 
        : true
      return nameMatch && coachMatch && typeMatch
    })

    // 排序逻辑
    filtered.sort((a, b) => {
      if (b.createTime !== a.createTime) {
        return b.createTime - a.createTime
      } else {
        return b.id - a.id
      }
    })

    // 分页处理
    total.value = filtered.length
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    tableData.value = filtered.slice(start, end)
    
    loading.value = false
  })
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

// 重置搜索
const resetSearch = () => {
  searchParams.courseName = ''
  searchParams.coachName = ''
  searchParams.courseType = ''
  currentPage.value = 1
  loadData()
}

// 分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  loadData()
}

// 当前页变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  loadData()
}

// 打开添加弹窗
const openAddModal = () => {
  modalType.value = 'add'
  modalTitle.value = '添加私教课程'
  formData.id = null
  formData.courseName = ''
  formData.courseTime = ''
  formData.coachName = ''
  formData.coachLevel = ''
  formData.courseType = ''
  modalVisible.value = true
}

// 打开编辑弹窗
const openEditModal = (row) => {
  modalType.value = 'edit'
  modalTitle.value = '编辑私教课程'
  formData.id = row.id
  formData.courseName = row.courseName
  formData.courseTime = row.courseTime
  formData.coachName = row.coachName
  formData.coachLevel = row.coachLevel
  formData.courseType = row.courseType
  modalVisible.value = true
}

// 提交表单
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return

    const action = modalType.value === 'add' ? '添加' : '编辑'
    try {
      await ElMessageBox.confirm(
        `确定要${action}该私教课程吗？<br><span class="text-gray-500 text-sm">操作后ID将重新排序</span>`,
        '操作确认',
        { type: 'warning', dangerouslyUseHTMLString: true }
      )
    } catch (e) {
      return
    }

    if (modalType.value === 'add') {
      // 新增逻辑
      localData.push({
        ...formData,
        id: null,
        coachAvatar: `https://picsum.photos/seed/coach${localData.length + 1}/40/40`,
        createTime: Date.now()
      })
    } else {
      // 编辑逻辑
      const index = localData.findIndex(item => item.id === formData.id)
      if (index !== -1) {
        const originalItem = localData[index]
        localData.splice(index, 1, {
          ...formData,
          coachAvatar: originalItem.coachAvatar,
          createTime: originalItem.createTime
        })
      } else {
        ElMessage.error('私教课程不存在，请刷新重试！')
        modalVisible.value = false
        return
      }
    }

    // 重新排序并重置ID
    localData.sort((a, b) => {
      if (b.createTime !== a.createTime) {
        return b.createTime - a.createTime
      } else {
        return b.id - a.id
      }
    })
    localData.forEach((item, index) => {
      item.id = index + 1
    })

    // 保存到本地存储
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localData))
    // 刷新数据
    loadData()
    // 关闭弹窗
    modalVisible.value = false
    ElMessage.success(`${action}私教课程成功！ID已重新排序`)
  })
}

// 显示删除确认
const showDeleteConfirm = (row) => {
  deleteCourseName.value = row.courseName
  deleteCourseId.value = row.id
  deleteModalVisible.value = true
}

// 确认删除
const confirmDelete = () => {
  // 删除数据
  localData = localData.filter(item => item.id !== deleteCourseId.value)
  
  // 重新排序并重置ID
  localData.sort((a, b) => {
    if (b.createTime !== a.createTime) {
      return b.createTime - a.createTime
    } else {
      return b.id - a.id
    }
  })
  localData.forEach((item, index) => {
    item.id = index + 1
  })

  // 保存到本地存储
  localStorage.setItem(STORAGE_KEY, JSON.stringify(localData))
  // 刷新数据
  loadData()
  deleteModalVisible.value = false
  ElMessage.success('私教课程删除成功！ID已重新排序')
}

// 初始化加载
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.private-coach-management {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 顶部操作区 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: center;
}

.page-title::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: #ffd700;
  border-radius: 2px;
  margin-right: 12px;
}

/* 搜索卡片 */
.search-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

/* 表格样式 */
.table-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
}

.custom-table {
  border-collapse: separate;
  border-spacing: 0;
}

.custom-table th {
  background-color: #f8fafc;
  color: #334155;
  font-weight: 500;
  font-size: 14px;
  padding: 12px 8px;
}

.custom-table td {
  padding: 14px 8px;
  vertical-align: middle;
  transition: background-color 0.2s;
}

.custom-table tr:hover td {
  background-color: #f8fafc;
}

/* 分页样式 */
.pagination-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  color: #64748b;
}

.total-count {
  font-size: 14px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}

/* 按钮样式 */
.primary-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: none;
  color: #fff;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.primary-btn:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  color: #fff;
}

.search-btn {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
  border-radius: 6px;
  transition: all 0.2s;
}

.search-btn:hover {
  background-color: #2563eb;
  border-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  color: #fff;
}

.reset-btn {
  background-color: #f1f5f9;
  border-color: #e2e8f0;
  color: #334155;
  border-radius: 6px;
  transition: all 0.2s;
}

.reset-btn:hover {
  background-color: #e2e8f0;
  transform: translateY(-1px);
}

.edit-btn {
  background-color: #38bdf8;
  border-color: #38bdf8;
  color: #fff;
  border-radius: 4px;
  transition: all 0.2s;
}

.edit-btn:hover {
  background-color: #0ea5e9;
  border-color: #0ea5e9;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(56, 189, 248, 0.3);
  color: #fff;
}

.delete-btn {
  background-color: #f87171;
  border-color: #f87171;
  color: #fff;
  border-radius: 4px;
  transition: all 0.2s;
}

.delete-btn:hover {
  background-color: #ef4444;
  border-color: #ef4444;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(248, 113, 113, 0.3);
  color: #fff;
}

/* 弹窗样式 */
.custom-dialog {
  border-radius: 12px;
  overflow: hidden;
}

.custom-dialog .el-dialog__header {
  background-color: #f8fafc;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.custom-dialog .el-dialog__title {
  font-size: 18px;
  color: #1e293b;
  font-weight: 500;
}

.modal-form {
  padding-top: 16px;
}

/* 输入框样式 */
.custom-input {
  border-radius: 6px;
  border-color: #e2e8f0;
  transition: all 0.2s;
}

.custom-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

/* 教练信息样式 */
.coach-info {
  display: flex;
  align-items: center;
  justify-content: center;
}

.coach-avatar {
  width: 40px;
  height: 40px;
  border: 2px solid #e0f2fe;
}

.coach-detail {
  margin-left: 8px;
  text-align: left;
}

.coach-name {
  font-size: 14px;
  color: #334155;
  font-weight: 500;
}

.coach-level {
  font-size: 12px;
  color: #64748b;
}

/* 类型标签样式 */
.type-tag {
  border-radius: 12px;
  padding: 2px 8px;
}

/* 弹窗按钮 */
.dialog-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
}

.cancel-btn {
  background-color: #f1f5f9;
  border-color: #e2e8f0;
  color: #334155;
  border-radius: 6px;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background-color: #e2e8f0;
}

.confirm-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: none;
  color: #fff;
  border-radius: 6px;
  transition: all 0.2s;
}

.confirm-btn:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  color: #fff;
}

.delete-confirm-btn {
  background-color: #f87171;
  border-color: #f87171;
  color: #fff;
  border-radius: 6px;
  transition: all 0.2s;
}

.delete-confirm-btn:hover {
  background-color: #ef4444;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  color: #fff;
}

.delete-confirm-content {
  text-align: center;
  padding: 16px 0;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 16px;
  }

  .search-form {
    flex-direction: column;
    align-items: stretch;
  }

  .pagination-wrap {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .pagination {
    width: 100%;
    justify-content: center;
  }

  .button-group {
    display: flex;
    gap: 4px;
  }

  .button-group .el-button--mini {
    flex: 1;
  }
}
</style>