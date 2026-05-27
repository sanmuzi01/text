<template>
  <div class="course-management">
    <!-- 顶部操作区 -->
    <div class="header-section">
      <h2 class="page-title">普通课程信息管理</h2>
      <el-button type="primary" @click="openAddModal" class="primary-btn">
        <i class="fas fa-plus mr-2"></i>添加课程
      </el-button>
    </div>

    <!-- 搜索表单卡片 -->
    <div class="search-card">
      <el-form :model="searchParams" class="search-form" inline>
        <el-form-item label="课程名称">
          <el-input 
            v-model="searchParams.courseName" 
            placeholder="请输入课程名称" 
            clearable 
            class="custom-input"
          />
        </el-form-item>
        <el-form-item label="负责教练">
          <el-input 
            v-model="searchParams.coachName" 
            placeholder="请输入教练姓名" 
            clearable 
            class="custom-input"
          />
        </el-form-item>
        <el-form-item label="健身器材">
          <el-input 
            v-model="searchParams.equipmentName" 
            placeholder="请输入器材名称" 
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
        
        <el-table-column label="教练" align="center" min-width="120">
          <template #default="scope">
            <div class="coach-info">
              <el-avatar :src="scope.row.coachAvatar" size="40" class="coach-avatar" />
              <span class="coach-name">{{ scope.row.coachName }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="courseName" label="课程名称" min-width="150" align="center"/>
        
        <el-table-column prop="courseTime" label="课程时间" min-width="200" />
        
        <el-table-column label="健身器材" align="center" min-width="180">
          <template #default="scope">
            <div class="equipment-tags">
              <el-tag 
                v-for="(equip, index) in scope.row.equipment" 
                :key="index" 
                type="success" 
                size="mini"
                class="equipment-tag"
              >
                {{ equip }}
              </el-tag>
            </div>
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
          <el-input v-model="formData.courseName" placeholder="请输入课程名称" class="custom-input" />
        </el-form-item>
        <el-form-item label="课程时间" prop="courseTime">
          <el-input v-model="formData.courseTime" placeholder="请输入课程时间" class="custom-input" />
        </el-form-item>
        <el-form-item label="负责教练" prop="coachName">
          <el-input v-model="formData.coachName" placeholder="请输入负责教练" class="custom-input" />
        </el-form-item>
        <el-form-item label="健身器材" prop="equipment">
          <el-input 
            v-model="formData.equipmentStr" 
            placeholder="请输入器材名称，多个器材用逗号分隔" 
            class="custom-input"
          />
          <div class="equipment-tags" v-if="formData.equipmentStr">
            <el-tag 
              v-for="(equip, index) in formData.equipmentStr.split(',')" 
              :key="index" 
              type="info" 
              size="mini"
              closable
              @close="removeEquipment(index)"
              class="form-equipment-tag"
            >
              {{ equip }}
            </el-tag>
          </div>
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
        <p>确定要删除课程「{{ deleteCourseName }}」吗？</p>
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

// 初始化数据（保持不变）
const initialData = [
  { 
    id: 1, 
    courseName: '一对一肌肉塑形', 
    courseTime: '每周一、三、五 19:00-20:30', 
    coachName: '张健', 
    coachAvatar: 'https://picsum.photos/seed/coach1/40/40', 
    equipment: ['杠铃', '哑铃', '卧推凳'], 
    createTime: Date.now() - 18 * 86400 * 1000 
  },
  { 
    id: 2, 
    courseName: '核心力量训练', 
    courseTime: '每周二、四 18:30-20:00', 
    coachName: '李娜', 
    coachAvatar: 'https://picsum.photos/seed/coach2/40/40', 
    equipment: ['瑜伽球', '弹力带', '腹肌轮'], 
    createTime: Date.now() - 17 * 86400 * 1000 
  },
  { 
    id: 3, 
    courseName: '有氧舞蹈', 
    courseTime: '每周三、六 10:00-11:30', 
    coachName: '王丽', 
    coachAvatar: 'https://picsum.photos/seed/coach3/40/40', 
    equipment: ['踏板', '健身球'], 
    createTime: Date.now() - 16 * 86400 * 1000 
  },
  { 
    id: 4, 
    courseName: '普拉提核心训练', 
    courseTime: '每周一、五 15:00-16:30', 
    coachName: '陈芳', 
    coachAvatar: 'https://picsum.photos/seed/coach4/40/40', 
    equipment: ['瑜伽垫', '拉力绳'], 
    createTime: Date.now() - 15 * 86400 * 1000 
  },
  { 
    id: 5, 
    courseName: '拳击健身', 
    courseTime: '每周二、四、六 20:00-21:30', 
    coachName: '赵强', 
    coachAvatar: 'https://picsum.photos/seed/coach5/40/40', 
    equipment: ['沙袋', '拳套', '护具'], 
    createTime: Date.now() - 14 * 86400 * 1000 
  },
  { 
    id: 6, 
    courseName: '亲子瑜伽', 
    courseTime: '每周日 10:00-11:30', 
    coachName: '张敏', 
    coachAvatar: 'https://picsum.photos/seed/coach6/40/40', 
    equipment: ['儿童瑜伽垫', '瑜伽砖'], 
    createTime: Date.now() - 13 * 86400 * 1000 
  },
  { 
    id: 7, 
    courseName: 'HIIT高强度训练', 
    courseTime: '每周一、三、五 06:30-07:30', 
    coachName: '李强', 
    coachAvatar: 'https://picsum.photos/seed/coach7/40/40', 
    equipment: ['跳绳', '哑铃', '健身垫'], 
    createTime: Date.now() - 12 * 86400 * 1000 
  },
  { 
    id: 8, 
    courseName: '动感单车', 
    courseTime: '每周二、四、六 19:30-20:30', 
    coachName: '王刚', 
    coachAvatar: 'https://picsum.photos/seed/coach8/40/40', 
    equipment: ['动感单车'], 
    createTime: Date.now() - 11 * 86400 * 1000 
  },
  { 
    id: 9, 
    courseName: '形体芭蕾', 
    courseTime: '每周三、五 16:00-17:30', 
    coachName: '刘芳', 
    coachAvatar: 'https://picsum.photos/seed/coach9/40/40', 
    equipment: ['把杆', '瑜伽垫'], 
    createTime: Date.now() - 10 * 86400 * 1000 
  },
  { 
    id: 10, 
    courseName: '太极养生', 
    courseTime: '每周一、四 07:00-08:00', 
    coachName: '陈明', 
    coachAvatar: 'https://picsum.photos/seed/coach10/40/40', 
    equipment: [], 
    createTime: Date.now() - 9 * 86400 * 1000 
  }
]

// 本地存储配置（保持不变）
const STORAGE_KEY = 'course_management_data'
let localData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [...initialData]

// 搜索参数（保持不变）
const searchParams = reactive({
  courseName: '',
  coachName: '',
  equipmentName: ''
})

// 表格数据（保持不变）
const tableData = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)

// 弹窗状态（保持不变）
const modalVisible = ref(false)
const modalTitle = ref('添加课程')
const modalType = ref('add') 
const formData = reactive({
  id: null,
  courseName: '',
  courseTime: '',
  coachName: '',
  equipmentStr: '',
  equipment: []
})
const formRef = ref(null)

// 删除弹窗（保持不变）
const deleteModalVisible = ref(false)
const deleteCourseName = ref('')
const deleteCourseId = ref(null)

// 表单验证规则（保持不变）
const formRules = reactive({
  courseName: [
    { required: true, message: '请输入课程名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度需在2-50字符之间', trigger: 'blur' }
  ],
  courseTime: [
    { required: true, message: '请输入课程时间', trigger: 'blur' }
  ],
  coachName: [
    { required: true, message: '请输入负责教练', trigger: 'blur' }
  ],
  equipmentStr: [
    { required: true, message: '请输入健身器材', trigger: 'blur' }
  ]
})

// 数据加载函数（保持不变）
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
      const equipmentMatch = searchParams.equipmentName 
        ? item.equipment.some(equip => equip.includes(searchParams.equipmentName)) 
        : true
      return nameMatch && coachMatch && equipmentMatch
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

// 搜索处理（保持不变）
const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

// 重置搜索（保持不变）
const resetSearch = () => {
  searchParams.courseName = ''
  searchParams.coachName = ''
  searchParams.equipmentName = ''
  currentPage.value = 1
  loadData()
}

// 分页大小变化（保持不变）
const handleSizeChange = (val) => {
  pageSize.value = val
  loadData()
}

// 当前页变化（保持不变）
const handleCurrentChange = (val) => {
  currentPage.value = val
  loadData()
}

// 打开添加弹窗（保持不变）
const openAddModal = () => {
  modalType.value = 'add'
  modalTitle.value = '添加课程'
  formData.id = null
  formData.courseName = ''
  formData.courseTime = ''
  formData.coachName = ''
  formData.equipmentStr = ''
  formData.equipment = []
  modalVisible.value = true
}

// 打开编辑弹窗（保持不变）
const openEditModal = (row) => {
  modalType.value = 'edit'
  modalTitle.value = '编辑课程'
  formData.id = row.id
  formData.courseName = row.courseName
  formData.courseTime = row.courseTime
  formData.coachName = row.coachName
  formData.equipment = [...row.equipment]
  formData.equipmentStr = row.equipment.join(',')
  modalVisible.value = true
}

// 删除器材标签（保持不变）
const removeEquipment = (index) => {
  const equipmentArray = formData.equipmentStr.split(',')
  equipmentArray.splice(index, 1)
  formData.equipmentStr = equipmentArray.join(',')
}

// 提交表单（保持不变）
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return

    const action = modalType.value === 'add' ? '添加' : '编辑'
    try {
      await ElMessageBox.confirm(
        `确定要${action}该课程吗？<br><span class="text-gray-500 text-sm">操作后ID将重新排序</span>`,
        '操作确认',
        { type: 'warning', dangerouslyUseHTMLString: true }
      )
    } catch (e) {
      return
    }

    // 处理器材字符串转数组
    const equipmentArray = formData.equipmentStr.split(',').filter(equip => equip.trim())
    
    if (modalType.value === 'add') {
      // 新增逻辑
      localData.push({
        ...formData,
        id: null,
        equipment: equipmentArray,
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
          equipment: equipmentArray,
          coachAvatar: originalItem.coachAvatar,
          createTime: originalItem.createTime
        })
      } else {
        ElMessage.error('课程不存在，请刷新重试！')
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
    ElMessage.success(`${action}课程成功！ID已重新排序`)
  })
}

// 显示删除确认（保持不变）
const showDeleteConfirm = (row) => {
  deleteCourseName.value = row.courseName
  deleteCourseId.value = row.id
  deleteModalVisible.value = true
}

// 确认删除（保持不变）
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
  ElMessage.success('课程删除成功！ID已重新排序')
}

// 初始化加载（保持不变）
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.course-management {
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

/* 标签样式 */
.equipment-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.equipment-tag {
  background-color: #ecfdf5;
  color: #059669;
  border-color: #d1fae5;
  border-radius: 12px;
  padding: 2px 8px;
}

.form-equipment-tag {
  background-color: #eff6ff;
  color: #2563eb;
  border-color: #dbeafe;
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

.coach-name {
  font-size: 14px;
  color: #334155;
  margin-left: 8px;
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
    flex-direction: column;
    gap: 4px;
  }

  .button-group .el-button--mini {
    width: 100%;
  }
}
</style>