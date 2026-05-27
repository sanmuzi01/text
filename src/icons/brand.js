/***
 * 在此文件中导入awesomefont中你所需要的品牌图标
 * @param {string} iconName - 图标名称
 * 品牌
 */
import { library } from '@fortawesome/fontawesome-svg-core'

// 按需导入具体的品牌图标
import {
  faGithub, faWeixin, faWeibo, faWhatsapp, faTiktok, faSteam,
  faAlipay, faApplePay, faCcPaypal,
  faApple, faAndroid, faWindows, faLinux,
  faFacebook, faTwitter, faGoogle, faGooglePay,
  faQq, faZhihu, faYoutube, faBilibili
} from '@fortawesome/free-brands-svg-icons'

// 添加到库中
library.add(
  faGithub, faWeixin, faWeibo, faWhatsapp, faTiktok, faSteam,
  faAlipay, faApplePay, faCcPaypal,
  faApple, faAndroid, faWindows, faLinux,
  faFacebook, faTwitter, faGoogle, faGooglePay,
  faQq, faZhihu, faYoutube, faBilibili
)

// 导出所有图标（可选，便于在组件中使用变量）
export {
  faGithub, faWeixin, faWeibo, faWhatsapp, faTiktok, faSteam,
  faAlipay, faApplePay, faCcPaypal,
  faApple, faAndroid, faWindows, faLinux,
  faFacebook, faTwitter, faGoogle, faGooglePay,
  faQq, faZhihu, faYoutube, faBilibili
}