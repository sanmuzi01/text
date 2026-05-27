<template>
  <div class="account-security-management">
    <el-card class="page-card" shadow="hover">
      <template #header>
        <div class="card-header flex items-center justify-between">
          <span class="text-lg font-bold text-gray-800">账号安全管理</span>
          <el-button type="primary" size="small" @click="addAccount">
            <i class="el-icon-plus mr-1"></i>添加账号
          </el-button>
        </div>
      </template>
      
      <div class="overflow-x-auto">
        <el-table
          :data="pagedAccountList"
          border
          stripe
          style="width: 100%"
          :header-cell-style="{ background: '#f8fafc', color: '#4b5563', fontWeight: 'bold' }"
          :row-class-name="tableRowClassName"
          :empty-text="emptyText"
        >
          <el-table-column prop="username" label="账号名" align="center" min-width="120" />
          <el-table-column label="权限" align="center" min-width="280">
            <template #default="{ row }">
              <div class="flex flex-wrap justify-center gap-1">
                <el-tag
                  v-for="(item, index) in formatPermissions(row.permissions)"
                  :key="index"
                  type="info"
                  class="px-2 py-1 text-sm"
                  effect="light"
                >
                  {{ item }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="150">
            <template #default="{ row }">
              <el-button
                type="primary"
                size="mini"
                @click="handleEditPermission(row)"
                class="mr-2"
                :disabled="row.username === 'admin'"
                :class="{ 'opacity-50 cursor-not-allowed': row.username === 'admin' }"
              >
                <i class="el-icon-edit mr-1"></i>修改权限
              </el-button>
              <el-button
                type="danger"
                size="mini"
                @click="handleDeleteAccount(row)"
                :disabled="row.username === 'admin'"
                :class="{ 'opacity-50 cursor-not-allowed': row.username === 'admin' }"
              >
                <i class="el-icon-delete mr-1"></i>删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <div class="mt-4 flex justify-between items-center">
        <div class="text-sm text-gray-500">
          共 {{ accountList.length }} 个账号
        </div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="accountList.length"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 添加账号弹窗 -->
    <el-dialog title="添加新账号" v-model="addDialogVisible" width="400px">
      <el-form :model="newAccount" ref="accountForm" :rules="formRules" label-width="100px">
        <el-form-item label="账号名" prop="username">
          <el-input v-model="newAccount.username" placeholder="请输入账号名"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddAccount">确认添加</el-button>
      </template>
    </el-dialog>

    <!-- 抽屉组件：修改权限 -->
    <el-drawer
      title="修改权限"
      v-model="drawerVisible"
      direction="rtl"
      :size="500"
      :before-close="handleDrawerClose"
    >
      <div class="p-4">
        <div class="mb-4">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索权限..."
            prefix-icon="el-icon-search"
            clearable
            @clear="handleSearchClear"
            @keyup.enter="handleSearch"
          ></el-input>
        </div>
        <div class="h-[400px] overflow-auto border rounded-md p-2">
          <el-tree
            ref="permissionTree"
            :data="permissionTreeData"
            show-checkbox
            node-key="id"
            :default-checked-keys="checkedPermissionIds"
            :props="treeProps"
            @check-change="handleCheckChange"
            :filter-node-method="filterNode"
            v-if="drawerVisible"
          />
        </div>
      </div>
      <template #footer>
        <div class="drawer-footer">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" @click="savePermission">保存</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 模拟本地账号数据
const accountList = ref([
  {
    username: 'admin',
    permissions: ['个人中心/个人资料', '个人中心/消息通知', '账号管理/账号安全', '账号管理/密码重置', '课程管理/普通课程信息', '课程管理/私教课程信息'],
    id: 1
  },
  {
    username: 'editor',
    permissions: ['个人中心/个人资料', '课程管理/普通课程信息', '课程管理/私教课程信息'],
    id: 2
  },
  {
    username: 'reviewer',
    permissions: ['课程管理/普通课程信息', '教练管理/教练信息'],
    id: 3
  },
  {
    username: 'analyst',
    permissions: ['账号管理/账号安全', '会员卡管理/会员管理', '课程管理/普通课程信息'],
    id: 4
  },
  {
    username: 'operator',
    permissions: ['个人中心/个人资料', '健身房信息管理/健身房列表', '会员卡管理/会员管理'],
    id: 5
  }
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(5)
const pagedAccountList = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  return accountList.value.slice(startIndex, startIndex + pageSize.value)
})

// 空状态文本
const emptyText = computed(() => {
  return accountList.value.length === 0 ? '暂无账号数据' : '暂无匹配数据'
})

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 抽屉状态
const drawerVisible = ref(false)
// 当前编辑的账号索引和ID
const currentEditIndex = ref(-1)
const currentEditId = ref(null)

// 显式定义Ref
const accountForm = ref(null)
const permissionTree = ref(null)

// 添加账号相关
const addDialogVisible = ref(false)
const newAccount = ref({
  username: ''
})

// 检查用户名唯一性
const checkUsernameUnique = (rule, value, callback) => {
  if (!value) return callback()
  
  const exists = accountList.value.some(item => item.username === value)
  if (exists) {
    callback(new Error('该账号名已存在'))
  } else {
    callback()
  }
}

// 定义表单规则（此时 checkUsernameUnique 已定义）
const formRules = ref({
  username: [
    { required: true, message: '请输入账号名', trigger: 'blur' },
    { validator: checkUsernameUnique, trigger: 'blur' }
  ]
})

// 打开添加账号对话框
const addAccount = () => {
  newAccount.value = { username: '' }
  addDialogVisible.value = true
  nextTick(() => {
    const form = document.querySelector('.el-dialog .el-input__inner')
    form && form.focus()
  })
}

// 确认添加账号
const confirmAddAccount = () => {
  if (!accountForm.value) return
  
  accountForm.value.validate((valid) => {
    if (valid) {
      const newId = Math.max(...accountList.value.map(item => item.id), 0) + 1
      accountList.value.push({
        username: newAccount.value.username,
        permissions: [],
        id: newId
      })
      addDialogVisible.value = false
      ElMessage.success('账号添加成功')
    }
  })
}

// 删除账号
const handleDeleteAccount = (row) => {
  if (row.username === 'admin') {
    ElMessage.warning('不能删除管理员账号')
    return
  }
  
  ElMessageBox.confirm(
    `确定要删除账号 ${row.username} 吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    accountList.value = accountList.value.filter(item => item.id !== row.id)
    ElMessage.success('账号已删除')
  }).catch(() => {
    // 取消删除
  })
}

// 权限树相关
const permissionTreeData = ref([
  { 
    id: 1, 
    label: '个人中心', 
    children: [
      { id: 11, label: '个人资料' },
      { id: 12, label: '消息通知' }
    ] 
  },
  { 
    id: 2, 
    label: '账号管理', 
    children: [
      { id: 21, label: '账号安全' },
      { id: 22, label: '密码重置' }
    ] 
  },
  { 
    id: 3, 
    label: '健身房信息管理', 
    children: [
      { id: 31, label: '健身房列表' }
    ] 
  },
  { 
    id: 4, 
    label: '教练管理', 
    children: [
      { id: 41, label: '教练信息' }
    ] 
  },
  { 
    id: 5, 
    label: '课程管理', 
    children: [
      { id: 51, label: '普通课程信息' },
      { id: 52, label: '私教课程信息' }
    ] 
  },
  { 
    id: 6, 
    label: '会员卡管理', 
    children: [
      { id: 61, label: '会员管理' }
    ] 
  }
])

// 搜索权限
const searchKeyword = ref('')

// 过滤节点方法
const filterNode = (value, data) => {
  if (!value) return true
  return data.label.toLowerCase().includes(value.toLowerCase())
}

// 处理搜索
const handleSearch = () => {
  if (!permissionTree.value) return
  permissionTree.value.filter(searchKeyword.value)
}

// 清除搜索
const handleSearchClear = () => {
  searchKeyword.value = ''
  if (permissionTree.value) {
    permissionTree.value.filter('')
  }
}

// 树配置
const treeProps = {
  children: 'children',
  label: 'label'
}

// 选中的权限 ID
const checkedPermissionIds = ref([])

// 格式化权限显示
const formatPermissions = (permissions) => {
  return permissions.map(perm => {
    const [parent, child] = perm.split('/')
    return child ? `${parent}/${child}` : parent
  })
}

// 点击修改权限按钮
const handleEditPermission = (row) => {
  // 找到当前账号的索引
  currentEditIndex.value = accountList.value.findIndex(item => item.id === row.id)
  currentEditId.value = row.id
  drawerVisible.value = true
  
  // 初始化勾选的权限ID
  checkedPermissionIds.value = []
  
  // 匹配权限树中的ID
  permissionTreeData.value.forEach((parent) => {
    // 检查一级菜单
    if (row.permissions.some(perm => perm.startsWith(parent.label))) {
      // 检查二级菜单
      parent.children.forEach(child => {
        if (row.permissions.includes(`${parent.label}/${child.label}`)) {
          checkedPermissionIds.value.push(child.id)
          // 如果有子节点被选中，父节点也需要被选中
          if (!checkedPermissionIds.value.includes(parent.id)) {
            checkedPermissionIds.value.push(parent.id)
          }
        }
      })
    }
  })
  
  // 确保抽屉打开后刷新树
  nextTick(() => {
    if (permissionTree.value) {
      permissionTree.value.setCheckedKeys(checkedPermissionIds.value)
    }
  })
}

// 抽屉关闭前处理
const handleDrawerClose = () => {
  // 清空搜索关键词
  searchKeyword.value = ''
  if (permissionTree.value) {
    permissionTree.value.filter('')
  }
}

// 处理树节点勾选变化
const handleCheckChange = (data, checked) => {
  // 处理父节点勾选逻辑：如果勾选父节点，自动勾选所有子节点
  if (data.children && data.children.length > 0) {
    data.children.forEach(child => {
      if (permissionTree.value) {
        permissionTree.value.setChecked(child.id, checked, false)
      }
    })
  } else if (checked && data.parent) { // 增加 parent 非空判断
    // 如果勾选子节点，自动勾选父节点
    if (permissionTree.value) {
      permissionTree.value.setChecked(data.parent.id, true, false)
    }
  }
}

// 保存权限修改
const savePermission = () => {
  if (!permissionTree.value || currentEditIndex.value === -1) return
  
  // 获取所有勾选的节点（包括半选状态）
  const checkedNodes = permissionTree.value.getCheckedNodes(false, true)
  const selectedPermissions = []
  
  // 只处理二级节点，避免重复添加
  checkedNodes.forEach(node => {
    if (node.children && node.children.length === 0 && node.parent) {
      selectedPermissions.push(`${node.parent.label}/${node.label}`)
    }
  })
  
  // 不可变更新数据
  const newAccountList = [...accountList.value]
  newAccountList[currentEditIndex.value] = {
    ...newAccountList[currentEditIndex.value],
    permissions: selectedPermissions
  }
  
  accountList.value = newAccountList
  ElMessage.success('权限修改成功')
  drawerVisible.value = false
  searchKeyword.value = ''
}

// 表格行样式
const tableRowClassName = ({ row }) => {
  return row.username === 'admin' ? 'admin-row' : ''
}

onMounted(() => {
  console.log('组件已加载')
})
</script>

<style scoped>
.account-security-management {
  padding: 20px;
  background-color: #f9fafb;
  min-height: calc(100vh - 40px);
}

.page-card {
  width: 100%;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.page-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
  font-size: 18px;
}

.el-table {
  border-radius: 6px;
  overflow: hidden;
}

.el-table__row {
  transition: background-color 0.2s ease;
}

.el-table__row:hover > td {
  background-color: #f0f9ff !important;
}

.admin-row {
  background-color: #fffbeb;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 10px 20px;
  border-top: 1px solid #ebeef5;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 动画效果 */
.el-button, .el-tag {
  transition: all 0.2s ease;
}

.el-drawer__header {
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 12px;
  margin-bottom: 12px;
}

/* 权限标签容器 */
.el-table .el-tag {
  margin: 2px;
}
</style>