import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue')
  },
  {
    path: '/home/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    children: [
      {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: { title: '首页', icon: ['fas', 'house-user'], top: true }
      },
      {
        path: '/info',
        name: 'Info',
        component: () => import('@/views/Info.vue')
      },

      // 系统设置**个人中心
      {
        path: '/personal-center',
        name: 'PersonalCenter',
        meta: {
          // **
          title: '个人中心',
          icon: ['fas', 'user'],
          top: true
        },
        children: [
          {
            path: 'personal-data',
            name: 'PersonalData',
            // **
            component: () => import('@/views/personal-center/PersonalData.vue'),
            meta: {
              // **
              title: '个人资料',
              icon: ['far', 'address-card']
            }
          },
          {
            path: 'message-notifications',
            name: 'MessageNotifications',
            component: () => import('@/views/personal-center/MessageNotifications.vue'),
            meta: {
              title: '消息通知',
              icon: ['fas', 'envelope']
            }
          }
        ]
      },

      // 用户管理**账号管理
      {
        path: '/account-management',
        name: 'AccountManagement',
        meta: {
          title: '账号管理',
          icon: ['fas', 'cog'],
          top: true
        },
        children: [
          {
            path: 'account-security',
            name: 'AccountSecurity',
            component: () => import('@/views/account-management/AccountSecurity.vue'),
            meta: {
              title: '账号安全',
              icon: ['fas', 'shield']
            }
          },
          {
            path: 'password-modification',
            name: 'PasswordModification',
            component: () => import('@/views/account-management/PasswordModification.vue'),
            meta: {
              title: '密码重置',
              icon: ['fas', 'key']
            }
          }
          // ,
          // {
          //   path: 'login-logs',
          //   name: 'LoginLogs',
          //   component: () => import('@/views/account-management/LoginLogs.vue'),
          //   meta: {
          //     title: '登录日志',
          //     icon: ['fas', 'right-to-bracket']
          //   }
          // },
          // {
          //   path: 'operation-logs',
          //   name: 'OperationLogs',
          //   component: () => import('@/views/account-management/OperationLogs.vue'),
          //   meta: {
          //     title: '操作日志',
          //     icon: ['fas', 'clipboard-list']
          //   }
          // }
        ]
      },

      // 角色权限**健身房信息管理
      {
         path: '/gym-information',
  name: 'GymInformation',
  meta: {
    title: '健身房信息管理',
    icon: ['fas', 'film'],
    top: true
  },
  children: [
    {
      path: 'list-gyms',
      name: 'ListGyms',
      component: () => import('@/views/gym-information/ListGyms.vue'),
      meta: {
        title: '健身房列表',
        icon: ['fas', 'bars']
      }
    },
    {
 
  path: 'business-status',
  name: 'BusinessStatus',
  component: () => import('@/views/gym-information/BusinessStatus.vue'),
  meta: {
    title: '营业状况',
    icon: ['fas', 'bars'] // 改为和“健身房列表”一致的图标
  


      }
    }
  
          // ,
          // {
          //   path: 'permission-config',
          //   name: 'PermissionConfig',
          //   component: () => import('@/views/gym-information/PermissionConfig.vue'),
          //   meta: {
          //     title: '权限配置',
          //     icon: ['fas', 'key']
          //   }
          // },
          // {
          //   path: 'menu-management',
          //   name: 'MenuManagement',
          //   component: () => import('@/views/gym-information/MenuManagement.vue'),
          //   meta: {
          //     title: '菜单管理',
          //     icon: ['fas', 'bars']
          //   }
          // },
          // {
          //   path: 'api-permission',
          //   name: 'ApiPermission',
          //   component: () => import('@/views/gym-information/ApiPermission.vue'),
          //   meta: {
          //     title: '接口权限',
          //     icon: ['fas', 'plug']
          //   }
          // }
        ]
      },

      // 部门管理**教练管理
      {
        path: '/coach-management',
        name: 'CoachManagement',
        meta: {
          title: '教练管理',
          icon: ['fas', 'sitemap'],
          top: true
        },
        children: [
          {
            path: 'coaching-information',
            name: 'CoachingInformation',
            component: () => import('@/views/coach-management/CoachingInformation.vue'),
            meta: {
              title: '教练信息',
              icon: ['fas', 'poll-h']
            }
          }
          // ,
          // {
          //   path: 'position-management',
          //   name: 'PositionManagement',
          //   component: () => import('@/views/coach-management/PositionManagement.vue'),
          //   meta: {
          //     title: '岗位管理',
          //     icon: ['fas', 'briefcase']
          //   }
          // },
          // {
          //   path: 'personnel-assignment',
          //   name: 'PersonnelAssignment',
          //   component: () => import('@/views/coach-management/PersonnelAssignment.vue'),
          //   meta: {
          //     title: '人员分配',
          //     icon: ['fas', 'user-plus']
          //   }
          // }
        ]
      },

      // 系统工具**课程管理
      {
        path: '/course-management',
        name: 'CourseManagement',
        meta: {
          title: '课程管理',
          icon: ['fas', 'book-reader'],
          top: true
        },
        children: [
          {
            path: 'general-course',
            name: 'GeneralCourse',
            component: () => import('@/views/course-management/GeneralCourse.vue'),
            meta: {
              title: '普通课程信息',
              icon: ['fas', 'book-open']
            }
          },
          {
            path: 'private-lessons',
            name: 'PrivateLessons',
            component: () => import('@/views/course-management/PrivateLessons.vue'),
            meta: {
              title: '私教课程信息',
              icon: ['fas', 'book-medical']
            }
          }
          ,
          {
            path: 'course-selection',
            name: 'CourseSelection',
            component: () => import('@/views/course-management/CourseSelection.vue'),
            meta: {
              title: '用户选课',
              icon: ['fas', 'arrow-up-from-bracket']
            }
          }
          // ,
          // {
          //   path: 'task-scheduling',
          //   name: 'TaskScheduling',
          //   component: () => import('@/views/course-management/TaskScheduling.vue'),
          //   meta: {
          //     title: '任务调度',
          //     icon: ['fas', 'clock']
          //   }
          // }
        ]
      },

      // 开发工具**会员卡管理
      {
        path: '/member-shipcard',
        name: 'MemberShipcard',
        meta: {
          title: '会员卡管理',
          icon: ['fas', 'code'],
          top: true
        },
        children: [
          // {
          //   path: 'membership-information',
          //   name: 'MembershipInformation',
          //   component: () => import('@/views/member-shipcard/MembershipInformation.vue'),
          //   meta: {
          //     title: '会员信息',
          //     icon: ['fas', 'file-code']
          //   }
          // },
          {
            path: 'member-registration',
            name: 'MemberRegistration',
            component: () => import('@/views/member-shipcard/MemberRegistration.vue'),
            meta: {
              title: '会员管理',
              icon: ['fas', 'file-code']
            }
          },
          // {
          //   path: 'member-cancellation',
          //   name: 'MemberCancellation',
          //   component: () => import('@/views/member-shipcard/MemberCancellation.vue'),
          //   meta: {
          //     title: '会员注销',
          //     icon: ['fas', 'sign-out']
          //   }
          // }
          // ,
          // {
          //   path: 'log-viewer',
          //   name: 'LogViewer',
          //   component: () => import('@/views/member-shipcard/LogViewer.vue'),
          //   meta: {
          //     title: '日志查看',
          //     icon: ['fas', 'file-lines']
          //   }
          // }
        ]
      },

      // // 第三方服务**
      // {
      //   path: '/third-party-services',
      //   name: 'ThirdPartyServices',
      //   meta: {
      //     title: '第三方服务',
      //     icon: ['fas', 'plug'],
      //     top: true
      //   },
      //   children: [
      //     {
      //       path: 'payment-integration',
      //       name: 'PaymentIntegration',
      //       component: () => import('@/views/third-party-services/PaymentIntegration.vue'),
      //       meta: {
      //         title: '支付集成',
      //         icon: ['fas', 'money-bill-transfer']
      //       }
      //     },
      //     {
      //       path: 'sms-service',
      //       name: 'SmsService',
      //       component: () => import('@/views/third-party-services/SmsService.vue'),
      //       meta: {
      //         title: '短信服务',
      //         icon: ['fas', 'comment-sms']
      //       }
      //     },
      //     {
      //       path: 'map-service',
      //       name: 'MapService',
      //       component: () => import('@/views/third-party-services/MapService.vue'),
      //       meta: {
      //         title: '地图服务',
      //         icon: ['fas', 'map-location-dot']
      //       }
      //     },
      //     {
      //       path: 'social-login',
      //       name: 'SocialLogin',
      //       component: () => import('@/views/third-party-services/SocialLogin.vue'),
      //       meta: {
      //         title: '社交登录',
      //         icon: ['fas', 'share-nodes']
      //       }
      //     }
      //   ]
      // },

      // // 文档中心**
      // {
      //   path: '/documentation',
      //   name: 'Documentation',
      //   meta: {
      //     title: '文档中心',
      //     icon: ['fas', 'book'],
      //     top: true
      //   },
      //   children: [
      //     {
      //       path: 'user-manual',
      //       name: 'UserManual',
      //       component: () => import('@/views/documentation/UserManual.vue'),
      //       meta: {
      //         title: '使用手册',
      //         icon: ['fas', 'book-open']
      //       }
      //     },
      //     {
      //       path: 'api-documentation',
      //       name: 'ApiDocumentation',
      //       component: () => import('@/views/documentation/ApiDocumentation.vue'),
      //       meta: {
      //         title: 'API文档',
      //         icon: ['fas', 'file-code']
      //       }
      //     },
      //     {
      //       path: 'development-guide',
      //       name: 'DevelopmentGuide',
      //       component: () => import('@/views/documentation/DevelopmentGuide.vue'),
      //       meta: {
      //         title: '开发指南',
      //         icon: ['fas', 'code']
      //       }
      //     },
      //     {
      //       path: 'faq',
      //       name: 'FAQ',
      //       component: () => import('@/views/documentation/FAQ.vue'),
      //       meta: {
      //         title: 'FAQ',
      //         icon: ['fas', 'circle-question']
      //       }
      //     }
      //   ]
      // },

    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

// router/index.js
router.beforeEach((to, from, next) => {
  console.log('路由跳转:', from.path, '->', to.path)
  next()
})