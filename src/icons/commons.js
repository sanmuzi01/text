/***
 * 在这里导入你的项目页面中所需要的awesomefont图标【不含品牌图标和菜单图标】
 * @param {string} iconName - 图标名称
 */
import { library } from '@fortawesome/fontawesome-svg-core'

// 按需导入具体图标
import { 
  faPlus, faEdit, faTrash,faSearch,
  faBell, faSignOutAlt,
  faEnvelope, faCalendar, faList,
  faChevronDown, faChevronRight,
  faTimes, faCheck
} from '@fortawesome/free-solid-svg-icons'

import {
  faStar, faBookmark, faClock
} from '@fortawesome/free-regular-svg-icons'

// 添加到库中
library.add(
    faPlus, faEdit, faTrash,faSearch,
    faBell, faSignOutAlt,
    faEnvelope, faCalendar, faList,
    faChevronDown, faChevronRight,
    faTimes, faCheck,
    faStar, faBookmark, faClock
)

// 导出所有图标（可选，便于在组件中使用变量）
export {
    faPlus, faEdit, faTrash,faSearch,
    faBell, faSignOutAlt,
    faEnvelope, faCalendar, faList,
    faChevronDown, faChevronRight,
    faTimes, faCheck,
    faStar, faBookmark, faClock
}