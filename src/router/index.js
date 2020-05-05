import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import RandomUser from '../components/question/Random.vue'
import Login from '../components/user/Login.vue'
import Search from '../components/question/Search.vue'
import Signup from '../components/user/Signup.vue'
import Active from '../components/user/Active.vue'
import Forget from '../components/user/Forget.vue'
import Reset from '../components/user/Reset.vue'
import UserInfo from '../components/user/UserInfo.vue'
import QuestionBox from '../components/user/QuestionBox.vue'
import AllUser from '../components/userAdmin/AllUser.vue'
import Admin from '../components/userAdmin/Admin.vue'
import Report from '../components/report/Report.vue'
import Publish from '../components/message/Publish.vue'
import Message from '../components/message/Message.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children:[
      {path:'/random',component: RandomUser},
      {path:'/search',component: Search},
      {path:'/signup',component: Signup},
      {path:'/active',component: Active},
      {path:'/forget',component: Forget},
      {path:'/reset',component: Reset},
      {path:'/userInfo',component: UserInfo},
      {path:'/questionBox',component: QuestionBox},
      {path:'/allUser',component: AllUser},
      {path:'/deleteAdmin',component: Admin},
      {path:'/reportList',component: Report},
      {path:'/publish',component: Publish},
      {path:'/message',component: Message},
    ]
  },
  {
    path: '/login',
    component: Login
  }

]

const router = new VueRouter({
  routes
})

export default router
