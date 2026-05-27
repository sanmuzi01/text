<template>
  <div class="p-6 bg-gray-50 min-h-screen flex justify-center">
    <el-card shadow="hover" class="w-[1280px]">
      <!-- 标题和添加按钮 -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-900">教练管理</h2>
        <el-button
          type="primary"
          class="rounded-md px-5 py-2 text-sm font-medium shadow-sm hover:shadow-md transition"
          @click="openDrawer()"
        >
          添加教练
        </el-button>
      </div>

      <!-- 搜索筛选区域 -->
      <div class="mb-4 flex flex-wrap gap-4 items-center">
        <el-input
          v-model="searchQuery"
          placeholder="搜索姓名、电话、邮箱"
          clearable
          @clear="onFilterChange"
          @input="onFilterChange"
          class="w-64"
          prefix-icon="el-icon-search"
        />
        <el-select
          v-model="filterGender"
          placeholder="筛选性别"
          clearable
          @change="onFilterChange"
          style="width: 120px"
        >
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
        <el-select
          v-model="filterGymId"
          placeholder="筛选健身房"
          clearable
          @change="onFilterChange"
          style="width: 140px"
        >
          <el-option
            v-for="g in gymOptions"
            :key="g.id"
            :label="g.name"
            :value="g.id"
          />
        </el-select>
      </div>

      <!-- 教练列表表格 -->
      <el-table
        :data="pagedData"
        border
        stripe
        style="width: 1280px"
        v-loading="loading"
        :header-cell-style="{ backgroundColor: '#f9fafb', color: '#6b7280', fontWeight: '600' }"
        height="460"
      >
        <el-table-column label="头像" width="70" align="center" fixed>
          <template #default="scope">
            <el-avatar :src="scope.row.avatar" size="medium" class="mx-auto" />
          </template>
        </el-table-column>

        <el-table-column prop="id" label="ID" width="50" align="center" fixed />
        <el-table-column prop="name" label="姓名" width="85" fixed />
        <el-table-column prop="age" label="年龄" width="60" align="center" />
        <el-table-column prop="gender" label="性别" width="60" align="center" />
        <el-table-column prop="phone" label="电话" width="130" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column label="课程" width="140">
          <template #default="scope">
            {{ getCourseNames(scope.row.courseIds).join(', ') }}
          </template>
        </el-table-column>
        <el-table-column prop="gymName" label="健身房" width="100" />
        <el-table-column label="学员" width="90">
          <template #default="scope">
            {{ (scope.row.students || []).join(', ') }}
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="150"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <div class="flex justify-center gap-3">
              <el-button
                size="small"
                type="primary"
                class="rounded-md w-16 h-8 text-sm font-medium flex items-center justify-center shadow-sm transition-colors duration-200"
                @click="openDrawer(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                size="small"
                type="danger"
                class="rounded-md w-16 h-8 text-sm font-medium flex items-center justify-center shadow-sm transition-colors duration-200"
                @click="handleDelete(scope.row.id)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <div class="flex justify-end mt-4">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :current-page="currentPage"
          :total="filteredData.length"
          @current-change="onPageChange"
          class="text-sm"
        />
      </div>
    </el-card>

    <!-- 添加/编辑 Drawer -->
    <el-drawer
      v-model="drawerVisible"
      :title="drawerTitle"
      size="40%"
      :before-close="handleDrawerClose"
      class="overflow-auto"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="100px"
        class="max-w-xl mx-auto"
      >
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader rounded-full overflow-hidden cursor-pointer"
            :show-file-list="false"
            :on-change="handleAvatarChange"
            accept="image/*"
          >
            <img
              v-if="form.avatar"
              :src="form.avatar"
              alt="头像"
              class="w-20 h-20 rounded-full object-cover border border-gray-300"
              title="点击更换头像"
            />
            <div
              v-else
              class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-300 transition cursor-pointer"
              title="点击上传头像"
            >
              <el-icon><Plus /></el-icon>
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入姓名"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number
            v-model="form.age"
            :min="18"
            :max="80"
            placeholder="年龄"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="请输入手机号"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="form.email"
            placeholder="请输入邮箱"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item label="负责课程" prop="courseIds">
          <el-select
            v-model="form.courseIds"
            multiple
            placeholder="请选择课程"
            filterable
            clearable
            class="w-full"
          >
            <el-option
              v-for="c in courseOptions"
              :key="c.id"
              :label="c.courseName"
              :value="c.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="健身房" prop="gymId">
          <el-select
            v-model="form.gymId"
            placeholder="请选择健身房"
            filterable
            clearable
            class="w-full"
          >
            <el-option
              v-for="g in gymOptions"
              :key="g.id"
              :label="g.name"
              :value="g.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="学员" prop="students">
          <el-select
            v-model="form.students"
            multiple
            placeholder="请选择学员"
            filterable
            clearable
            class="w-full"
          >
            <el-option
              v-for="s in studentOptions"
              :key="s.id"
              :label="s.name"
              :value="s.name"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <div class="flex justify-end mt-6 space-x-3">
        <el-button
          class="px-5 py-2 text-sm font-medium rounded-md"
          @click="drawerVisible = false"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          class="px-6 py-2 text-sm font-semibold rounded-md"
          @click="submitForm"
        >
          保存
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

interface Coach {
  id: number
  name: string
  age: number
  gender: '男' | '女'
  phone: string
  email: string
  avatar: string
  courseIds?: number[]
  gymId?: number
  gymName?: string
  students?: string[]
}
interface Course {
  id: number
  courseName: string
}
interface Gym {
  id: number
  name: string
}
interface Student {
  id: number
  name: string
}

const coachList = ref<Coach[]>([])
const loading = ref(false)
const drawerVisible = ref(false)
const pageSize = 6
const currentPage = ref(1)

const courseOptions = ref<Course[]>([
  { id: 1, courseName: '瑜伽' },
  { id: 2, courseName: '力量训练' },
  { id: 3, courseName: '有氧舞蹈' },
  { id: 4, courseName: '动感单车' }
])
const gymOptions = ref<Gym[]>([
  { id: 1, name: '东区馆' },
  { id: 2, name: '西区馆' }
])
const studentOptions = ref<Student[]>([
  { id: 1, name: '学员A' },
  { id: 2, name: '学员B' },
  { id: 3, name: '学员C' }
])

// 初始化模拟数据
const avatarSeeds = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
  'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r'
]
for (let i = 1; i <= 18; i++) {
  const name = `教练${i}`
  coachList.value.push({
    id: i,
    name,
    age: 25 + (i % 10),
    gender: i % 2 ? '女' : '男',
    phone: `138000000${i.toString().padStart(2, '0')}`,
    email: `coach${i}@example.com`,
    avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${avatarSeeds[i - 1]}`,
    courseIds: [((i - 1) % courseOptions.value.length) + 1],
    gymId: ((i - 1) % gymOptions.value.length) + 1,
    gymName: gymOptions.value[((i - 1) % gymOptions.value.length)].name,
    students: [studentOptions.value[(i - 1) % studentOptions.value.length].name]
  })
}

// 搜索与筛选状态
const searchQuery = ref('')
const filterGender = ref('')
const filterGymId = ref(null)

const filteredData = computed(() => {
  return coachList.value.filter((c) => {
    const matchesSearch =
      !searchQuery.value ||
      [c.name, c.phone, c.email].some((field) =>
        field?.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    const matchesGender = !filterGender.value || c.gender === filterGender.value
    const matchesGym = !filterGymId.value || c.gymId === filterGymId.value
    return matchesSearch && matchesGender && matchesGym
  })
})

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredData.value.slice(start, start + pageSize)
})

function onPageChange(page: number) {
  currentPage.value = page
}

function onFilterChange() {
  currentPage.value = 1
}

const formRef = ref()
const form = reactive<Partial<Coach>>({
  id: null,
  name: '',
  age: null,
  gender: '男',
  phone: '',
  email: '',
  avatar: '',
  courseIds: [],
  gymId: null,
  students: []
})
const drawerTitle = computed(() => (form.id ? '编辑教练' : '添加教练'))

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  age: [
    { required: true, type: 'number', min: 18, max: 80, message: '年龄范围 18-80', trigger: 'blur' }
  ],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phone: [
    { required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入有效手机号', trigger: 'blur' }
  ],
  email: [{ required: true, type: 'email', message: '请输入有效邮箱', trigger: 'blur' }],
  courseIds: [{ required: true, type: 'array', message: '请选择课程', trigger: 'change' }],
  gymId: [{ required: true, message: '请选择健身房', trigger: 'change' }]
}

function openDrawer(coach?: Coach) {
  if (coach) Object.assign(form, coach)
  else
    Object.assign(form, {
      id: null,
      name: '',
      age: null,
      gender: '男',
      phone: '',
      email: '',
      avatar: '',
      courseIds: [],
      gymId: null,
      students: []
    })
  drawerVisible.value = true
}

function handleDrawerClose(done: Function) {
  formRef.value?.clearValidate()
  done()
}

function handleAvatarChange(file: any) {
  const reader = new FileReader()
  reader.onload = (e: any) => (form.avatar = e.target.result)
  reader.readAsDataURL(file.raw)
}

function getCourseNames(ids?: number[]) {
  return (
    ids
      ?.map((id) => courseOptions.value.find((c) => c.id === id)?.courseName)
      .filter(Boolean) || []
  )
}

function submitForm() {
  formRef.value?.validate((valid: boolean) => {
    if (!valid) return
    const gym = gymOptions.value.find((g) => g.id === form.gymId)
    if (form.id) {
      const idx = coachList.value.findIndex((c) => c.id === form.id)
      coachList.value[idx] = { ...(form as Coach), gymName: gym?.name }
      ElMessage.success('更新成功')
    } else {
      const next = Math.max(...coachList.value.map((c) => c.id), 0) + 1
      coachList.value.unshift({ ...(form as Coach), id: next, gymName: gym?.name })
      currentPage.value = 1
      ElMessage.success('添加成功')
    }
    drawerVisible.value = false
  })
}

function handleDelete(id: number) {
  ElMessageBox.confirm('确认删除该教练吗？', '提示', { type: 'warning' })
    .then(() => {
      coachList.value = coachList.value.filter((c) => c.id !== id)
      ElMessage.success('删除成功')
      const maxPage = Math.ceil(filteredData.value.length / pageSize)
      if (currentPage.value > maxPage) currentPage.value = maxPage || 1
    })
    .catch(() => {})
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}
.avatar-uploader .el-upload:hover {
  box-shadow: 0 0 10px rgb(59 130 246 / 0.6);
}
</style>
