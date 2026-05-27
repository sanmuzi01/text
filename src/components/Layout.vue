<template>
  <el-container>
    <el-aside :width="isCollapse ? '64px' : '240px'" class="custom-aside">

      <div class="logo-container">
        <!-- **logo可改 -->
        <img src="@/assets/logo/logo-94-new.png" class="logo">
        <!-- **组名或其他 -->
        <span v-show="!isCollapse" class="logo-text">健身房管理系统</span>
      </div>

      <div class="menu-container">
        <el-menu @select="handleSelect" :default-active="activeTab" :collapse="isCollapse" class="aside-vertical-menu"
          :collapse-transition="false" :unique-opened="true">

          <template v-for="(topMenu, index) in topMenuList">
            <!-- 迭代有二级子菜单的菜单 -->
            <el-sub-menu v-if="topMenu.children && topMenu.children.length" :key="index" :index="topMenu.name">
              <template #title>
                <!-- <el-icon><component :is="topMenu.meta.icon" /></el-icon> -->
                <font-awesome-icon :icon="topMenu.meta.icon" class="menu-icon mr-2" />
                <span v-if="!isCollapse">{{ topMenu.meta.title }}</span>
              </template>
              <!-- 迭代二级子菜单 -->
              <el-menu-item v-for="child in topMenu.children" :key="child.name" :index="child.name">
                <!-- <el-icon><component :is="child.meta.icon" /></el-icon> -->
                <font-awesome-icon :icon="child.meta.icon" class="menu-icon mr-2" />
                <span>{{ child.meta.title }}</span>
              </el-menu-item>

            </el-sub-menu>
            <!-- 没有二级子菜单的菜单 -->
            <el-menu-item v-else="!topMenu.children && topMenu.meta" :key="index + 1" :index="topMenu.name">
              <!-- <el-icon><component :is="topMenu.meta.icon" /></el-icon> -->
              <font-awesome-icon :icon="topMenu.meta.icon" class="menu-icon mr-2" />
              <span>{{ topMenu.meta.title }}</span>
            </el-menu-item>

          </template>
        </el-menu>
      </div>

    </el-aside>

    <el-container>

      <el-header>
        <!-- 左侧：折叠菜单的控制按钮 -->
        <el-row class="header-content">
          <el-col :span="2">

            <el-button @click="toggleAside">
              <el-icon color="rgb(56,18,110)" size="large">
                <component :is="toggleIcon" />
              </el-icon>
            </el-button>

          </el-col>

          <!-- 右侧： 登录的信息信息 -->
          <el-col :span="22" style="text-align: right;">
            <el-dropdown>
              <span class="el-dropdown-link">
                <span>欢迎你,</span>
                <span style="margin:0 8px;">{{ userInfo.username }}</span>
                <font-awesome-icon :icon="['fas', 'chevron-down']" class="mr-2" />
                <el-avatar :size="60" :src="userInfo.avatar" />

              </span>
              <!-- 右上角下拉菜单 -->
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="info">个人信息</el-dropdown-item>
                  <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-col>

        </el-row>

      </el-header>

      <el-main>
        <!-- 标签页 -->
        <el-tabs v-model="currentActiveTab" @tab-click="handleTabClick" type="card" closable
          @tab-remove="handleTabRemove">

          <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.title" :name="tab.name">
            <div class="line"></div>

            <router-view v-slot="{ Component }" v-if="activeTab === tab.name">
              <transition name="move" mode="out-in">
                <keep-alive>
                  <component :is="Component"></component>
                </keep-alive>
              </transition>
            </router-view>

          </el-tab-pane>

        </el-tabs>

      </el-main>

      <el-footer>
        <el-text class="mx-1" type="info">Copyright &copy; 2024-2026 雨土 版权所有</el-text>
      </el-footer>

    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, watch, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTabsStore } from '@/store/tabs.js'

//用来控制左侧菜单的折叠状态
const isCollapse = ref(false)
//默认是展开状态的图标
const toggleIcon = ref("Fold")
//获取pinia中的标签管理tabs
const tabsStore = useTabsStore()
//获取路由器实例，用途：用于编程式导航和访问全局路由相关的方法和属性。
const router = useRouter()
//获取当前激活的路由对象， 用途：用于访问当前路由的信息，如路径、参数、查询参数、元数据等。
const route = useRoute()
//本页面中:当前激活的标签页
const currentActiveTab = ref(tabsStore.activeTab)

/*****
 * 通过计算属性来从路由表中获取左侧的菜单信息：
 * 注：这里只获取一级菜单项，要把子菜单项给过滤掉。
 * 判断route中的meta对象中的top属性来判断是否是顶级菜单项
 */
const topMenuList = computed(() => router.getRoutes().filter(r => r.meta.top))

/*************************
 * 处理菜单中的点击事件，当点击左侧的菜单时，需要把当前点击的菜单项添加到tabs中，并且采用编程式路由进行跳转、
 * 注：此方法只有当点击在 <el-menu-item>标签上时才会触发, 在<el-sub-menu>标签上，则不会触发
 */
const handleSelect = (index) => {
  console.log(">>你点击的菜单项是: ", index)
  console.log(">>>当前routes:", topMenuList.value)
  //找到你点击的菜单项，如果有子菜单项，则找到子菜单项。 这里的r.children? 使用了可选链操作符 (Optional Chaining Operator)。
  //它的作用是简化属性访问和方法调用时的条件判断，避免出现 undefined 或 null 导致的错误。它相当于：r.children && r.children.some(child => child.name === index)
  const menuRoute = topMenuList.value.find(r => r.name === index || r.children?.some(child => child.name === index))
  console.log("1. 你点击菜单对的路由对象: ", menuRoute)
  // 上面拿到的路由对象，则topMenu，接下来要判断当前点击的菜单项是否是子菜单项，如果是子菜单项，则需要找到子菜单项对应的路由对象
  const childRoute = menuRoute?.children?.find(child => child.name === index)
  console.log("2. 你点击菜单项的子菜单项: ", childRoute)
  // 根据判断结果，选择正确的路由对象
  const selectedRoute = childRoute || menuRoute
  console.log("3. 真正点击的路由: ", selectedRoute)
  if (selectedRoute && selectedRoute.meta) {
    //调用pinia中的标签管理中的添加标签的方法，把你选择的菜单项添加到tabs中
    //tabsStore.addTab(selectedRoute)
    tabsStore.addTab({ title: selectedRoute.meta.title, name: selectedRoute.name })
    // 编程式路由跳转
    router.push({ name: selectedRoute.name })
  }
}

const toggleAside = () => {
  isCollapse.value = !isCollapse.value
  //修改图标
  toggleIcon.value = isCollapse.value ? "Expand" : "Fold"
}

//通过计算属性来获取当前激活的标签页，因为tabsStore.activeTab是响应式的
const activeTab = computed(() => tabsStore.activeTab)
//const activeTab = tabsStore.activeTab
console.log("================ F5刷新后，默认activeTab: ", activeTab.value, "有本地存储时，会覆盖此值")
//24-8-8 fixbug-1: 清除本地存储的tabs, activeTab, isCollapse后，刷新后只显示首页，但页面内容没有变化，需要重新填入新的路由页面
router.push({ name: activeTab.value })
console.log("================ F5刷新后，载入与activeTab对应的页面路由，有本地存储时，在onMounted中会覆盖此值 ")
//tabs是要发生变化的，当关闭时，它的元素会删除
const tabs = computed(() => tabsStore.tabs)

const handleTabClick = (tab) => {
  console.log(">>> 点击了标签：", tab.props.label, "对象:", tab)
  //修改tabsStore中的activeTab
  tabsStore.setActiveTab(tab.props.name)
  //编程式路由
  router.push({ name: tab.props.name })
}

const handleTabRemove = (tabName) => {
  console.log("点击了删除标签按钮: ", tabName)
  tabsStore.closeTab(tabName)
}

// Watch for changes in tabs and activeTab to persist them
watch(tabs, (newTabs) => {
  console.log("watch tabs: ", newTabs)
  localStorage.setItem('tabs', JSON.stringify(newTabs))
}, { deep: true })

watch(activeTab, (newActiveTab) => {
  console.log("watch activeTab: ", newActiveTab)
  localStorage.setItem('activeTab', newActiveTab)
  //修改currentActiveTab值
  currentActiveTab.value = newActiveTab
})

//侦听isCollapse
watch(isCollapse, (newIsCollapse) => {
  localStorage.setItem('isCollapse', newIsCollapse)
})

// 页面加载时恢复状态
onMounted(() => {
  const savedTabs = JSON.parse(localStorage.getItem('tabs'))
  console.log('已保存的tabs: ', savedTabs)
  const savedActiveTab = localStorage.getItem('activeTab')
  console.log('已保存的activeTab: ', savedActiveTab)

  // 恢复isCollapse
  isCollapse.value = localStorage.getItem('isCollapse') === 'true'
  // 更新toggleIcon，保持与isCollapse同步
  toggleIcon.value = isCollapse.value ? "Expand" : "Fold"

  // 恢复tabs
  if (savedTabs) {
    savedTabs.forEach(tab => {
      tabsStore.addTab(tab)
    })
  }

  // 恢复activeTab
  if (savedActiveTab) {
    tabsStore.setActiveTab(savedActiveTab)
    // 更新本地的currentActiveTab
    currentActiveTab.value = savedActiveTab
    // 更新路由
    router.push({ name: savedActiveTab })
  }

})

/***********************************
 * 登录用户信息
 */
const userInfo = reactive({
  // **更改用户登录头像
  // avatar: '/src/assets/img/2.jfif',
  avatar: '/src/assets/img/4.jpg',
  username: '管理员'
})
/******
 * 把个人信息页面也添加到标签库中
 */
const info = () => {
  tabsStore.addTab({
    name: 'Info',
    title: '个人信息',
  })
  router.push({ name: 'Info' })
}

const logout = () => {
  console.log("你点击了退出按钮，页面重定向到登录页")
  //删除本地存储的tabs和activeTab
  tabsStore.resetTabs()
  router.push({ name: 'Login' })
}

</script>

<style scoped>
/* 确保 el-aside 高度为100% */
.custom-aside {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1a2a42;
  /* 深蓝色背景 */
  transition: width 0.3s ease;
}

.logo-container {
  padding: 8px;
  flex-shrink: 0;
  /* 防止logo区域被压缩 */
  background-color: #152238;
  /* 更深的蓝色背景 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  /* 添加分割线 */
}

.logo {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: inline;
}

.logo-text {
  font-size: 1.4em;
  font-weight: 700;
  color: rgb(255, 255, 255);
  margin-left: 15px;
}

.menu-container {
  flex: 1;
  /* 占据剩余空间 */
  overflow-y: auto;
  /* 添加滚动条 */
}

/** 优化不同浏览器滚动条的样式效果 */
.menu-container::-webkit-scrollbar {
  width: 6px;
}

.menu-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.menu-container::-webkit-scrollbar-track {
  background-color: transparent;
}

/* 统一高度计算 */
.aside-vertical-menu:not(.el-menu--collapse),
.el-menu--collapse {
  height: calc(100vh - 80px);
  /* 减去logo高度 */
}

/* 菜单样式： 背景色 */
.aside-vertical-menu {
  background-color: #1a2a42 !important;
  /* 深蓝色背景 */
  --el-menu-bg-color: #1a2a42 !important;
  /* 覆盖 Element Plus 变量 */
  border-right: none;
  transition: height 0.3s ease;
}

/* 菜单项基础样式 */
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  transition: all 0.3s ease;
  color: #a0aec0;
  /* 浅灰色文字 */
}

/* 所有菜单项悬停效果 */
:deep(.el-menu-item):hover,
:deep(.el-sub-menu):hover .el-sub-menu__title {
  background-color: #2d3748 !important;
  /* 深灰色悬停背景 */
  color: #ffffff !important;
  /* 白色文字 */
}

/* 所有菜单激活状态 */
:deep(.el-menu-item).is-active,
:deep(.el-sub-menu).is-active .el-sub-menu__title {
  background-color: #2c5282 !important;
  /* 深蓝色激活背景 */
  color: #ffffff !important;
  /* 白色文字 */
  border-left: 3px solid #4299e1;
  /* 左侧高亮指示条 */
}

/* 确保折叠时图标居中 */
.el-menu--collapse .el-sub-menu__title,
.el-menu--collapse .el-menu-item {
  display: flex;
  justify-content: center;
  padding: 0 5px !important;
}

/* 布局样式 */
.el-container {
  height: 100vh;
}

.el-header {
  background-color: #ffffff;
  /* 白色背景 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* 添加阴影增加层次感 */
  color: #333;
  text-align: left;
  line-height: 60px;
}

/* 折叠按钮样式 */
.el-button {
  background-color: transparent !important;
  border: none !important;
  padding: 5px !important;
}


.el-dropdown-link {
  color: #4a5568;
  /* 深灰色文字 */
}


/* 标签项基础样式 */
:deep(.el-tabs__item) {
  color: #718096;
  /* 中灰色文字 */
  border-radius: 4px 4px 0 0 !important;
  margin-right: 4px !important;
}

/* 自定义激活标签背景颜色 */
:deep(.el-tabs__item.is-active) {
  background-color: #ffffff !important;
  /* 白色背景 */
  color: #2c5282 !important;
  /* 深蓝色文字 */
  border-bottom: 2px solid #2c5282 !important;
  /* 底部高亮 */
}

/* 标签页鼠标悬停时状态 */
:deep(.el-tabs__item:hover) {
  color: #2c5282 !important;
  /* 深蓝色文字 */
}

/* 标签页样式 */
:deep(.el-tabs__header) {
  margin: 0 0 2px !important;
  background-color: #f7fafc;
  /* 浅灰色背景 */
  border-radius: 4px 4px 0 0;
  /* 圆角 */
}

.line {
  border: 1px solid #e2e8f0;
  /* 浅灰色分割线 */
  margin-bottom: 15px;
}

/* 用户信息区域 */
.el-main {
  background-color: #f7fafc;
  /* 浅灰色背景 */
  padding: 20px !important;
  /* 增加内边距 */
}

.el-footer {
  height: 40px;
  background-color: #ffffff;
  /* 白色背景 */
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #e2e8f0;
  /* 顶部边框 */
  color: #718096;
  /* 中灰色文字 */
}

.el-dropdown-link {
  display: inline-flex;
  align-items: center;
}
</style>