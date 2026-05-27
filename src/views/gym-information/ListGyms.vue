<template>
  <div class="min-h-screen bg-[#f5f5f7] px-[120px] py-10 font-sans text-gray-900">
    <!-- 顶部区域 -->
    <header class="flex items-center justify-between mb-12">
      <div class="flex items-center gap-3">
        <svg class="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L3 7v7c0 5 9 8 9 8s9-3 9-8V7l-9-5z" />
        </svg>
        <h1 class="text-3xl font-extrabold tracking-wide">健身房信息管理</h1>
      </div>
      <el-button
        type="primary"
        size="large"
        class="rounded-lg shadow-md bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
        @click="openDrawer()"
      >
        添加健身房
      </el-button>
    </header>

    <!-- 表格 -->
    <el-table
      :data="paginatedGyms"
      border
      stripe
      class="w-full bg-white rounded-lg shadow-sm"
      :row-key="(row) => row.id"
      :default-expand-all="false"
      :expand-row-keys="expandedRows"
      @expand-change="onExpandChange"
      style="table-layout: fixed;"
    >
      <el-table-column type="expand" width="50">
        <template #default="{ row }">
          <section
            class="p-6 bg-white rounded-lg shadow-lg flex gap-6"
          >
            <div
              v-if="row.image"
              class="flex-shrink-0 w-48 h-32 rounded-lg overflow-hidden border border-gray-300"
            >
              <img
                :src="row.image"
                alt="健身房图片"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div v-else
              class="flex-shrink-0 w-48 h-32 rounded-lg border border-gray-300 bg-gray-100 flex items-center justify-center text-gray-400 italic"
            >
              无图片
            </div>
            <article class="flex-1 text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
              {{ row.description }}
            </article>
          </section>
        </template>
      </el-table-column>

      <el-table-column prop="id" label="ID" width="60" align="center" />
      <el-table-column prop="name" label="名称" width="120" />
      <el-table-column prop="location" label="地址" width="130" />
      <el-table-column prop="contact" label="联系方式" width="120" />
      <el-table-column prop="status" label="租用状态" width="90" align="center" />
      <el-table-column prop="maintainers" label="维护教练" width="100">
        <template #default="{ row }">
          <div class="flex flex-wrap gap-2">
            <span
              v-for="c in row.maintainers"
              :key="c.id"
              class="bg-blue-100 text-blue-700 rounded-md px-3 py-1 text-sm font-medium select-none"
            >
              {{ c.name }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="maintainTime" label="维护时间" width="140" align="center" />

     <el-table-column label="操作" width="160" align="center">
  <template #default="{ row }">
    <div class="flex justify-center gap-3">
      <el-button
        size="small"
        type="primary"
        class="rounded-md w-20 h-8 text-sm font-medium flex items-center justify-center shadow-sm transition-colors duration-200"
        @click="openDrawer(row)"
      >
        编辑
      </el-button>
      <el-button
        size="small"
        type="danger"
        class="rounded-md w-20 h-8 text-sm font-medium flex items-center justify-center shadow-sm transition-colors duration-200"
        @click="deleteGym(row.id)"
      >
        删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="mt-8 flex justify-end">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="gymList.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
      />
    </div>

    <!-- 编辑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="form.id ? '编辑健身房' : '添加健身房'"
      direction="rtl"
      size="38%"
      :with-header="true"
      class="font-sans"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="120px"
        class="pt-4"
        label-position="left"
        size="medium"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入健身房名称" />
        </el-form-item>
        <el-form-item label="地址" prop="location">
          <el-input v-model="form.location" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="租用状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择租用状态">
            <el-option label="使用中" value="使用中" />
            <el-option label="未使用" value="未使用" />
          </el-select>
        </el-form-item>
        <el-form-item label="维护教练" prop="maintainerIds">
          <el-select
            v-model="form.maintainerIds"
            multiple
            collapse-tags
            placeholder="请选择维护教练"
            style="width: 100%"
          >
            <el-option
              v-for="coach in coachOptions"
              :key="coach.id"
              :label="coach.name"
              :value="coach.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="维护时间" prop="maintainTime">
          <el-date-picker
            v-model="form.maintainTime"
            type="date"
            placeholder="请选择维护时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input
            type="textarea"
            v-model="form.description"
            placeholder="请输入健身房简介"
            rows="4"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="上传图片" prop="image">
          <el-upload
            class="upload-demo"
            drag
            accept="image/*"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-change="handleChange"
          >
            <div class="text-center text-gray-400 cursor-pointer select-none">
              <i class="el-icon-upload" style="font-size: 36px;"></i>
              <p class="mt-2">点击或拖拽上传图片（限2MB）</p>
            </div>
          </el-upload>
          <div
            v-if="form.image"
            class="mt-3 flex flex-col items-start gap-3"
          >
            <img
              :src="form.image"
              alt="预览图"
              class="w-48 h-32 rounded-lg object-cover border border-gray-300"
              loading="lazy"
            />
            <el-button
              size="mini"
              type="danger"
              @click="form.image = ''"
              class="px-4"
            >
              删除图片
            </el-button>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex justify-end gap-4 pb-6 pt-4 border-t border-gray-200">
          <el-button size="medium" @click="drawerVisible = false">取消</el-button>
          <el-button size="medium" type="primary" @click="submitForm">保存</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

interface Coach {
  id: number
  name: string
}

interface Gym {
  id: number
  name: string
  location: string
  contact: string
  status: string
  maintainerIds: number[]
  maintainers: Coach[]
  maintainTime: string | null
  description: string
  image: string
}

const coachOptions = ref<Coach[]>([
  { id: 1, name: '教练1' },
  { id: 2, name: '教练2' },
  { id: 3, name: '教练3' }
])

const gymList = ref<Gym[]>([])

for (let i = 1; i <= 18; i++) {
  gymList.value.push({
    id: i,
    name: `健身房${i}`,
    location: `城市${i}区${i}号`,
    contact: `139000000${String(i).padStart(2, '0')}`,
    status: i % 2 ? '使用中' : '未使用',
    maintainerIds: [((i - 1) % coachOptions.value.length) + 1],
    maintainers: [coachOptions.value[(i - 1) % coachOptions.value.length]],
    maintainTime: `2025-0${(i % 9) + 1}-0${(i % 28) + 1}`,
    description: `这是健身房${i}的简介。环境优美，设施齐全，欢迎来访体验！`,
    image: ''
  })
}

const drawerVisible = ref(false)
const formRef = ref()
const form = reactive<Partial<Gym>>({
  id: null,
  name: '',
  location: '',
  contact: '',
  status: '使用中',
  maintainerIds: [],
  maintainers: [],
  maintainTime: null,
  description: '',
  image: ''
})

const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  location: [{ required: true, message: '请输入地址', trigger: 'blur' }],
  contact: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  maintainerIds: [
    { type: 'array', required: true, message: '请选择至少一位教练', trigger: 'change' }
  ],
  maintainTime: [{ required: true, message: '请选择维护时间', trigger: 'change' }],
  description: [{ required: true, message: '请输入简介', trigger: 'blur' }]
}

const currentPage = ref(1)
const pageSize = ref(10)
const paginatedGyms = computed(() =>
  gymList.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
)

const expandedRows = ref<number[]>([])

function openDrawer(gym?: Gym) {
  if (gym) {
    Object.assign(form, {
      ...gym,
      maintainerIds: [...gym.maintainerIds]
    })
  } else {
    Object.assign(form, {
      id: null,
      name: '',
      location: '',
      contact: '',
      status: '使用中',
      maintainerIds: [],
      maintainers: [],
      maintainTime: null,
      description: '',
      image: ''
    })
  }
  drawerVisible.value = true
}

function submitForm() {
  formRef.value?.validate((valid: boolean) => {
    if (!valid) return
    form.maintainers = form.maintainerIds?.map((id) =>
      coachOptions.value.find((c) => c.id === id)
    )!
    if (form.id) {
      const idx = gymList.value.findIndex((g) => g.id === form.id)
      gymList.value[idx] = { ...form } as Gym
      ElMessage.success('更新成功')
    } else {
      const newId = Math.max(...gymList.value.map((g) => g.id), 0) + 1
      gymList.value.unshift({ ...form, id: newId } as Gym)
      ElMessage.success('添加成功')
    }
    drawerVisible.value = false
  })
}

function deleteGym(id: number) {
  ElMessageBox.confirm('确认删除该健身房？', '提示', { type: 'warning' })
    .then(() => {
      gymList.value = gymList.value.filter((g) => g.id !== id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

function beforeUpload(file: File) {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传图片只能是图片格式！')
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB！')
  }
  return isImage && isLt2M
}

async function handleChange(file: any) {
  if (file.raw) {
    form.image = await getBase64(file.raw)
  }
}

function onExpandChange(row: Gym, expanded: boolean) {
  if (expanded) {
    if (!expandedRows.value.includes(row.id)) {
      expandedRows.value.push(row.id)
    }
  } else {
    expandedRows.value = expandedRows.value.filter((id) => id !== row.id)
  }
}
</script>

<style scoped>
/* 字体使用系统默认的无衬线字体 */
.font-sans {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>
