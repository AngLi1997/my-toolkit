import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/base.css'

// 导入oh-vue-icons
import { OhVueIcon, addIcons } from "oh-vue-icons"
import { 
  BiGear,
  FaFlag
} from "oh-vue-icons/icons"
import { 
  RiAddLine, 
  RiDragMoveLine, 
  RiDeleteBinLine, 
  RiMoreFill,
  RiFileAddLine,
  RiPencilLine,
  RiFolderAddLine,
  RiFolderFill,
  RiFolderOpenFill,
  RiFileTextFill,
  RiFileCopyLine,
  RiSettings3Line,
  RiCloseLine,
  RiFolderOpenLine
} from 'oh-vue-icons/icons'

// 注册图标
addIcons(
  BiGear,
  FaFlag,
  RiAddLine,
  RiDragMoveLine,
  RiDeleteBinLine,
  RiMoreFill,
  RiFileAddLine,
  RiPencilLine,
  RiFolderAddLine,
  RiFolderFill,
  RiFolderOpenFill,
  RiFileTextFill,
  RiFileCopyLine,
  RiSettings3Line,
  RiCloseLine,
  RiFolderOpenLine
)

const app = createApp(App)
app.component("v-icon", OhVueIcon)
app.mount('#app')
