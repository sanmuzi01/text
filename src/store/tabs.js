import { defineStore } from 'pinia'
import { computed,ref } from 'vue'
import { useRouter } from 'vue-router'

export const useTabsStore = defineStore('tabs', () => {
  const router = useRouter()
  const tabs = ref([{ title: '首页', name: 'Home' }])
  const activeTab = ref('Home')

  //添加标签函数
  const addTab = (route) => {
    if (!tabs.value.some(t => t.name === route.name)) {
      tabs.value.push({ title: route.title, name: route.name })
    }
    activeTab.value = route.name
  }

  const setActiveTab = (tabName) => {
    console.log("当前激活的标签：", tabName)
    activeTab.value = tabName
  }

  const closeTab = (tabName) => {
    console.log("closeTab： ", tabName)
    const index = tabs.value.findIndex(t => t.name === tabName)
    if (index !== -1) {
      tabs.value.splice(index, 1)
      if (activeTab.value === tabName) {
        const nextTab = tabs.value[index] || tabs.value[index - 1]
        if (nextTab) {
          activeTab.value = nextTab.name
          router.push({ name: nextTab.name })
        }
      }
    }
  }

  /****
   * 把tabs和activeTab恢复到默认值
   */
  const resetTabs = () => {
    tabs.value = [{ title: '首页', name: 'Home' }]
    activeTab.value = 'Home'
  }

  return {
    tabs,
    activeTab,
    addTab,
    setActiveTab,
    closeTab,
    resetTabs
  }
})