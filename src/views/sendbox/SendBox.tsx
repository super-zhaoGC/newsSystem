import SideMenu from '@/components/sendBox/SideMenu'
import TopHeader from '@/components/sendBox/TopHeader'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Layout, theme } from 'antd';

const { Content } = Layout;


export default function SendBox() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout style={{ height: '100vh' }}>
      <SideMenu />
      <Layout>
        <TopHeader></TopHeader>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet></Outlet>
        </Content>

      </Layout>
    </Layout>
  )
}
