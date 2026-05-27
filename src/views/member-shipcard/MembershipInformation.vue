<template>
  <div class="member-management-container h-full w-full">
    <!-- 标签页导航 -->
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="会员信息" name="info"></el-tab-pane>
      <el-tab-pane label="会员密码" name="password"></el-tab-pane>
    </el-tabs>

    <!-- 会员信息标签页内容 -->
    <div v-show="activeTab === 'info'" class="tab-content">
      <!-- 搜索和操作区 -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <el-input 
            v-model="infoSearchKey" 
            placeholder="搜索会员名称" 
            class="mr-2 w-48" 
          />
          <el-button type="primary" @click="handleInfoSearch">搜索</el-button>
        </div>
        <div class="flex items-center">
          <el-button type="primary" @click="openInfoDrawer(false)">添加会员</el-button>
          <el-button type="danger" class="ml-2" @click="handleInfoBatchDelete">批量删除</el-button>
        </div>
      </div>

      <!-- 会员信息表格 -->
      <el-table 
        :data="infoTableData" 
        border 
        stripe 
        style="width: 100%" 
        @selection-change="handleInfoSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '活跃' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button 
              type="primary" 
              size="mini" 
              @click="openInfoDrawer(true, scope.row)"
            >编辑</el-button>
            <el-button 
              type="danger" 
              size="mini" 
              class="ml-2" 
              @click="handleInfoDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="mt-4 flex justify-between items-center">
        <span>共 {{ infoTotal }} 条记录</span>
        <el-pagination 
          v-model:current-page="infoPage" 
          v-model:page-size="infoPageSize" 
          :total="infoTotal" 
          :page-sizes="[10, 20, 50]" 
          layout="sizes, prev, pager, next, jumper" 
          @size-change="handleInfoSizeChange"
        />
      </div>

      <!-- 会员信息抽屉 -->
      <el-drawer 
        :title="isInfoEdit ? '编辑会员' : '添加会员'" 
        :visible="infoDrawerVisible" 
        direction="rtl" 
        @close="closeInfoDrawer"
      >
        <el-form :model="infoForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="infoForm.username" />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="infoForm.name" />
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="infoForm.phone" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="infoForm.email" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="infoForm.status">
              <el-radio :label="'active'">活跃</el-radio>
              <el-radio :label="'disabled'">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="text-right mt-4">
            <el-button @click="closeInfoDrawer">取消</el-button>
            <el-button type="primary" @click="handleInfoSubmit">确定</el-button>
          </div>
        </el-form>
      </el-drawer>
    </div>

    <!-- 会员密码标签页内容 -->
    <div v-show="activeTab === 'password'" class="tab-content">
      <!-- 搜索和操作区 -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <el-input 
            v-model="passwordSearchKey" 
            placeholder="搜索用户名" 
            class="mr-2 w-48" 
          />
          <el-button type="primary" @click="handlePasswordSearch">搜索</el-button>
        </div>
        <div class="flex items-center">
          <el-button type="primary" @click="openPasswordDrawer(false)">添加密码</el-button>
          <el-button type="success" class="ml-2">批量更新</el-button>
          <el-button type="danger" class="ml-2" @click="handlePasswordBatchDelete">批量删除</el-button>
        </div>
      </div>

      <!-- 密码表格 -->
      <el-table 
        :data="passwordTableData" 
        border 
        stripe 
        style="width: 100%" 
        @selection-change="handlePasswordSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="password" label="密码">
          <template #default="scope">
            <span>******** 
              <a href="javascript:;" class="text-blue-600 hover:underline">查看</a>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button 
              type="primary" 
              size="mini" 
              @click="openPasswordDrawer(true, scope.row)"
            >更新</el-button>
            <el-button 
              type="danger" 
              size="mini" 
              class="ml-2" 
              @click="handlePasswordDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="mt-4 flex justify-between items-center">
        <span>共 {{ passwordTotal }} 条记录</span>
        <el-pagination 
          v-model:current-page="passwordPage" 
          v-model:page-size="passwordPageSize" 
          :total="passwordTotal" 
          :page-sizes="[10, 20, 50]" 
          layout="sizes, prev, pager, next, jumper" 
          @size-change="handlePasswordSizeChange"
        />
      </div>

      <!-- 密码抽屉 -->
      <el-drawer 
        :title="isPasswordEdit ? '编辑密码' : '添加密码'" 
        :visible="passwordDrawerVisible" 
        direction="rtl" 
        @close="closePasswordDrawer"
      >
        <el-form :model="passwordForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="passwordForm.username" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="passwordForm.password" type="password" />
          </el-form-item>
          <div class="text-right mt-4">
            <el-button @click="closePasswordDrawer">取消</el-button>
            <el-button type="primary" @click="handlePasswordSubmit">确定</el-button>
          </div>
        </el-form>
      </el-drawer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  ElTabs, ElTabPane, ElTable, ElTableColumn, ElDrawer, 
  ElForm, ElFormItem, ElInput, ElButton, ElPagination, 
  ElMessageBox, ElTag, ElRadioGroup, ElRadio 
} from 'element-plus'

// 会员信息模拟数据
const memberInfoData = [
  { id: 1, username: 'admin', name: '管理员', phone: '13800138000', email: 'admin@example.com', status: 'active' },
  { id: 2, username: 'user1', name: '张三', phone: '13900139000', email: 'user1@example.com', status: 'active' },
  { id: 3, username: 'user2', name: '李四', phone: '13700137000', email: 'user2@example.com', status: 'disabled' },
  { id: 4, username: 'user3', name: '王五', phone: '13600136000', email: 'user3@example.com', status: 'active' },
  { id: 5, username: 'user4', name: '赵六', phone: '13500135000', email: 'user4@example.com', status: 'active' },
  { id: 6, username: 'user5', name: '孙七', phone: '13400134000', email: 'user5@example.com', status: 'disabled' },
  { id: 7, username: 'user6', name: '周八', phone: '13300133000', email: 'user6@example.com', status: 'active' },
  { id: 8, username: 'user7', name: '吴九', phone: '13200132000', email: 'user7@example.com', status: 'active' },
  { id: 9, username: 'user8', name: '郑十', phone: '13100131000', email: 'user8@example.com', status: 'disabled' },
  { id: 10, username: 'user9', name: '钱十一', phone: '13000130000', email: 'user9@example.com', status: 'active' },
  { id: 11, username: 'user10', name: '孙十二', phone: '13900139001', email: 'user10@example.com', status: 'active' },
  { id: 12, username: 'user11', name: '周十三', phone: '13800138001', email: 'user11@example.com', status: 'disabled' },
  { id: 13, username: 'user12', name: '吴十四', phone: '13700137001', email: 'user12@example.com', status: 'active' },
  { id: 14, username: 'user13', name: '郑十五', phone: '13600136001', email: 'user13@example.com', status: 'active' },
  { id: 15, username: 'user14', name: '钱十六', phone: '13500135001', email: 'user14@example.com', status: 'disabled' },
  { id: 16, username: 'user15', name: '孙十七', phone: '13400134001', email: 'user15@example.com', status: 'active' },
  { id: 17, username: 'user16', name: '周十八', phone: '13300133001', email: 'user16@example.com', status: 'active' },
  { id: 18, username: 'user17', name: '吴十九', phone: '13200132001', email: 'user17@example.com', status: 'disabled' },
  { id: 19, username: 'user18', name: '郑二十', phone: '13100131001', email: 'user18@example.com', status: 'active' },
  { id: 20, username: 'user19', name: '钱二十一', phone: '13000130001', email: 'user19@example.com', status: 'active' }
]

// 会员密码模拟数据
const memberPasswordData = [
  {
    "id": 1,
    "username": "admin",
    "password": "12345678",
    "createTime": "2023-01-15 09:30:00",
    "updateTime": "2023-01-15 09:30:00"
  },
  {
    "id": 2,
    "username": "user1",
    "password": "12345678",
    "createTime": "2023-01-16 14:15:00",
    "updateTime": "2023-01-18 10:45:00"
  },
  {
    "id": 3,
    "username": "user2",
    "password": "12345678",
    "createTime": "2023-01-17 16:20:00",
    "updateTime": "2023-01-17 16:20:00"
  },
  {
    "id": 4,
    "username": "user3",
    "password": "12345678",
    "createTime": "2023-01-18 11:05:00",
    "updateTime": "2023-01-20 15:30:00"
  },
  {
    "id": 5,
    "username": "user4",
    "password": "12345678",
    "createTime": "2023-01-19 13:40:00",
    "updateTime": "2023-01-19 13:40:00"
  },
  {
    "id": 6,
    "username": "user5",
    "password": "12345678",
    "createTime": "2023-01-20 09:30:00",
    "updateTime": "2023-01-20 09:30:00"
  },
  {
    "id": 7,
    "username": "user6",
    "password": "12345678",
    "createTime": "2023-01-20 14:00:00",
    "updateTime": "2023-01-21 10:00:00"
  },
  {
    "id": 8,
    "username": "user7",
    "password": "12345678",
    "createTime": "2023-01-21 09:30:00",
    "updateTime": "2023-01-21 09:30:00"
  },
  {
    "id": 9,
    "username": "user8",
    "password": "12345678",
    "createTime": "2023-01-21 14:00:00",
    "updateTime": "2023-01-22 10:00:00"
  },
  {
    "id": 10,
    "username": "user9",
    "password": "12345678",
    "createTime": "2023-01-22 09:30:00",
    "updateTime": "2023-01-22 09:30:00"
  },
  {
    "id": 11,
    "username": "user10",
    "password": "12345678",
    "createTime": "2023-01-22 14:00:00",
    "updateTime": "2023-01-23 10:00:00"
  },
  {
    "id": 12,
    "username": "user11",
    "password": "12345678",
    "createTime": "2023-01-23 09:30:00",
    "updateTime": "2023-01-23 09:30:00"
  },
  {
    "id": 13,
    "username": "user12",
    "password": "12345678",
    "createTime": "2023-01-23 14:00:00",
    "updateTime": "2023-01-24 10:00:00"
  },
  {
    "id": 14,
    "username": "user13",
    "password": "12345678",
    "createTime": "2023-01-24 09:30:00",
    "updateTime": "2023-01-24 09:30:00"
  },
  {
    "id": 15,
    "username": "user14",
    "password": "12345678",
    "createTime": "2023-01-24 14:00:00",
    "updateTime": "2023-01-25 10:00:00"
  },
  {
    "id": 16,
    "username": "user15",
    "password": "12345678",
    "createTime": "2023-01-25 09:30:00",
    "updateTime": "2023-01-25 09:30:00"
  },
  {
    "id": 17,
    "username": "user16",
    "password": "12345678",
    "createTime": "2023-01-25 14:00:00",
    "updateTime": "2023-01-26 10:00:00"
  },
  {
    "id": 18,
    "username": "user17",
    "password": "12345678",
    "createTime": "2023-01-26 09:30:00",
    "updateTime": "2023-01-26 09:30:00"
  }
]

// 状态管理
const activeTab = ref('info') // 默认显示会员信息
const infoSearchKey = ref('')
const infoPage = ref(1)
const infoPageSize = ref(10)
const infoDrawerVisible = ref(false)
const isInfoEdit = ref(false)
const infoForm = ref({ username: '', name: '', phone: '', email: '', status: 'active' })
const infoSelectedRows = ref([])

const passwordSearchKey = ref('')
const passwordPage = ref(1)
const passwordPageSize = ref(10)
const passwordDrawerVisible = ref(false)
const isPasswordEdit = ref(false)
const passwordForm = ref({ username: '', password: '' })
const passwordSelectedRows = ref([])

// 会员信息计算属性
const infoFilteredData = computed(() => {
  if (!infoSearchKey.value) return memberInfoData
  return memberInfoData.filter(item => 
    item.username.includes(infoSearchKey.value) || 
    item.name.includes(infoSearchKey.value)
  )
})

const infoTableData = computed(() => {
  const start = (infoPage.value - 1) * infoPageSize.value
  const end = start + infoPageSize.value
  return infoFilteredData.value.slice(start, end)
})

const infoTotal = computed(() => infoFilteredData.value.length)

// 会员密码计算属性
const passwordFilteredData = computed(() => {
  if (!passwordSearchKey.value) return memberPasswordData
  return memberPasswordData.filter(item => 
    item.username.includes(passwordSearchKey.value)
  )
})

const passwordTableData = computed(() => {
  const start = (passwordPage.value - 1) * passwordPageSize.value
  const end = start + passwordPageSize.value
  return passwordFilteredData.value.slice(start, end)
})

const passwordTotal = computed(() => passwordFilteredData.value.length)

// 标签页切换事件
const handleTabClick = (tab) => {
  // 可以添加标签页切换时的逻辑
  console.log('Tab switched to:', tab.name)
}

// 会员信息相关方法
const handleInfoSearch = () => {
  infoPage.value = 1
}

const handleInfoSizeChange = () => {
  infoPage.value = 1
}

const openInfoDrawer = (edit, row) => {
  infoDrawerVisible.value = true
  isInfoEdit.value = edit
  infoForm.value = edit ? { ...row } : { username: '', name: '', phone: '', email: '', status: 'active' }
}

const closeInfoDrawer = () => {
  infoDrawerVisible.value = false
}

const handleInfoSubmit = () => {
  if (isInfoEdit.value) {
    const index = memberInfoData.findIndex(item => item.id === infoForm.value.id)
    if (index !== -1) {
      memberInfoData[index] = { ...infoForm.value }
    }
  } else {
    const newId = memberInfoData.length ? memberInfoData[memberInfoData.length - 1].id + 1 : 1
    memberInfoData.push({ ...infoForm.value, id: newId })
  }
  closeInfoDrawer()
}

const handleInfoDelete = (row) => {
  ElMessageBox.confirm(
    '确定删除该会员吗？',
    '提示',
    { type: 'warning' }
  ).then(() => {
    const index = memberInfoData.findIndex(item => item.id === row.id)
    if (index !== -1) {
      memberInfoData.splice(index, 1)
    }
  })
}

const handleInfoBatchDelete = () => {
  if (!infoSelectedRows.value.length) {
    ElMessageBox.warning('请选择要删除的会员')
    return
  }
  ElMessageBox.confirm(
    `确定删除选中的 ${infoSelectedRows.value.length} 个会员吗？`,
    '提示',
    { type: 'warning' }
  ).then(() => {
    const ids = infoSelectedRows.value.map(item => item.id)
    for (let i = memberInfoData.length - 1; i >= 0; i--) {
      if (ids.includes(memberInfoData[i].id)) {
        memberInfoData.splice(i, 1)
      }
    }
    infoSelectedRows.value = []
  })
}

const handleInfoSelectionChange = (val) => {
  infoSelectedRows.value = val
}

// 会员密码相关方法
const handlePasswordSearch = () => {
  passwordPage.value = 1
}

const handlePasswordSizeChange = () => {
  passwordPage.value = 1
}

const openPasswordDrawer = (edit, row) => {
  passwordDrawerVisible.value = true
  isPasswordEdit.value = edit
  passwordForm.value = edit ? { ...row } : { username: '', password: '' }
}

const closePasswordDrawer = () => {
  passwordDrawerVisible.value = false
}

const formatDateTime = () => {
  const date = new Date()
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-') + ' ' + [
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
    String(date.getSeconds()).padStart(2, '0')
  ].join(':')
}

const handlePasswordSubmit = () => {
  if (isPasswordEdit.value) {
    const index = memberPasswordData.findIndex(item => item.id === passwordForm.value.id)
    if (index !== -1) {
      memberPasswordData[index] = {
        ...passwordForm.value,
        updateTime: formatDateTime()
      }
    }
  } else {
    const newId = memberPasswordData.length 
      ? memberPasswordData[memberPasswordData.length - 1].id + 1 
      : 1
    memberPasswordData.push({
      id: newId,
      username: passwordForm.value.username,
      password: passwordForm.value.password,
      createTime: formatDateTime(),
      updateTime: formatDateTime()
    })
  }
  closePasswordDrawer()
}

const handlePasswordDelete = (row) => {
  ElMessageBox.confirm(
    '确定删除该密码记录吗？',
    '提示',
    { type: 'warning' }
  ).then(() => {
    const index = memberPasswordData.findIndex(item => item.id === row.id)
    if (index !== -1) {
      memberPasswordData.splice(index, 1)
    }
  })
}

const handlePasswordBatchDelete = () => {
  if (!passwordSelectedRows.value.length) {
    ElMessageBox.warning('请选择要删除的记录')
    return
  }
  ElMessageBox.confirm(
    `确定删除选中的 ${passwordSelectedRows.value.length} 条密码记录吗？`,
    '提示',
    { type: 'warning' }
  ).then(() => {
    const ids = passwordSelectedRows.value.map(item => item.id)
    for (let i = memberPasswordData.length - 1; i >= 0; i--) {
      if (ids.includes(memberPasswordData[i].id)) {
        memberPasswordData.splice(i, 1)
      }
    }
    passwordSelectedRows.value = []
  })
}

const handlePasswordSelectionChange = (val) => {
  passwordSelectedRows.value = val
}
</script>

<style scoped>
.member-management-container {
  height: 100%;
  width: 100%;
}

.tab-content {
  padding: 16px;
}
</style>