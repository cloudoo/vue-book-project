import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ShowText from '@/components/ShowText'
import MovieList from '@/components/MovieList'

Vue.use(Router)

const routes = [{
  path: '/',
  component: resolv => require(['../pages/index']),
  meta: { title: 'home' }
}, {
  path: '/movieList',
  component: MovieList
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
