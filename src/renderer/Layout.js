import React from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const items = [
  {key: 'profiles', label: "Hồ sơ", to: '/'},
  {key: 'manipulations', label: "Khai thác", to: '/manipulations'},
  {key: 'return', label: "Bổ sung", to: '/return'},
  {key: 'officers', label: "Cán bộ", to: '/officers'},
  // {key: 'backup', label: "Sao lưu"}
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
    <Content style={{ padding: 8, overflowY: "scroll", flexGrow: 1 }}>
      <div style={{borderRadius: 8}}>
        <Outlet />
      </div>
    </Content>
    <Footer style={{ fontSize: 12, textAlign: 'center', padding: 2, borderTopWidth: 1, borderTopColor:'#DDD', borderTopStyle: "solid" }}>
      Phiên bản: 1.0.4 - Hệ thống quản lý hồ sơ giao thông ©{new Date().getFullYear()} Cung cấp bởi Livesoft - SĐT: 0942495797
    </Footer>
  </Layout>
}
