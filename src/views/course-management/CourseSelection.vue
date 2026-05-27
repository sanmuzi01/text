<template>
    <div class="app-container">
      <!-- 顶部标题区域 -->
      <div class="header">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold mb-2"><i class="fas fa-dumbbell mr-3"></i>课程预约系统</h1>
            <p class="opacity-90">选择最适合您的课程，开启健康生活</p>
          </div>
          <div class="flex space-x-3">
            <el-button type="primary" @click="viewMyCourses" size="large">
              <i class="fas fa-calendar-check mr-2"></i>我的课程
            </el-button>
            <el-button @click="refreshCourses" size="large">
              <i class="fas fa-sync-alt mr-2"></i>刷新
            </el-button>
          </div>
        </div>
      </div>
      
      <!-- 搜索区域 -->
      <div class="search-card">
        <el-form :model="searchForm" class="search-form flex flex-wrap items-end gap-4 mb-6">
          <el-form-item label="课程名称" class="flex-1 min-w-[200px]">
            <el-input v-model="searchForm.courseName" placeholder="请输入课程名称" clearable>
              <template #prefix>
                <i class="fas fa-book"></i>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item label="教练姓名" class="flex-1 min-w-[200px]">
            <el-input v-model="searchForm.coachName" placeholder="请输入教练姓名" clearable>
              <template #prefix>
                <i class="fas fa-user-tie"></i>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item label="健身器材" class="flex-1 min-w-[200px]">
            <el-input v-model="searchForm.equipment" placeholder="请输入器材名称" clearable>
              <template #prefix>
                <i class="fas fa-dumbbell"></i>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item class="flex items-end">
            <el-button type="primary" @click="handleSearch">
              <i class="fas fa-search mr-2"></i>搜索
            </el-button>
            <el-button @click="resetSearch">
              <i class="fas fa-redo mr-2"></i>重置
            </el-button>
          </el-form-item>
        </el-form>
        
        <el-tabs v-model="activeTab" class="mb-6">
          <el-tab-pane label="全部课程" name="all"></el-tab-pane>
          <el-tab-pane label="热门课程" name="popular"></el-tab-pane>
          <el-tab-pane label="新课上线" name="new"></el-tab-pane>
        </el-tabs>
        
        <div v-if="filteredCourses.length === 0" class="no-courses">
          <i class="fas fa-inbox"></i>
          <p class="text-lg mt-2">没有找到符合条件的课程</p>
          <el-button type="primary" class="mt-4" @click="resetSearch">重置筛选条件</el-button>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="course in paginatedCourses" :key="course.id" 
               :class="['course-card', isCourseSelected(course.id) ? 'selected-course' : '']">
            <div class="relative">
              <img :src="course.coachAvatar" alt="教练头像">
              <div class="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                {{ course.coachName }} 教练
              </div>
              <div v-if="course.type === 'popular'" class="course-badge bg-red-500 text-white">
                <i class="fas fa-fire mr-1"></i>热门课程
              </div>
              <div v-else-if="course.type === 'new'" class="course-badge bg-green-500 text-white">
                <i class="fas fa-certificate mr-1"></i>新课上线
              </div>
            </div>
            
            <div class="p-5">
              <h3 class="text-xl font-bold text-gray-800 mb-2">{{ course.courseName }}</h3>
              
              <div class="flex items-center text-sm text-gray-600 mb-3">
                <i class="fas fa-clock mr-2"></i>
                <span>{{ course.courseTime }}</span>
              </div>
              
              <div class="mb-4">
                <p class="text-gray-700 mb-2">使用器材：</p>
                <div>
                  <span v-for="(equipment, index) in course.equipmentList" :key="index" 
                        class="equipment-tag">
                    {{ equipment }}
                  </span>
                </div>
              </div>
              
              <div class="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                <div class="text-blue-600 font-bold">
                  ¥{{ course.price }}/课时
                </div>
                <div class="text-sm text-gray-500">
                  <i class="fas fa-users mr-1"></i> {{ course.enrolledCount }}人已预约
                </div>
              </div>
              
              <div class="mt-4">
                <el-button 
                  type="primary" 
                  class="w-full"
                  :disabled="isCourseSelected(course.id)"
                  @click="handleSelectCourse(course)"
                >
                  <i class="fas fa-calendar-plus mr-2"></i>
                  {{ isCourseSelected(course.id) ? '已预约' : '预约课程' }}
                </el-button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="pagination-container">
          <el-pagination
            background
            layout="prev, pager, next, sizes"
            :total="filteredCourses.length"
            :page-sizes="[6, 12, 18]"
            :page-size="pageSize"
            v-model:current-page="currentPage"
          />
        </div>
      </div>
    </div>
    
    <!-- 预约信息弹窗 -->
    <el-dialog
      v-model="bookingDialogVisible"
      title="填写预约信息"
      width="90%"
      :max-width="600"
      center
    >
      <el-form :model="bookingForm" :rules="bookingRules" ref="bookingFormRef" label-width="100px">
        <el-form-item label="课程信息" prop="course">
          <div class="border rounded-lg p-4 bg-gray-50">
            <h4 class="font-bold text-lg text-gray-800">{{ selectedCourse.courseName }}</h4>
            <p class="text-gray-600 mt-1">
              <i class="fas fa-user-tie mr-2"></i>教练: {{ selectedCourse.coachName }}
            </p>
            <p class="text-gray-600">
              <i class="fas fa-clock mr-2"></i>时间: {{ selectedCourse.courseTime }}
            </p>
          </div>
        </el-form-item>
        
        <el-form-item label="学员姓名" prop="name">
          <el-input v-model="bookingForm.name" placeholder="请输入您的姓名" clearable />
        </el-form-item>
        
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="bookingForm.phone" placeholder="请输入您的手机号码" clearable />
        </el-form-item>
        
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="bookingForm.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="bookingForm.age" :min="14" :max="70" />
        </el-form-item>
        
        <el-form-item label="健身目标" prop="goal">
          <el-select v-model="bookingForm.goal" placeholder="请选择您的健身目标" class="w-full">
            <el-option label="减脂塑形" value="减脂塑形"></el-option>
            <el-option label="增肌强化" value="增肌强化"></el-option>
            <el-option label="力量训练" value="力量训练"></el-option>
            <el-option label="康复训练" value="康复训练"></el-option>
            <el-option label="提升体能" value="提升体能"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="特殊要求" prop="notes">
          <el-input 
            v-model="bookingForm.notes" 
            type="textarea" 
            placeholder="请填写您的特殊要求（如身体状况、特殊需求等）" 
            :rows="3"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="flex justify-center gap-4">
          <el-button @click="bookingDialogVisible = false" size="large">取消</el-button>
          <el-button type="primary" @click="confirmBooking" size="large">确认预约</el-button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 我的课程弹窗 -->
    <el-dialog
      v-model="myCoursesDialogVisible"
      title="我的预约课程"
      width="90%"
      :max-width="1000"
    >
      <div v-if="myCourses.length === 0" class="no-courses py-10">
        <i class="fas fa-calendar-times text-5xl"></i>
        <p class="text-xl mt-4">您还没有预约任何课程</p>
        <el-button type="primary" class="mt-6" @click="myCoursesDialogVisible = false">
          去预约课程
        </el-button>
      </div>
      
      <div v-else>
        <el-table :data="myCourses" stripe style="width: 100%">
          <el-table-column prop="courseName" label="课程名称" width="200" />
          <el-table-column prop="coachName" label="教练" width="120" />
          <el-table-column label="上课时间">
            <template #default="{row}">
              <div class="flex items-center">
                <i class="fas fa-clock text-blue-500 mr-2"></i>
                <span>{{ row.courseTime }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="学员信息">
            <template #default="{row}">
              <div>
                <div>{{ row.userInfo.name }}</div>
                <div class="text-sm text-gray-600">{{ row.userInfo.phone }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="预约时间" width="150">
            <template #default="{row}">
              <div class="text-sm">{{ formatDate(row.bookingTime) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{row}">
              <el-tag :type="row.status === 'confirmed' ? 'success' : 'warning'">
                {{ row.status === 'confirmed' ? '已确认' : '待确认' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="{row}">
              <el-button size="small" @click="cancelBooking(row)">
                取消预约
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <template #footer>
        <div class="flex justify-end">
          <el-button @click="myCoursesDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  
  // 搜索表单数据
  const searchForm = reactive({
    courseName: '',
    coachName: '',
    equipment: ''
  });
  
  // 活动标签
  const activeTab = ref('all');
  
  // 分页数据
  const currentPage = ref(1);
  const pageSize = ref(6);
  
  // 弹窗控制
  const bookingDialogVisible = ref(false);
  const myCoursesDialogVisible = ref(false);
  
  // 当前选中的课程
  const selectedCourse = ref({});
  
  // 预约表单数据
  const bookingForm = reactive({
    name: '',
    phone: '',
    gender: '男',
    age: 28,
    goal: '',
    notes: ''
  });
  
  // 预约表单验证规则
  const bookingRules = reactive({
    name: [
      { required: true, message: '请输入学员姓名', trigger: 'blur' },
      { min: 2, max: 10, message: '姓名长度在2到10个字符', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入联系电话', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ],
    gender: [
      { required: true, message: '请选择性别', trigger: 'change' }
    ],
    age: [
      { required: true, message: '请输入年龄', trigger: 'blur' }
    ],
    goal: [
      { required: true, message: '请选择健身目标', trigger: 'change' }
    ]
  });
  
  // 预约表单引用
  const bookingFormRef = ref(null);
  
  // 模拟课程数据
  const courses = ref([
    {
      id: 1,
      courseName: '增肌塑形训练',
      courseTime: '每周一、三、五 19:00-20:30',
      coachName: '张强',
      coachAvatar: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      equipmentList: ['杠铃', '哑铃', '卧推凳'],
      enrolledCount: 24,
      price: 380,
      type: 'popular'
    },
    {
      id: 2,
      courseName: '核心力量提升',
      courseTime: '每周二、四 18:30-20:00',
      coachName: '李娜',
      coachAvatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      equipmentList: ['瑜伽球', '弹力带', '腹肌轮'],
      enrolledCount: 18,
      price: 320,
      type: 'all'
    },
    {
      id: 3,
      courseName: '拳击技巧训练',
      courseTime: '每周三、六 10:00-11:30',
      coachName: '王刚',
      coachAvatar: 'https://images.unsplash.com/photo-1549476464-37392f717541?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      equipmentList: ['拳击手套', '沙袋', '速度球'],
      enrolledCount: 32,
      price: 400,
      type: 'popular'
    },
    {
      id: 4,
      courseName: '瑜伽私教课程',
      courseTime: '每周一、五 15:00-16:30',
      coachName: '陈芳',
      coachAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      equipmentList: ['瑜伽垫', '瑜伽砖', '伸展带'],
      enrolledCount: 15,
      price: 350,
      type: 'all'
    },
    {
      id: 5,
      courseName: '泰拳基础训练',
      courseTime: '每周二、四、六 20:00-21:30',
      coachName: '赵勇',
      coachAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      equipmentList: ['泰拳手套', '护具', '脚靶'],
      enrolledCount: 22,
      price: 420,
      type: 'new'
    },
    {
      id: 6,
      courseName: 'HIIT高强度训练',
      courseTime: '每周一、三、五 06:30-07:30',
      coachName: '刘伟',
      coachAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      equipmentList: ['跳绳', '壶铃', '健身垫'],
      enrolledCount: 27,
      price: 360,
      type: 'popular'
    },
    {
      id: 7,
      courseName: '动感单车私教',
      courseTime: '每周二、四、六 19:30-20:30',
      coachName: '王刚',
      coachAvatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      equipmentList: ['动感单车', '心率监测器'],
      enrolledCount: 18,
      price: 300,
      type: 'all'
    },
    {
      id: 8,
      courseName: '形体芭蕾',
      courseTime: '每周三、五 16:00-17:30',
      coachName: '杨丽',
      coachAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      equipmentList: ['把杆', '舞蹈鞋', '瑜伽垫'],
      enrolledCount: 11,
      price: 330,
      type: 'new'
    },
    {
      id: 9,
      courseName: '太极养生课程',
      courseTime: '每周一、四 07:00-08:00',
      coachName: '陈明',
      coachAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      equipmentList: ['太极扇', '太极剑'],
      enrolledCount: 9,
      price: 280,
      type: 'all'
    }
  ]);
  
  // 我的课程数据
  const myCourses = ref([]);
  
  // 计算属性 - 过滤后的课程
  const filteredCourses = computed(() => {
    let result = courses.value;
    
    // 根据标签过滤
    if (activeTab.value !== 'all') {
      result = result.filter(course => course.type === activeTab.value);
    }
    
    // 根据搜索条件过滤
    if (searchForm.courseName) {
      const query = searchForm.courseName.toLowerCase();
      result = result.filter(course => 
        course.courseName.toLowerCase().includes(query)
      );
    }
    
    if (searchForm.coachName) {
      const query = searchForm.coachName.toLowerCase();
      result = result.filter(course => 
        course.coachName.toLowerCase().includes(query)
      );
    }
    
    if (searchForm.equipment) {
      const query = searchForm.equipment.toLowerCase();
      result = result.filter(course => 
        course.equipmentList.some(e => e.toLowerCase().includes(query))
      );
    }
    
    return result;
  });
  
  // 计算属性 - 分页后的课程
  const paginatedCourses = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredCourses.value.slice(start, end);
  });
  
  // 检查课程是否已被预约
  const isCourseSelected = (courseId) => {
    return myCourses.value.some(course => course.id === courseId);
  };
  
  // 选择课程
  const handleSelectCourse = (course) => {
    selectedCourse.value = course;
    bookingDialogVisible.value = true;
    
    // 重置表单（保留用户可能已填写的信息）
    bookingForm.name = '';
    bookingForm.phone = '';
    bookingForm.gender = '男';
    bookingForm.age = 28;
    bookingForm.goal = '';
    bookingForm.notes = '';
  };
  
  // 确认预约
  const confirmBooking = () => {
    bookingFormRef.value.validate((valid) => {
      if (valid) {
        // 创建预约记录
        const bookingRecord = {
          id: selectedCourse.value.id,
          courseName: selectedCourse.value.courseName,
          coachName: selectedCourse.value.coachName,
          courseTime: selectedCourse.value.courseTime,
          price: selectedCourse.value.price,
          bookingTime: new Date().toISOString(),
          status: 'confirmed', // 假设预约即确认
          userInfo: {
            name: bookingForm.name,
            phone: bookingForm.phone,
            gender: bookingForm.gender,
            age: bookingForm.age,
            goal: bookingForm.goal,
            notes: bookingForm.notes
          }
        };
        
        // 添加到我的课程
        myCourses.value.push(bookingRecord);
        
        // 更新课程报名人数
        const courseIndex = courses.value.findIndex(c => c.id === selectedCourse.value.id);
        if (courseIndex !== -1) {
          courses.value[courseIndex].enrolledCount += 1;
        }
        
        // 关闭弹窗并显示成功消息
        bookingDialogVisible.value = false;
        ElMessage.success({
          message: '课程预约成功！',
          duration: 3000
        });
      }
    });
  };
  
  // 查看我的课程
  const viewMyCourses = () => {
    myCoursesDialogVisible.value = true;
  };
  
  // 取消预约
  const cancelBooking = (booking) => {
    ElMessageBox.confirm(
      `确定要取消 "${booking.courseName}" 的预约吗？`,
      '取消预约确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      // 从我的课程中移除
      const index = myCourses.value.findIndex(c => c.id === booking.id);
      if (index !== -1) {
        myCourses.value.splice(index, 1);
      }
      
      // 更新课程报名人数
      const courseIndex = courses.value.findIndex(c => c.id === booking.id);
      if (courseIndex !== -1 && courses.value[courseIndex].enrolledCount > 0) {
        courses.value[courseIndex].enrolledCount -= 1;
      }
      
      ElMessage.success('预约已取消');
    }).catch(() => {
      // 用户取消操作
    });
  };
  
  // 搜索课程
  const handleSearch = () => {
    currentPage.value = 1;
  };
  
  // 重置搜索
  const resetSearch = () => {
    searchForm.courseName = '';
    searchForm.coachName = '';
    searchForm.equipment = '';
    activeTab.value = 'all';
    currentPage.value = 1;
  };
  
  // 刷新课程
  const refreshCourses = () => {
    ElMessage.info('课程列表已刷新');
  };
  
  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };
  
  // 初始化
  onMounted(() => {
    // 模拟加载初始数据
  });
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap');
  
  * {
    /* margin: 0;
    padding: 0; */
    box-sizing: border-box;
    font-family: 'Noto Sans SC', sans-serif;
  }
  
  body {
    background-color: #f8f9fa;
    color: #333;
    line-height: 1.6;
  }
  
  .app-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .header {
    background: linear-gradient(135deg, #3498db, #1a5276);
    color: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 25px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  .search-card {
    background: white;
    border-radius: 12px;
    padding: 25px;
    margin-bottom: 30px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  }
  
  .course-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    border: 1px solid #eee;
    height: 100%;
  }
  
  .course-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }
  
  .course-card img {
    height: 200px;
    object-fit: cover;
    width: 100%;
  }
  
  .course-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }
  
  .equipment-tag {
    display: inline-block;
    background-color: #e8f4fc;
    color: #2980b9;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    margin-right: 5px;
    margin-bottom: 5px;
  }
  
  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    padding: 15px 0;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  
  .no-courses {
    text-align: center;
    padding: 40px 0;
    color: #7f8c8d;
  }
  
  .no-courses i {
    font-size: 48px;
    margin-bottom: 15px;
    color: #bdc3c7;
  }
  
  .selected-course {
    border: 2px solid #3498db;
    position: relative;
  }
  
  .selected-course::after {
    content: "已预约";
    position: absolute;
    top: 10px;
    right: 10px;
    background: #2ecc71;
    color: white;
    padding: 3px 10px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
  }
  
  @media (max-width: 768px) {
    .search-form {
      flex-direction: column;
    }
  
    .search-form .el-form-item {
      width: 100%;
    }
  
    .course-card img {
      height: 160px;
    }
  }
  </style>