import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ShowText from '@/components/ShowText'

Vue.use(Router)

const routes = [{
  path: '/',
  component: resolv => require(['../pages/index']),
  meta: { title: 'home' }
}, {
  path: '/movieList',
  component: MoveList
}, {
  path: '/showText',
  component: ShowText
}]

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})
