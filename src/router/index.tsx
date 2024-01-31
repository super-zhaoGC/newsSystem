import React from 'react'
import Redirect from './redirect.tsx'
//导入创建路由的函数
import { useRoutes } from 'react-router-dom'


// import Login from '../views/login/Login.tsx'
// import SendBox from '../views/sendbox/SendBox.tsx'
export default function MRoutes() {
  //创建router路由实力对象，并配置路由的对应关系(路由数组)
  const element = useRoutes([{
    path: '/login',
    element: LazyLoad('login/login')
  },
  {
    path: '/',
    element: LazyLoad('sendBox/SendBox'),
    children: [
      { path: '', element: <Redirect to="/home"></Redirect> },
      { path: '/home', element: LazyLoad("sendBox/home/Home") },
      { path: '/user-manage/list', element: LazyLoad("sendBox/user-manage/UserList") },
      { path: '/right-manage/role/list', element: LazyLoad("sendBox/right-manage/RoleList") },
      { path: '/right-manage/right/list', element: LazyLoad("sendBox/right-manage/RightList") },
      { path: '*', element: LazyLoad("sendBox/notfound/NotFound") }
    ]
  }
  ])
  return element
}

//路由懒加载封装
const LazyLoad = (path: string) => {
  const Comp = React.lazy(() => import(/* @vite-ignore */`../views/${path}`))
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Comp></Comp>
    </React.Suspense>
  )
}
//路由拦截组件的封装
function AuthComponent({ children }) {
  const isLogin = localStorage.getItem('token')
  return isLogin ? children : <Redirect to="/login"></Redirect>
}
