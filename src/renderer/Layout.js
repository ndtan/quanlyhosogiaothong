import React from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const items = [
  {key: 'profiles', label: "Hồ sơ", to: '/'},
  {key: 'manipulation', label: "Khai thác"},
  {key: 'return', label: "Bổ sung"},
  {key: 'officers', label: "Cán bộ", to: '/officers'},
  {key: 'backup', label: "Sao lưu"}
  ];

export default function ({props}) {
  const navigate = useNavigate();

  return <Layout style={{display: "flex", flexDirection: "column", height: "100vh"}}>
    <Header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      padding: 0,
    }}>
      {/*<div className="demo-logo" style={{width: 100}} />*/}
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['profiles']}
        items={items}
        style={{ flex: 1, minWidth: 0 }}
        onClick={({ _, key, keyPath }) => {
          const item = items.find(i=>i.key === key);
          navigate(item.to , { replace: true });
        }}
      />
    </Header>
    <Content style={{ padding: 8, overflowY: "auto", flexGrow: 1 }}>
      <div
        style={{
          padding: 24,
          borderRadius: 8,
        }}
      >
        <Outlet />
      </div>
    </Content>
    <Footer style={{ fontSize: 12, textAlign: 'left', padding: 2, borderTopWidth: 1, borderTopColor:'#DDD', borderTopStyle: "solid" }}>
      Hệ thống quản lý hồ sơ giao thông ©{new Date().getFullYear()} Cung cấp bởi Livesoft
    </Footer>
  </Layout>
}