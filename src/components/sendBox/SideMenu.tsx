import React, { Children, useEffect, useState } from 'react'
import '../css/sideStyle.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  HomeOutlined,
  UserSwitchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
const { Sider } = Layout;
import type { MenuProps } from 'antd';
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}
const items: MenuItem[] = [
  getItem('首页', '/home', <HomeOutlined />),


  getItem('用户管理', '/user-manage', <UserSwitchOutlined />, [
    getItem('用户列表', '/user-manage/list'),
  ]),

  getItem('权限管理', '/right-manage', <SettingOutlined />, [
    getItem('角色列表', '/right-manage/role/list'),
    getItem('权限列表', '/right-manage/right/list'),
  ]),
];
const obj = (key, label, children) => {
  return {
    key,
    label,
    children,
  }
}
interface MenuData {
  key?: string,
  title?: string,
  children?: MenuData[]
}
const filterMenu = (list) => {
  const arr: MenuData[] = []
  list.map((item) => {
    if (item.children && item.children.length !== 0) {
      return arr.push(
        obj(item.key, item.title, filterMenu(item.children))
      )
    } else {
      return (
        item.pagepermisson &&
        arr.push(obj(item.key, item.title, null))
      )
    }
  })
  return arr
}
let selectKey: string[] = []
let openKeys: string[] = []
function SideMenu() {
  const [collapsed, setCollapsed] = useState(false);
  const [menuLisst, setMenuList] = useState([])

  const navigate = useNavigate()

  const onClick: MenuProps['onClick'] = (e) => {
    // console.log('click ', e);
    selectKey = [e.key]
    openKeys = [e.key]
    navigate(e.key)
  };
  useEffect(() => {
    axios.get('http://localhost:3000/rights?_embed=children').then(res => {
      setMenuList(filterMenu(res.data))
    })

  }, [])
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="demo-logo-vertical" >新闻发布管理系统</div>
      <Menu
        selectedKeys={selectKey}
        defaultOpenKeys={openKeys}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={menuLisst}
        onClick={onClick}
      />
    </Sider>
  )
}
export default SideMenu