import React, { useState } from 'react';
import { Drawer, Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import '../MasterLayout/Master.css';
import { FaListAlt, FaRegUser } from "react-icons/fa";
import { FileTextOutlined, HomeOutlined, UsbOutlined } from "@ant-design/icons";
import { AppstoreOutlined } from "@ant-design/icons";
const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  isSmallScreen: boolean;
  hoverEffectActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onCollapse: (e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element> | boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse, onMouseEnter, onMouseLeave, hoverEffectActive, isSmallScreen }) => {

  const Logo_Main = require('../Assets/new-logo-2.png');
  const [activeSubMenuKey, setActiveSubMenuKey] = useState<string | null>(null);
  const [activeMenuItemKey, setActiveMenuItemKey] = useState<string | null>(null);

  const handleClick = (subMenuKey: string, itemKey: string) => {
    setActiveSubMenuKey(subMenuKey);
    setActiveMenuItemKey(itemKey);

    // Close the sidebar when a menu item is clicked on small screens
    if (isSmallScreen) {
      onCollapse(false); // Close the sidebar
    }
  };

  const menuItems = [
    { key: '2', icon: <HomeOutlined />, text: 'Home', link: '/admin/home' },
    { key: '3', icon: <FaRegUser />, text: 'Users', link: '/admin/user-list' },
    { key: '4', icon: <AppstoreOutlined />, text: 'Category', link: '/admin/category-list' },
    { key: '5', icon: <UsbOutlined />, text: 'Business', link: '/admin/business-list' },
    { key: '6', icon: <FileTextOutlined />, text: 'Banner', link: '/admin/banner' },
    { key: '7', icon: <FaListAlt />, text: 'Sub Category', link: '/admin/subcategory-list' },

  ];

  const collapsedWidth = isSmallScreen ? 0 : 80;

  const FirstStyle = isSmallScreen ? 'mobile-screen-sidebar' : 'desktop-screen-sidebar';
  const SecondStyle = hoverEffectActive && !isSmallScreen ? 'mobile-screen-sidebar' : 'desktop-screen-sidebar';

  return (
    <>
      {isSmallScreen ? (
        <Drawer
          placement="left"
          closable={false}
          onClose={onCollapse}
          width="200px"
          open={collapsed}
          maskClosable
        >
          <div style={{
            top: 0,
            position: 'sticky',
            display: 'block',
            textAlign: 'center',
            zIndex: 99,
          }}>
            <img
              src={Logo_Main}
              alt="logo"
              style={{
                maxHeight: '70px',
                margin: 'auto',
              }}
            />
          </div>
          <Menu mode="inline" theme='dark'
            selectedKeys={[activeSubMenuKey, activeMenuItemKey].filter(Boolean) as string[]}
            style={{
              color: 'white',
              minHeight: '100vh',
            }}
          >
            {menuItems.map((item) => (
              <Menu.Item key={item.key} icon={item.icon}
                onClick={() => handleClick('', item.key)}
                className='sidebar-menu-active'
              >
                <Link to={item.link} style={{ textDecoration: 'none' }}>
                  {item.text}
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        </Drawer>
      ) : (
        <Sider
          style={{ backgroundColor: "#2c3e50" }}
          className={`${FirstStyle} ${SecondStyle}`}
          trigger={null}
          collapsible
          collapsed={collapsed}
          collapsedWidth={collapsedWidth}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div
            style={{
              top: 0,
              position: "sticky",
              display: "block",
              textAlign: "center",
              zIndex: 999,
              backgroundColor: "#2c3e50",
            }}
          >
            <img
              src={Logo_Main}
              alt="ImageLogo"
              style={{
                maxHeight: "70px",
                margin: "auto",
              }}
            />
          </div>

          <Menu
            mode="inline"
            selectedKeys={[activeSubMenuKey, activeMenuItemKey].filter(Boolean) as string[]}
            style={{
              minHeight: "calc(100vh - 70px)",
              backgroundColor: "#2c3e50",
              color: "white",
            }}
          >
            {menuItems.map((item) => (
              <Menu.Item
                key={item.key}
                icon={item.icon}
                onClick={() => handleClick("", item.key)}
                className="sidebar-menu-active"
                style={{
                  background: "transparent",
                  color: "white",
                }}
              >
                <Link to={item.link} style={{ textDecoration: "none", color: "white" }}>
                  {item.text}
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>

      )}
    </>
  );
};

export default Sidebar;
