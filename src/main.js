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

// apex chart
import VueApexCharts from 'vue-apexcharts'

import router from "./router"

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

// apex chart
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
