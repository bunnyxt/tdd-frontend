import Vue from 'vue'
import App from './App.vue'

// ant design component import
import "ant-design-vue/dist/antd.css"
import { Layout } from 'ant-design-vue'
import { Menu } from 'ant-design-vue'
import { Breadcrumb } from 'ant-design-vue'
import { Card } from 'ant-design-vue'
import { List } from 'ant-design-vue'
import { Icon } from 'ant-design-vue'
import { Tooltip } from 'ant-design-vue'
import { Button } from 'ant-design-vue'
import { Row } from 'ant-design-vue'
import { Col } from 'ant-design-vue'
import { Table } from 'ant-design-vue'
import { Alert } from 'ant-design-vue'
import { Spin } from 'ant-design-vue'
import { Pagination } from 'ant-design-vue'
import { Checkbox } from 'ant-design-vue'
import { Collapse } from 'ant-design-vue'
import { Radio } from 'ant-design-vue'
import { Carousel } from 'ant-design-vue'
import { Avatar } from 'ant-design-vue'
import { Input } from 'ant-design-vue'
import { Switch } from 'ant-design-vue'
import { DatePicker } from "ant-design-vue"
import { Select } from "ant-design-vue"
import { LocaleProvider } from "ant-design-vue"
import { BackTop } from "ant-design-vue"
import { Drawer } from "ant-design-vue"
import { Divider } from "ant-design-vue"
import { Tag } from "ant-design-vue"
import { Popconfirm } from "ant-design-vue"
import { Modal } from "ant-design-vue"
import { Popover } from "ant-design-vue"
import { Statistic } from "ant-design-vue"

// apex chart
import VueApexCharts from 'vue-apexcharts'

import router from "./router"

// vuex
import store from './store'

Vue.config.productionTip = false

// ant design component use
Vue.use(Layout)
Vue.use(Menu)
Vue.use(Breadcrumb)
Vue.use(Card)
Vue.use(List)
Vue.use(Icon)
Vue.use(Tooltip)
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(Alert)
Vue.use(Spin)
Vue.use(Pagination)
Vue.use(Checkbox)
Vue.use(Collapse)
Vue.use(Radio)
Vue.use(Carousel)
Vue.use(Avatar)
Vue.use(Input)
Vue.use(Switch)
Vue.use(DatePicker)
Vue.use(Select)
Vue.use(LocaleProvider)
Vue.use(BackTop)
Vue.use(Drawer)
Vue.use(Divider)
Vue.use(Tag)
Vue.use(Popconfirm)
Vue.use(Modal)
Vue.use(Popover)
Vue.use(Statistic)

// apex chart
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

// axios
import axios from './api/axios'
Vue.prototype.$axios = axios;

// G2
// import G2 from '@antv/g2';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
