<template>
  <div class="home-container">
    <!-- 顶部导航栏占位 -->
    <div class="navbar-placeholder"></div>

    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <span class="hero-tag">智能管理系统</span>
          <h1 class="hero-title">重新定义<br />健身房运营体验</h1>
          <p class="hero-desc">一站式解决方案，助您打造高效、智能、盈利的健身场馆</p>
          <div class="hero-actions">
            <!-- <el-button type="primary" size="large" @click="navigateTo('/appointment/demo')">
              <i class="el-icon-rocket mr-2"></i>免费试用
            </el-button> -->
            <!-- <el-button type="text" size="large" @click="navigateTo('/about')">
              <i class="el-icon-info mr-2"></i>了解更多
            </el-button> -->
          </div>
        </div>
        <div class="hero-image">
          <img src="https://img95.699pic.com/photo/50108/8658.jpg_wh860.jpg" alt="智能健身房" class="hero-img" />
        </div>
      </div>
      <!-- 装饰元素 -->
      <div class="hero-decoration"></div>
    </section>

    <!-- 统计数据 -->
    <section class="stats-section">
      <div class="stats-container">
        <div class="stats-item" v-for="(item, idx) in statsList" :key="idx">
          <div class="stats-number" ref="statsNumberRefs[idx]">{{ item.number }}</div>
          <div class="stats-title">{{ item.title }}</div>
          <div class="stats-progress">
            <div class="stats-bar" :style="{ width: item.percentage }"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心功能 -->
    <section class="features-section">
      <div class="section-header">
        <span class="section-tag">核心功能</span>
        <h2 class="section-title">全方位管理解决方案</h2>
        <p class="section-desc">从会员管理到营销拓客，覆盖健身房运营全流程</p>
      </div>
      
      <div class="features-grid">
        <div 
          class="feature-card" 
          v-for="(item, idx) in featureList" 
          :key="idx"
          @click="navigateTo(item.link)"
        >
          <div class="feature-icon">
            <i :class="item.icon"></i>
          </div>
          <h3 class="feature-title">{{ item.title }}</h3>
          <p class="feature-desc">{{ item.desc }}</p>
          <div class="feature-link">
            了解更多 <i class="el-icon-arrow-right ml-1"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- 智能设备 -->
    <section class="iot-section">
      <div class="section-header">
        <span class="section-tag">IoT智能物联</span>
        <h2 class="section-title">打造无人值守健身房</h2>
        <p class="section-desc">智能设备无缝集成，提升运营效率与会员体验</p>
      </div>
      
      <div class="iot-grid">
        <div class="iot-card" v-for="(item, idx) in iotList" :key="idx">
          <div class="iot-image">
            <img :src="item.img" alt="智能设备" class="iot-img" />
          </div>
          <div class="iot-content">
            <div class="iot-icon">
              <i :class="item.icon"></i>
            </div>
            <h3 class="iot-title">{{ item.title }}</h3>
            <p class="iot-desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 解决方案 -->
    <section class="solution-section">
      <div class="solution-container">
        <div class="solution-image">
          <img src="https://bpic.588ku.com/back_list_pic/20/11/05/0a893653ed814c6f1fb33f3fd33deb48.jpg!/fh/300/quality/90/unsharp/true/compress/true" alt="解决方案" class="solution-img" />
        </div>
        <div class="solution-content">
          <!-- <span class="section-tag">解决方案</span> -->
          <h2 class="section-title">适用于各类健身场馆</h2>
          <p class="section-desc">无论您经营的是小型工作室还是大型连锁俱乐部，我们都能提供定制化解决方案</p>
          
          <div class="solution-list">
            <div class="solution-item" v-for="(item, idx) in solutionList" :key="idx">
              <div class="solution-icon">
                <i class="el-icon-check"></i>
              </div>
              <div class="solution-text">
                <h4 class="solution-subtitle">{{ item.title }}</h4>
                <p class="solution-desc">{{ item.desc }}</p>
              </div>
            </div>
          </div>
          
          <!-- <el-button type="primary" size="large" class="mt-4" @click="navigateTo('/appointment/demo')">
            <i class="el-icon-s-claim mr-2"></i>预约演示
          </el-button> -->
        </div>
      </div>
    </section>

    <!-- 客户评价 -->
    <section class="testimonials-section">
      <div class="section-header">
        <span class="section-tag">客户评价</span>
        <h2 class="section-title">来自行业的认可</h2>
        <p class="section-desc">听听我们的客户如何评价我们的产品和服务</p>
      </div>
      
      <div class="testimonials-slider">
        <div class="testimonial-card" v-for="(item, idx) in testimonialList" :key="idx">
          <div class="testimonial-header">
            <div class="testimonial-avatar">
              <img :src="item.avatar" alt="客户头像" class="avatar-img" />
            </div>
            <div class="testimonial-info">
              <h4 class="testimonial-name">{{ item.name }}</h4>
              <p class="testimonial-position">{{ item.position }}</p>
            </div>
            <div class="testimonial-rating">
              <i class="el-icon-star-on"></i>
              <i class="el-icon-star-on"></i>
              <i class="el-icon-star-on"></i>
              <i class="el-icon-star-on"></i>
              <i class="el-icon-star-on"></i>
            </div>
          </div>
          <p class="testimonial-content">{{ item.content }}</p>
        </div>
      </div>
    </section>

    <!-- 合作品牌 -->
    <section class="partners-section">
      <div class="section-header">
        <span class="section-tag">合作伙伴</span>
        <h2 class="section-title">值得信赖的行业伙伴</h2>
        <p class="section-desc">携手行业领先品牌，共同推动健身行业发展</p>
      </div>
      
      <div class="partners-grid">
        <div class="partner-item" v-for="(item, idx) in partnerList" :key="idx">
          <img :src="item.logo" alt="合作伙伴" class="partner-logo" />
        </div>
      </div>
    </section>

    
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

// 获取路由实例
const router = useRouter()

// 统计数据
const statsList = ref([
  { number: '1000+', title: '合作场馆', percentage: '85%' },
  { number: '50万+', title: '会员数量', percentage: '92%' },
  { number: '98%', title: '客户满意度', percentage: '98%' },
  { number: '300+', title: '行业合作伙伴', percentage: '78%' },
])

// 核心功能
const featureList = ref([
  { 
    icon: 'el-icon-user', 
    title: '个人中心', 
    desc: '一站式管理会员资料、卡项权益、课程预约与健身数据的智能空间，助您随时掌握健身旅程。',
    link: '/personal-center/personal-data'
  },
  { 
    icon: 'el-icon-s-ticket', 
    title: '账号管理', 
    desc: '集成账号安全防护、个人信息编辑、权限设置与登录记录追踪的一站式管理平台，全方位保障账号安全与使用便捷。',
    link: '/account-management/account-security'
  },
  { 
    icon: 'el-icon-s-claim', 
    title: '健身房信息管理', 
    desc: '一站式整合场馆设施、设备状态、教练团队与课程安排的智能管理平台，通过数据可视化助力高效运营与决策。',
    link: '/gym-information/list-gyms'
  },
  { 
    icon: 'el-icon-s-marketing', 
    title: '教练管理', 
    desc: '集成教练资料归档、智能排班调度、业绩统计分析与培训发展的全流程管理体系，助力健身房优化人力配置与服务质量。',
    link: '/coach-management/coaching-information'
  },
  { 
    icon: 'el-icon-s-data', 
    title: '课程管理', 
    desc: '集成课程创建、智能排期、预约管理、资源分配与效果评估的全流程管理体系，助力健身房提升课程运营效率与会员学习体验。',
    link: '/course-management/general-course'
  },
  { 
    icon: 'el-icon-s-shop', 
    title: '会员卡管理', 
    desc: '集成卡种配置、开卡续费、权益规则、消费记录与到期提醒的全流程管理体系，助力健身房提升会员粘性与场馆营收效率。',
    link: '/member-shipcard/member-registration'
  },
])

// IoT智能设备
const iotList = ref([
  { 
    icon: 'el-icon-camera', 
    title: 'VR导览', 
    desc: '实景导航，足不出户参观场馆',
    img: 'https://pic.vjshi.com/2022-08-05/3127e7ac0048405baaa4e86051bace20/00002.jpg?x-oss-process=style/watermark'
  },
  { 
    icon: 'el-icon-user', 
    title: '人脸门禁', 
    desc: '人脸识别，秒级验证入场',
    img: 'https://img48.afzhan.com/418afcb93361055db490a3c52848763591b6b06046cee12b85f295d3698626846d4e4f23c72521b8.jpg'
  },
  { 
    icon: 'el-icon-s-claim', 
    title: '智慧前台', 
    desc: '人脸签到，自动消课计费',
    img: 'https://img.zx123.cn/Resources/zx123cn/uploadfile/2022/0402/d91cee718f94619e31d0092e1cc5407c.jpg'
  },

])

// 解决方案
const solutionList = ref([
  { 
    title: '综合健身房', 
    desc: '全方位管理解决方案，满足大型综合健身房复杂业务需求' 
  },
  { 
    title: '私教工作室', 
    desc: '专注私教业务流程，提升教练工作效率，优化会员私教体验' 
  },
  { 
    title: '连锁俱乐部', 
    desc: '多门店统一管理平台，实现数据互通、资源共享与集中管控' 
  },
  { 
    title: '专项训练馆', 
    desc: '针对瑜伽、搏击、游泳等专项场馆的定制化解决方案' 
  },
])

// 客户评价
const testimonialList = ref([
  { 
    name: '张教练', 
    position: '某大型连锁健身房运营总监', 
    avatar: 'https://picsum.photos/id/1005/100/100',
    content: '自从使用了这个系统，我们的运营效率提升了40%，会员流失率下降了25%。系统功能非常全面，从会员管理到营销推广，一应俱全。'
  },
  { 
    name: '李女士', 
    position: '某高端私教工作室创始人', 
    avatar: 'https://picsum.photos/id/1006/100/100',
    content: '作为一家专注高端服务的私教工作室，我们对系统的要求很高。这个平台的私教管理模块非常出色，帮助我们的教练节省了大量时间，提升了服务质量。'
  },
  { 
    name: '王先生', 
    position: '某社区健身房老板', 
    avatar: 'https://picsum.photos/id/1012/100/100',
    content: '作为小业主，我最关心的是成本和效率。这个系统性价比极高，不仅功能强大，而且操作简单，培训成本几乎为零。现在我可以随时随地管理我的健身房。'
  },
])

// 合作伙伴
const partnerList = ref([
  { logo: 'https://img95.699pic.com/photo/50166/3256.jpg_wh860.jpg' },
  { logo: 'https://img95.699pic.com/photo/50094/5850.jpg_wh860.jpg' },
  { logo: 'https://img95.699pic.com/photo/50110/3116.jpg_wh860.jpg' },
  { logo: 'https://ts1.tc.mm.bing.net/th/id/R-C.b983879f0f18870d70996aa2acb2a63a?rik=Du4LX%2bYso6Jf%2bQ&riu=http%3a%2f%2ffitimg.yunimg.cn%2fproduction%2fitem%2f202008%2f171597627110-3883139802567691776.png&ehk=2LwQmRESLb7CE1hvCZ3i9%2bYplDxtpBc77Z%2b5dlDYMaY%3d&risl=&pid=ImgRaw&r=0' },
  { logo: 'https://img95.699pic.com/photo/60026/6369.jpg_wh860.jpg' },
  { logo: 'https://bpic.588ku.com/back_origin_min_pic/23/06/14/ea9d3fb1e3d480798e53b9da68fd736f.jpg!/fw/750/quality/99/unsharp/true/compress/true' },
])

// 数字动画效果
const statsNumberRefs = ref([])
onMounted(() => {
  nextTick(() => {
    statsNumberRefs.value.forEach((el, idx) => {
      const target = parseInt(statsList.value[idx].number.replace(/\+|%/g, ''))
      const suffix = statsList.value[idx].number.replace(/[0-9]/g, '')
      let current = 0
      const duration = 2000 // 动画持续时间
      const interval = 20   // 刷新间隔
      const step = target / (duration / interval)
      
      const timer = setInterval(() => {
        current += step
        if (current >= target) {
          clearInterval(timer)
          current = target
        }
        el.textContent = `${Math.floor(current)}${suffix}`
      }, interval)
    })
  })
})

// 路由跳转函数
const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
/* 全局样式 */
.home-container {
  background-color: #f9fafc;
  overflow-x: hidden;
  font-family: 'Inter', system-ui, sans-serif;
}

/* 导航栏占位 */
.navbar-placeholder {
  height: 60px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

/* 英雄区域 */
.hero-section {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: #fff;
  padding: 100px 24px; /* 减小上下内边距 */
  position: relative;
  overflow: hidden;
}
.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background: url('https://picsum.photos/id/176/1200/800') no-repeat center right;
  background-size: cover;
  opacity: 0.08;
  z-index: 0;
  transform: scale(1.1);
}
.hero-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 60'%3E%3Cpath fill='%23f9fafc' fill-opacity='1' d='M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z'%3E%3C/path%3E%3C/svg%3E") no-repeat bottom;
  background-size: cover;
}
.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  position: relative;
  z-index: 1;
  gap: 30px; /* 减小间隙 */
}
.hero-text {
  flex: 1;
  min-width: 300px;
  padding-right: 30px; /* 减小右内边距 */
  max-width: 600px;
}
.hero-tag {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.15);
  padding: 6px 18px;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 20px; /* 减小底部外边距 */
  backdrop-filter: blur(4px);
  letter-spacing: 0.5px;
}
.hero-title {
  font-size: clamp(2.5rem, 5vw, 3.8rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 20px; /* 减小底部外边距 */
  letter-spacing: -0.5px;
}
.hero-desc {
  font-size: 1.15rem;
  line-height: 1.7;
  margin-bottom: 30px; /* 减小底部外边距 */
  color: rgba(255, 255, 255, 0.9);
  max-width: 500px;
}
.hero-actions {
  display: flex;
  gap: 16px; /* 减小按钮间隙 */
  flex-wrap: wrap;
}
.hero-actions .el-button {
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.hero-actions .el-button--primary {
  background-color: #fff;
  color: #3b82f6;
  border-color: #fff;
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.3);
}
.hero-actions .el-button--primary:hover {
  background-color: #f8fafc;
  border-color: #f8fafc;
  transform: translateY(-3px);
  box-shadow: 0 12px 30px -8px rgba(59, 130, 246, 0.4);
}
.hero-actions .el-button--text {
  color: #fff;
  padding: 12px 20px;
  position: relative;
}
.hero-actions .el-button--text::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.3);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}
.hero-actions .el-button--text:hover {
  color: #f0f0f0;
  transform: translateY(-2px);
}
.hero-actions .el-button--text:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
.hero-image {
  flex: 1;
  min-width: 300px;
  display: flex;
  justify-content: center;
  position: relative;
}
.hero-image::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  border-radius: 50%;
  transform: scale(1.1);
  z-index: -1;
}
.hero-img {
  max-width: 100%;
  border-radius: 16px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  transform: rotate(2deg);
  transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  max-height: 500px;
  object-fit: cover;
}
.hero-img:hover {
  transform: rotate(0deg) scale(1.03);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
}

/* 统计数据区域 */
.stats-section {
  background-color: #fff;
  padding: 70px 24px; /* 减小上下内边距 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 2;
}
.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px; /* 减小间隙 */
}
.stats-item {
  text-align: center;
  padding: 25px 20px; /* 减小内边距 */
  border-radius: 16px;
  transition: all 0.4s ease;
  background-color: #f9fafc;
  position: relative;
  overflow: hidden;
}
.stats-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}
.stats-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}
.stats-item:hover::before {
  transform: scaleX(1);
}
.stats-number {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 10px; /* 减小底部外边距 */
  line-height: 1.2;
  letter-spacing: -0.5px;
}
.stats-title {
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 12px; /* 减小底部外边距 */
  font-weight: 500;
}
.stats-progress {
  height: 6px;
  background-color: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
  width: 80%;
  margin: 0 auto;
}
.stats-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 3px;
  transition: width 1.5s ease-in-out;
}

/* 通用部分样式 */
.section {
  padding: 100px 24px; /* 减小上下内边距 */
}
.section-header {
  text-align: center;
  margin-bottom: 60px; /* 减小底部外边距 */
  position: relative;
}
.section-header::after {
  content: '';
  position: absolute;
  width: 60px;
  height: 4px;
  background-color: #3b82f6;
  border-radius: 2px;
  bottom: -15px; /* 减小距离 */
  left: 50%;
  transform: translateX(-50%);
}
.section-tag {
  display: inline-block;
  background-color: rgba(59, 130, 246, 0.1);
  color: #1e40af;
  padding: 6px 18px;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 15px; /* 减小底部外边距 */
  letter-spacing: 0.5px;
}
.section-title {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 18px; /* 减小底部外边距 */
  line-height: 1.3;
}
.section-desc {
  font-size: 1.1rem;
  color: #64748b;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.7;
}

/* 核心功能区域 */
.features-section {
  background-color: #f9fafc;
  padding: 100px 24px; /* 减小上下内边距 */
  position: relative;
}
.features-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 60'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z'%3E%3C/path%3E%3C/svg%3E") no-repeat top;
  background-size: cover;
}
.features-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px; /* 减小间隙 */
}
.feature-card {
  background-color: #fff;
  padding: 35px 25px; /* 减小内边距 */
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #f1f5f9;
}
.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #3b82f6, #60a5fa);
  transform: scaleY(0);
  transition: transform 0.4s ease;
}
.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}
.feature-card:hover::before {
  transform: scaleY(1);
}
.feature-icon {
  width: 64px;
  height: 64px;
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  margin-bottom: 20px; /* 减小底部外边距 */
  transition: all 0.4s ease;
}
.feature-card:hover .feature-icon {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: #fff;
  transform: translateY(-5px);
}
.feature-title {
  font-size: 1.35rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 14px; /* 减小底部外边距 */
  transition: color 0.3s ease;
}
.feature-card:hover .feature-title {
  color: #1e40af;
}
.feature-desc {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 20px; /* 减小底部外边距 */
}
.feature-link {
  color: #3b82f6;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  font-size: 0.95rem;
}
.feature-link:hover {
  color: #1e40af;
  transform: translateX(8px);
}

/* IoT智能设备区域 */
.iot-section {
  background-color: #fff;
  padding: 100px 24px; /* 减小上下内边距 */
}
.iot-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 28px; /* 减小间隙 */
}
.iot-card {
  background-color: #f9fafc;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  display: flex;
  flex-direction: column;
  border: 1px solid #f1f5f9;
}
.iot-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}
.iot-image {
  height: 200px;
  overflow: hidden;
  position: relative;
}
.iot-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.2) 100%);
  z-index: 1;
}
.iot-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s cubic-bezier(0.25, 1, 0.5, 1);
}
.iot-card:hover .iot-img {
  transform: scale(1.1);
}
.iot-content {
  padding: 28px; /* 减小内边距 */
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
}
.iot-icon {
  width: 56px;
  height: 56px;
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  margin-bottom: 18px; /* 减小底部外边距 */
  transition: all 0.4s ease;
}
.iot-card:hover .iot-icon {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: #fff;
  transform: translateY(-5px);
}
.iot-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 10px; /* 减小底部外边距 */
}
.iot-desc {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.7;
}

/* 解决方案区域 */
.solution-section {
  background-color: #f9fafc;
  padding: 100px 24px; /* 减小上下内边距 */
  position: relative;
}
.solution-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 60'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z'%3E%3C/path%3E%3C/svg%3E") no-repeat top;
  background-size: cover;
}
.solution-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 50px; /* 减小间隙 */
}
.solution-image {
  flex: 1;
  min-width: 300px;
  position: relative;
}
.solution-image::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%);
  border-radius: 50%;
  z-index: -1;
  transform: scale(1.1);
}
.solution-img {
  max-width: 100%;
  border-radius: 16px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  max-height: 500px;
  object-fit: cover;
}
.solution-img:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.15);
}
.solution-content {
  flex: 1;
  min-width: 300px;
  max-width: 600px;
}
.solution-list {
  margin-top: 40px; /* 减小顶部外边距 */
}
.solution-item {
  display: flex;
  margin-bottom: 30px; /* 减小底部外边距 */
  align-items: flex-start;
  transition: transform 0.3s ease;
}
.solution-item:hover {
  transform: translateX(10px);
}
.solution-icon {
  width: 36px;
  height: 36px;
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  margin-right: 16px; /* 减小右外边距 */
  margin-top: 3px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}
.solution-item:hover .solution-icon {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: #fff;
}
.solution-subtitle {
  font-size: 1.15rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 5px; /* 减小底部外边距 */
}
.solution-desc {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.7;
}
.solution-container .el-button {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.2);
}
.solution-container .el-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
  background: linear-gradient(135deg, #3279e9, #1e40af);
}

/* 客户评价区域 */
.testimonials-section {
  background-color: #fff;
  padding: 100px 24px; /* 减小上下内边距 */
}
.testimonials-slider {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 28px; /* 减小间隙 */
}
.testimonial-card {
  background-color: #f9fafc;
  padding: 32px; /* 减小内边距 */
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  border: 1px solid #f1f5f9;
  position: relative;
}
.testimonial-card::before {
  content: '"';
  position: absolute;
  top: 20px;
  right: 24px;
  font-size: 4rem;
  color: rgba(59, 130, 246, 0.1);
  font-family: Georgia, serif;
  line-height: 1;
}
.testimonial-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}
.testimonial-header {
  display: flex;
  align-items: center;
  margin-bottom: 18px; /* 减小底部外边距 */
}
.testimonial-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 16px; /* 减小右外边距 */
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.testimonial-info {
  flex: 1;
}
.testimonial-name {
  font-size: 1.15rem;
  font-weight: 600;
  color: #1e293b;
}
.testimonial-position {
  font-size: 0.9rem;
  color: #64748b;
}
.testimonial-rating {
  color: #f59e0b;
  font-size: 0.9rem;
}
.testimonial-content {
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.8;
  font-style: italic;
  position: relative;
  z-index: 1;
}

/* 合作伙伴区域 */
.partners-section {
  background-color: #f9fafc;
  padding: 100px 24px; /* 减小上下内边距 */
  position: relative;
}
.partners-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 60'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z'%3E%3C/path%3E%3C/svg%3E") no-repeat top;
  background-size: cover;
}
.partners-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 35px; /* 减小间隙 */
  align-items: center;
  justify-items: center;
}
.partner-item {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.65;
  transition: all 0.4s ease;
  filter: grayscale(100%);
}
.partner-item:hover {
  opacity: 1;
  transform: scale(1.1) translateY(-5px);
  filter: grayscale(0);
}
.partner-logo {
  max-width: 100%;
  max-height: 80px;
  object-fit: contain;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-section {
    padding: 80px 24px;
  }
  .hero-title {
    font-size: 2.2rem;
  }
  .hero-text {
    padding-right: 0;
    margin-bottom: 20px;
  }
  .section {
    padding: 80px 24px;
  }
  .section-title {
    font-size: 1.8rem;
  }
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px; /* 进一步减小小屏幕间隙 */
  }
  .testimonials-slider {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .solution-container {
    gap: 30px; /* 减小小屏幕间隙 */
  }
  .partners-grid {
    gap: 25px; /* 减小小屏幕间隙 */
  }
  .iot-grid {
    gap: 20px; /* 减小小屏幕间隙 */
  }
}

@media (max-width: 480px) {
  .stats-container {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  .hero-actions {
    flex-direction: column;
    gap: 12px;
  }
  .hero-actions .el-button {
    width: 100%;
  }
}
</style>