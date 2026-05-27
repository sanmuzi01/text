<template>
  <div class="password-management bg-gray-50 min-h-screen p-6 sm:p-10">
    <div class="max-w-7xl mx-auto">
      <!-- 顶部栏 -->
      <div class="mb-8 flex items-center justify-between">
        <h1 class="text-3xl font-extrabold text-gray-800">密码管理</h1>
      </div>

      <!-- 操作区：搜索框改为「输入框+独立按钮」布局 -->
      <div class="bg-white rounded-xl shadow-lg p-5 sm:p-6 mb-6 flex flex-col sm:flex-row gap-4">
        <!-- 搜索区域 -->
        <div class="flex-1 max-w-xl">
          <div class="flex items-center gap-2">
            <el-input
              v-model="searchQuery"
              placeholder="搜索用户名"
              class="flex-1 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
              prefix-icon="el-icon-search"
            />
            <el-button
              type="primary"
              size="mini"
              @click="handleSearch"
              class="rounded-md hover:bg-blue-600 transition-colors"
            >
              搜索
            </el-button>
          </div>
        </div>

        <!-- 批量操作 -->
        <div class="flex items-center gap-3">
          <el-button 
            type="success" 
             
            @click="batchUpdate"
            class="px-5 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            批量重置
          </el-button>
        </div>
      </div>

      <!-- 表格区 -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <el-table
          :data="passwordList"
          stripe
          border
          fit
          highlight-current-row
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
          :header-cell-style="{ 
            background: '#eef4ff', 
            color: '#333', 
            fontWeight: '600' 
          }"
          :row-style="{ minHeight: '68px' }"
          :cell-style="{ padding: '0.75rem 1rem' }"
          class="w-full"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <el-table-column prop="username" label="用户名" width="140" align="center" />
          <el-table-column prop="createTime" label="创建时间" width="340" align="center" />
          <el-table-column prop="updateTime" label="重置时间" width="340" align="center" />
          <el-table-column label="操作" width="180" align="center">
            <template #default="scope">
              <el-button 
                type="primary" 
                size="mini" 
                @click.stop="handleUpdate(scope.row)"
                class="mr-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                重置
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="p-5 flex justify-between items-center border-t border-gray-100">
          <div class="text-sm text-gray-500">
            共 {{ total }} 条记录
          </div>
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            class="bg-white rounded-md shadow-sm px-4 py-2"
          />
        </div>
      </div>

      <!-- 删除确认对话框 -->
      <el-dialog
        v-model="deleteDialogVisible"
        title="危险操作警告"
        width="340px"
        :before-close="handleCloseDeleteDialog"
      >
        <template #content>
          <div class="flex items-start gap-3">
            <el-icon-warning class="text-red-500 text-3xl mt-1" />
            <div>
              <p class="text-lg font-medium text-gray-800">删除不可恢复！</p>
              <p class="text-sm text-gray-600 mt-1">确定要删除该密码信息吗？</p>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end gap-3">
            <el-button 
              @click="deleteDialogVisible = false"
              class="rounded-md hover:bg-gray-200 transition-colors"
            >
              取消
            </el-button>
            <el-button 
              type="danger" 
              @click="handleConfirmDelete"
              class="rounded-md hover:bg-red-600 transition-colors"
            >
              确认删除
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 模拟数据
const mockPasswords = [
  {
    id: 1,
    username: 'admin123',
    password: 'admin123',
    createTime: '2023-01-15 09:30:00',
    updateTime: '2023-01-15 09:30:00'
  },
  {
    id: 2,
    username: 'user1',
    password: 'password1',
    createTime: '2023-01-16 14:15:00',
    updateTime: '2023-01-18 10:45:00'
  },
  {
    id: 3,
    username: 'user2',
    password: 'password2',
    createTime: '2023-01-17 16:20:00',
    updateTime: '2023-01-17 16:20:00'
  },
  {
    id: 4,
    username: 'user3',
    password: 'password3',
    createTime: '2023-01-18 11:05:00',
    updateTime: '2023-01-20 15:30:00'
  },
  {
    id: 5,
    username: 'user4',
    password: 'password4',
    createTime: '2023-01-19 13:40:00',
    updateTime: '2023-01-19 13:40:00'
  }
]

// 状态管理
const passwordList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
const selectedRows = ref([])

// 对话框状态
const deleteDialogVisible = ref(false)

// 模拟数据存储
let mockData = [...mockPasswords]

// 监听搜索条件变化
watch(searchQuery, () => {
  currentPage.value = 1
  fetchPasswordList()
})

// 初始化加载
onMounted(() => {
  fetchPasswordList()
})

// 获取密码列表（模拟接口）
const fetchPasswordList = () => {
  setTimeout(() => {
    let filteredData = mockData
    if (searchQuery.value) {
      filteredData = filteredData.filter(item => 
        item.username.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    }
    
    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    
    passwordList.value = filteredData.slice(startIndex, endIndex)
    total.value = filteredData.length
  }, 300)
}

// 分页事件
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  fetchPasswordList()
}
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  fetchPasswordList()
}

// 搜索事件
const handleSearch = () => {
  currentPage.value = 1
  fetchPasswordList()
}

// 表格选择事件
const handleSelectionChange = (rows) => {
  selectedRows.value = rows
}

// 单行重置
const handleUpdate = (row) => {
  ElMessage.success(`已成功重置用户 ${row.username} 的密码`)
  const index = mockData.findIndex(item => item.id === row.id)
  if (index !== -1) {
    mockData[index].updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
    fetchPasswordList()
  }
}

// 批量重置
const batchUpdate = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要重置的密码')
    return
  }
  
  ElMessageBox.confirm(
    `确定要重置选中的 ${selectedRows.value.length} 条密码？`,
    '批量操作确认',
    { type: 'warning' }
  )
  .then(() => {
    selectedRows.value.forEach(row => {
      const index = mockData.findIndex(item => item.id === row.id)
      if (index !== -1) {
        mockData[index].updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
    })
    fetchPasswordList()
    ElMessage.success(`成功重置 ${selectedRows.value.length} 条密码`)
  })
  .catch(() => {})
}

// 删除对话框关闭
const handleCloseDeleteDialog = (done) => {
  deleteDialogVisible.value = false
  done()
}

// 行点击事件（保留扩展能力）
const handleRowClick = (row) => {
  // 可扩展查看详情等功能
}
</script>

<style scoped>
/* 全局样式增强 */
.password-management {
  font-family: 'Microsoft Yahei', sans-serif;
}

/* 搜索区布局优化 */
.flex-1 .flex {
  align-items: stretch; /* 确保输入框和按钮高度一致 */
}

/* 表格交互优化 */
.el-table {
  &__row {
    transition: background-color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    &:hover {
      background-color: #f1f8ff;
    }
  }
  &__cell {
    border-bottom: 1px solid #eee;
  }
}

/* 按钮样式重写 */
.el-button {
  &--primary {
    background: linear-gradient(135deg, #4299e1, #3182ce);
    border: none;
    &:hover {
      background: linear-gradient(135deg, #3182ce, #2b6cb0);
    }
  }
  &--success {
    background: linear-gradient(135deg, #48bb78, #38a169);
    border: none;
    &:hover {
      background: linear-gradient(135deg, #38a169, #2f855a);
    }
  }
  &--danger {
    background: linear-gradient(135deg, #f56565, #e53e3e);
    border: none;
    &:hover {
      background: linear-gradient(135deg, #e53e3e, #c53030);
    }
  }
  &--mini {
    padding: 0.3rem 0.8rem;
  }
}

/* 对话框样式增强 */
.el-dialog {
  &__header {
    border-bottom: 1px solid #e5e7eb;
    padding: 1.25rem;
  }
  &__title {
    font-size: 1.125rem;
    font-weight: 600;
  }
  &__body {
    padding: 1.5rem;
  }
}

/* 分页组件适配 */
.el-pagination {
  &::v-deep .el-pagination__sizes {
    margin: 0 1rem;
  }
  &::v-deep .el-pagination__btn {
    border-radius: 6px;
  }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .el-table {
    font-size: 0.875rem;
  }
  .el-pagination {
    font-size: 0.875rem;
  }
  /* 小屏幕下搜索区垂直排列 */
  .flex-1 .flex {
    flex-direction: column;
    gap: 1rem;
  }
  .el-input {
    width: 100% !important;
  }
}
</style>