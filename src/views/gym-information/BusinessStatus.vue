<template>
  <div class="min-h-screen bg-[#f5f5f7] px-24 py-10 font-sans text-gray-900 max-w-8xl mx-auto">
    <!-- 标题 区 -->
    <header class="flex items-center justify-between mb-10">
      <div class="flex items-center gap-3">
        <svg class="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L3 7v7c0 5 9 8 9 8s9-3 9-8V7l-9-5z" />
        </svg>
        <h1 class="text-3xl font-extrabold tracking-wide">多管区健身房管理与营业状况</h1>
      </div>
      <el-button
        type="primary"
        size="large"
        class="rounded-lg shadow-md bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
        @click="openGymDialog()"
      >
        添加健身房
      </el-button>
    </header>

    <!-- 管区 切换 -->
    <nav class="mb-6 flex gap-4" role="tablist" aria-label="管区切换导航">
      <button
        v-for="zone in zones"
        :key="zone.id"
        :class="[
          'px-5 py-2 rounded-2xl font-semibold cursor-pointer transition',
          zone.id === currentZoneId ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
        ]"
        @click="switchZone(zone.id)"
      >
        {{ zone.name }}
      </button>
    </nav>

    <!-- 健身房 列表 表格 -->
    <el-table
      :data="paginatedGyms"
      border
      stripe
      class="w-full bg-white rounded-lg shadow-sm mb-6"
      :row-key="row => row.id"
      style="table-layout: fixed;"
    >
      <!-- 展开行 显示 简介+图片 -->
      <el-table-column type="expand" width="60">
        <template #default="{ row }">
          <section class="p-6 bg-white rounded-lg shadow-lg flex gap-6">
            <div v-if="row.image" class="w-48 h-32 rounded-lg overflow-hidden border">
              <img :src="row.image" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-48 h-32 rounded-lg border bg-gray-100 flex items-center justify-center italic text-gray-400">
              无图片
            </div>
            <article class="flex-1 text-gray-700 whitespace-pre-wrap">{{ row.description }}</article>
          </section>
        </template>
      </el-table-column>

      <el-table-column prop="id" label="ID" width="45" align="center" />
      <el-table-column prop="name" label="名称" width="160" />
      <el-table-column prop="location" label="地址" width="160" />
      <el-table-column prop="contact" label="联系方式" width="100" />
      <el-table-column prop="status" label="租用状态" width="100" align="center" />
      <el-table-column prop="maintainers" label="维护教练" width="90">
        <template #default="{ row }">
          <span
            v-for="c in row.maintainers"
            :key="c.id"
            class="bg-blue-100 text-blue-700 rounded-md px-3 py-1 text-sm mr-1"
          >
            {{ c.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="maintainTime" label="维护时间" width="140" align="center" />

      <!-- 操作 列 -->
      <el-table-column label="操作" width="160" align="center">
        <template #default="{ row }">
          <el-button size="default" type="primary" @click="openGymDialog(row)">编辑</el-button>
          <el-button size="default" type="danger" @click="deleteGym(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="flex justify-end mb-10">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="currentZone.gyms.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
      />
    </div>

    <!-- 营业状况 卡片 列表 -->
    <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">
      <el-card
        v-for="gym in paginatedGyms"
        :key="gym.id"
        class="interactive-card rounded-3xl cursor-pointer"
        @click="openDetailDrawer(gym)"
      >
        <header class="px-6 py-4 border-b">
          <h3 class="font-semibold">🏋️ {{ gym.name }}</h3>
        </header>
        <div :id="'chart-' + gym.id" class="h-40 p-4"></div>
        <footer class="px-6 py-4 border-t flex justify-between text-sm">
          <div>总客流: <strong>{{ getTotalVisitors(gym.records) }}</strong></div>
          <div>平均: <strong>{{ getAverageVisitors(gym.records) }}</strong></div>
        </footer>
      </el-card>
    </section>

    <!-- 详细抽屉 -->
    <el-drawer v-model="detailDrawerVisible" direction="rtl" size="520px" :with-header="false" class="custom-drawer">
      <div class="h-full flex flex-col">
        <header class="flex justify-between items-center p-6 border-b">
          <h3 class="text-lg">{{ selectedGym?.name }} - 详情</h3>
          <el-button icon="el-icon-close" circle @click="closeDetailDrawer" />
        </header>
        <div class="flex-1 p-6 overflow-auto">
          <el-table
            v-if="selectedGym"
            :data="selectedGym.records"
            border
            size="default"
            style="width:100%"
          >
            <el-table-column prop="date" label="日期" width="120" />
            <el-table-column prop="visitors" label="客流量" width="100" />
          </el-table>
          <div v-if="selectedGym" :id="'detail-chart-' + selectedGym.id" class="h-64 mt-6"></div>
        </div>
      </div>
    </el-drawer>

    <!-- 新增/编辑 弹窗 (美观版) -->
    <el-dialog
      :title="gymDialogTitle"
      v-model="gymDialogVisible"
      width="420px"
      :before-close="closeGymDialog"
      class="modern-gym-dialog"
      :destroy-on-close="true"
    >
      <el-form
        ref="gymFormRef"
        :model="gymForm"
        :rules="gymRules"
        label-position="top"
        status-icon
        class="modern-gym-form"
      >
        <!-- 管区和名称并排 -->
        <div class="form-row">
          <el-form-item label="所属管区" prop="zoneId" class="flex-item">
            <el-select v-model="gymForm.zoneId" placeholder="请选择管区" clearable>
              <el-option
                v-for="z in zones"
                :key="z.id"
                :label="z.name"
                :value="z.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="健身房名称" prop="name" class="flex-item ml-4">
            <el-input v-model="gymForm.name" placeholder="请输入健身房名称" />
          </el-form-item>
        </div>

        <!-- 地址和联系方式 -->
        <div class="form-row">
          <el-form-item label="地址" prop="location" class="flex-item">
            <el-input v-model="gymForm.location" placeholder="请输入地址" />
          </el-form-item>
          <el-form-item label="联系方式" prop="contact" class="flex-item ml-4">
            <el-input v-model="gymForm.contact" placeholder="请输入联系方式" />
          </el-form-item>
        </div>

        <!-- 状态和维护教练 -->
        <div class="form-row">
          <el-form-item label="租用状态" prop="status" class="flex-item">
            <el-select v-model="gymForm.status" placeholder="请选择状态">
              <el-option label="使用中" value="使用中" />
              <el-option label="未使用" value="未使用" />
            </el-select>
          </el-form-item>
          <el-form-item label="维护教练" prop="maintainerIds" class="flex-item ml-4">
            <el-select
              v-model="gymForm.maintainerIds"
              multiple
              collapse-tags
              placeholder="请选择维护教练"
              clearable
            >
              <el-option
                v-for="c in coachOptions"
                :key="c.id"
                :label="c.name"
                :value="c.id"
              />
            </el-select>
          </el-form-item>
        </div>

        <!-- 维护时间和图片上传 -->
        <div class="form-row items-center">
          <el-form-item label="维护时间" prop="maintainTime" class="flex-item">
            <el-date-picker
              v-model="gymForm.maintainTime"
              type="date"
              placeholder="选择维护时间"
              style="width: 100%"
              clearable
            />
          </el-form-item>

          <el-form-item label="健身房图片" prop="image" class="flex-item ml-4">
            <el-upload
              drag
              accept="image/*"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-change="handleChange"
              class="upload-dragger"
            >
              <i class="el-icon-upload" style="font-size: 48px; color: #409EFF;"></i>
              <p class="upload-text">点击或拖拽上传图片</p>
              <p class="upload-hint">支持 jpg/png，大小不超过 2MB</p>
            </el-upload>
            <img
              v-if="gymForm.image"
              :src="gymForm.image"
              class="uploaded-image"
              alt="健身房图片"
            />
          </el-form-item>
        </div>

        <!-- 简介全文本区 -->
        <el-form-item label="健身房简介" prop="description" class="mt-6">
          <el-input
            type="textarea"
            v-model="gymForm.description"
            rows="4"
            placeholder="请输入健身房简介"
            resize="vertical"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeGymDialog">取消</el-button>
          <el-button type="primary" round @click="submitGymForm">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { ElMessage, ElMessageBox } from 'element-plus'

interface Zone { id: number; name: string; gyms: Gym[] }
interface Coach { id: number; name: string }
interface Gym {
  id: number
  zoneId: number
  name: string
  location: string
  contact: string
  status: string
  maintainerIds: number[]
  maintainers: Coach[]
  maintainTime: string | null
  description: string
  image: string
  records: { date: string; visitors: number }[]
}

// 模拟教练数据
const coachOptions = ref<Coach[]>([
  { id: 1, name: '教练1' },
  { id: 2, name: '教练2' },
  { id: 3, name: '教练3' },
  { id: 4, name: '教练4' }
])

// 初始化管区和健身房数据
const zones = reactive<Zone[]>([
  { id: 1, name: '管区A', gyms: [] },
  { id: 2, name: '管区B', gyms: [] },
  { id: 3, name: '管区C', gyms: [] }
])

function randomDate(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() - offset)
  return d.toISOString().slice(0, 10)
}

function genRecords() {
  return Array.from({ length: 7 }).map((_, i) => ({
    date: randomDate(6 - i),
    visitors: Math.floor(Math.random() * 100 + 50)
  }))
}

let gid = 1
zones.forEach((z) => {
  for (let i = 0; i < 6; i++) {
    const cidx = i % coachOptions.value.length
    z.gyms.push({
      id: gid++,
      zoneId: z.id,
      name: `${z.name} 健身房${i + 1}`,
      location: `城市${z.id}区${i + 1}号`,
      contact: `1390000${z.id}${i}`,
      status: i % 2 === 0 ? '使用中' : '未使用',
      maintainerIds: [coachOptions.value[cidx].id],
      maintainers: [coachOptions.value[cidx]],
      maintainTime: randomDate(10 + i),
      description: `${z.name}健身房${i + 1}介绍`,
      image: '',
      records: genRecords()
    })
  }
})

// 当前管区 & 分页相关
const currentZoneId = ref(zones[0].id)
const currentZone = computed(() => zones.find((z) => z.id === currentZoneId.value)!)
const currentPage = ref(1)
const pageSize = ref(6)

const paginatedGyms = computed(() => {
  const s = (currentPage.value - 1) * pageSize.value
  return currentZone.value.gyms.slice(s, s + pageSize.value)
})

// 切换管区
function switchZone(id: number) {
  currentZoneId.value = id
  currentPage.value = 1
  nextTick(renderCharts)
}

// 详细抽屉控制
const detailDrawerVisible = ref(false)
const selectedGym = ref<Gym | null>(null)
function openDetailDrawer(g: Gym) {
  selectedGym.value = g
  detailDrawerVisible.value = true
  nextTick(renderDetailChart)
}
function closeDetailDrawer() {
  detailDrawerVisible.value = false
  selectedGym.value = null
}

// echarts 实例缓存
const chartMap = new Map<number, echarts.ECharts>()
let detailChart: echarts.ECharts | null = null

// 渲染卡片折线图
function renderCharts() {
  paginatedGyms.value.forEach((g) => {
    const dom = document.getElementById('chart-' + g.id)
    if (!dom) return
    let c = chartMap.get(g.id)
    if (!c) {
      c = echarts.init(dom)
      chartMap.set(g.id, c)
    }
    c.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: g.records.map((r) => r.date.slice(5)),
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#aaa' } }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#aaa' } },
        splitLine: { lineStyle: { color: '#eee' } }
      },
      series: [
        {
          data: g.records.map((r) => r.visitors),
          type: 'line',
          smooth: true,
          areaStyle: { color: 'rgba(59,130,246,0.3)' },
          lineStyle: { color: '#3b82f6' }
        }
      ],
      grid: { left: 10, right: 10, top: 10, bottom: 20 }
    })
  })
}

// 渲染详细折线图
function renderDetailChart() {
  if (!selectedGym.value) return
  const dom = document.getElementById('detail-chart-' + selectedGym.value.id)
  if (!dom) return
  if (!detailChart) detailChart = echarts.init(dom)
  detailChart.setOption({
    title: { text: '每日客流量趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: selectedGym.value.records.map((r) => r.date) },
    yAxis: { type: 'value', name: '人数' },
    series: [
      {
        data: selectedGym.value.records.map((r) => r.visitors),
        type: 'line',
        smooth: true,
        areaStyle: { color: 'rgba(59,130,246,0.4)' },
        lineStyle: { color: '#3b82f6' }
      }
    ],
    grid: { left: 40, right: 20, top: 60, bottom: 60 }
  })
}

// 计算总客流和平均客流
function getTotalVisitors(r: { visitors: number }[]) {
  return r.reduce((a, b) => a + b.visitors, 0)
}
function getAverageVisitors(r: { visitors: number }[]) {
  if (r.length === 0) return 0
  return Math.round(getTotalVisitors(r) / r.length)
}

// 新增/编辑 弹窗逻辑
const gymDialogVisible = ref(false)
const gymDialogTitle = ref('添加健身房')

const gymFormRef = ref()
const gymForm = reactive({
  id: 0,
  zoneId: currentZoneId.value,
  name: '',
  location: '',
  contact: '',
  status: '',
  maintainerIds: [] as number[],
  maintainers: [] as Coach[],
  maintainTime: '',
  description: '',
  image: ''
})

const gymRules = {
  zoneId: [{ required: true, message: '请选择所属管区', trigger: 'change' }],
  name: [{ required: true, message: '请输入健身房名称', trigger: 'blur' }],
  location: [{ required: true, message: '请输入地址', trigger: 'blur' }],
  contact: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
  status: [{ required: true, message: '请选择租用状态', trigger: 'change' }],
  maintainerIds: [{ required: true, type: 'array', min: 1, message: '请选择维护教练', trigger: 'change' }]
}

function resetGymForm() {
  gymForm.id = 0
  gymForm.zoneId = currentZoneId.value
  gymForm.name = ''
  gymForm.location = ''
  gymForm.contact = ''
  gymForm.status = ''
  gymForm.maintainerIds = []
  gymForm.maintainers = []
  gymForm.maintainTime = ''
  gymForm.description = ''
  gymForm.image = ''
}

function openGymDialog(gym?: Gym) {
  if (gym) {
    gymDialogTitle.value = '编辑健身房'
    gymForm.id = gym.id
    gymForm.zoneId = gym.zoneId
    gymForm.name = gym.name
    gymForm.location = gym.location
    gymForm.contact = gym.contact
    gymForm.status = gym.status
    gymForm.maintainerIds = [...gym.maintainerIds]
    gymForm.maintainers = [...gym.maintainers]
    gymForm.maintainTime = gym.maintainTime
    gymForm.description = gym.description
    gymForm.image = gym.image
  } else {
    gymDialogTitle.value = '添加健身房'
    resetGymForm()
  }
  gymDialogVisible.value = true
}

function closeGymDialog() {
  gymDialogVisible.value = false
  resetGymForm()
}

// 上传图片限制 & 预览
function beforeUpload(file: File) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isJpgOrPng) {
    ElMessage.error('只支持 JPG/PNG 格式图片！')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！')
    return false
  }
  return true
}

function handleChange(info: { file: File }) {
  const file = info.file
  if (!beforeUpload(file)) return
  const reader = new FileReader()
  reader.onload = (e) => {
    gymForm.image = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

// 提交表单
function submitGymForm() {
  gymFormRef.value.validate((valid: boolean) => {
    if (!valid) return
    // 维护教练转换
    gymForm.maintainers = coachOptions.value.filter((c) => gymForm.maintainerIds.includes(c.id))

    if (gymForm.id === 0) {
      // 新增
      const newId = Math.max(0, ...zones.flatMap((z) => z.gyms.map((g) => g.id))) + 1
      const newGym: Gym = {
        id: newId,
        zoneId: gymForm.zoneId,
        name: gymForm.name,
        location: gymForm.location,
        contact: gymForm.contact,
        status: gymForm.status,
        maintainerIds: [...gymForm.maintainerIds],
        maintainers: [...gymForm.maintainers],
        maintainTime: gymForm.maintainTime,
        description: gymForm.description,
        image: gymForm.image,
        records: genRecords()
      }
      const zone = zones.find((z) => z.id === gymForm.zoneId)
      zone?.gyms.unshift(newGym)
      ElMessage.success('健身房添加成功')
    } else {
      // 编辑
      zones.forEach((zone) => {
        const idx = zone.gyms.findIndex((g) => g.id === gymForm.id)
        if (idx !== -1) {
          zone.gyms[idx] = {
            ...zone.gyms[idx],
            zoneId: gymForm.zoneId,
            name: gymForm.name,
            location: gymForm.location,
            contact: gymForm.contact,
            status: gymForm.status,
            maintainerIds: [...gymForm.maintainerIds],
            maintainers: [...gymForm.maintainers],
            maintainTime: gymForm.maintainTime,
            description: gymForm.description,
            image: gymForm.image
          }
        }
      })
      ElMessage.success('健身房更新成功')
    }
    gymDialogVisible.value = false
    resetGymForm()
    nextTick(renderCharts)
  })
}

// 删除
function deleteGym(id: number) {
  ElMessageBox.confirm('确认删除该健身房吗？', '删除确认', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      zones.forEach((zone) => {
        const idx = zone.gyms.findIndex((g) => g.id === id)
        if (idx !== -1) zone.gyms.splice(idx, 1)
      })
      ElMessage.success('删除成功')
      nextTick(renderCharts)
    })
    .catch(() => {})
}

// watch 分页和管区变化重新渲染图表
watch([paginatedGyms, currentZoneId], () => {
  nextTick(renderCharts)
})

onMounted(() => {
  renderCharts()
})
</script>

<style scoped>
/* 基础布局 */
body,
html {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f5f5f7;
  margin: 0;
  padding: 0;
}

h1,
h3 {
  color: #1f2937;
}

/* 卡片交互 */
.interactive-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border-radius: 1.5rem;
}
.interactive-card:hover {
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
  transform: translateY(-6px);
}

/* 详细抽屉 */
.custom-drawer .el-drawer__body {
  padding: 0;
}

/* 弹窗和表单 美化 */
.modern-gym-dialog .el-dialog__header {
  font-weight: 700;
  font-size: 22px;
  border-bottom: 1px solid #e6e6e6;
  padding-bottom: 16px;
}

.modern-gym-form {
  max-height: 65vh;
  overflow-y: auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.flex-item {
  flex: 1;
}

.ml-4 {
  margin-left: 16px;
}

/* 上传区域美化 */
.upload-dragger {
  border: 2px dashed #409eff;
  border-radius: 12px;
  padding: 28px 0;
  text-align: center;
  cursor: pointer;
  background-color: #f5faff;
  transition: background-color 0.3s ease;
}

.upload-dragger:hover {
  background-color: #e6f0ff;
}

.upload-text {
  font-weight: 600;
  font-size: 16px;
  color: #3b82f6;
  margin-top: 8px;
}

.upload-hint {
  font-size: 12px;
  color: #93c5fd;
  margin-top: 4px;
}

.uploaded-image {
  margin-top: 12px;
  width: 180px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
}

/* 底部按钮组 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 12px 0 0;
  border-top: 1px solid #e6e6e6;
}

.el-button {
  font-weight: 600;
}
</style>
