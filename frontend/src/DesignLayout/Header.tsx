// import React, { useEffect, useState } from 'react';
// import { MenuOutlined } from '@ant-design/icons';
// import { Button, Col, Layout, Row } from 'antd';
// import { Avatar, Dropdown, Menu } from "antd";

// import { UserOutlined, SettingOutlined, LogoutOutlined, FileTextOutlined } from "@ant-design/icons";

// const { Header } = Layout;

// interface NavbarProps {
//   collapsed: boolean;
//   toggleSidebar: () => void;
//   disableHoverEffect: () => void;
//   style?: React.CSSProperties;
// }
// interface StaticRoute {
//   kind: 'static';
//   header: string;
// }

// interface DynamicRoute {
//   kind: 'dynamic';
//   header: (params: Record<string, string>) => string;
// }

// type RouteHeaderMap = {
//   [key: string]: StaticRoute | DynamicRoute;
// };

// const Navbar: React.FC<NavbarProps> = ({ collapsed, toggleSidebar, disableHoverEffect, style }) => {
//   const userName = localStorage.getItem('user') || '';
//   const formattedUserName = userName.replace(/["']/g, '');

//   const menu = (
//     <Menu
//       items={[
//         {
//           key: "1",
//           label: "My Profile",
//           icon: <UserOutlined />,
//           onClick: () =>{
//             window.location.href = "/admin/profile"
//           },
//         },
//         {
//           type: "divider",
//         },
//         {
//           key: "2",
//           label: <span style={{ color: "red" }}>Logout</span>,
//           icon: <LogoutOutlined style={{ color: "red" }} />,
//           onClick: () => {
//             localStorage.clear();
//             window.location.href = "/";
//           },
//         },
//       ]}
//     />
//   );


//   return (
//     <Header className="header bg-[#ffffff] border-b border-gray-300" style={style}>
//       <Row className="flex items-center" style={{ width: "100%" }}>
//         <Col xs={6} sm={6} md={6} xl={6} xxl={6}>
//           <Button
//             type="text"
//             icon={<MenuOutlined className="header-icon text-[#E2E8F0]" />}
//             onClick={() => {
//               toggleSidebar();
//               disableHoverEffect();
//             }}
//             className="m-2 rounded"
//           />
//         </Col>

//         <Col xs={12} sm={12} md={12} xl={12} xxl={12} className="flex justify-center">
//         </Col>

//         <Col xs={6} sm={6} md={6} xl={6} xxl={6} className="flex justify-end pr-6">
//           <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
//             <div className="flex items-center cursor-pointer">
//               <Avatar
//                 size="large"
//                 src="https://i.pravatar.cc/"
//                 style={{ border: "2px solid #fff", marginRight: 8 }}
//               />
//               <span className="text-gray-500 font-medium hidden sm:block">
//                 {"Admin"}
//               </span>
//             </div>
//           </Dropdown>
//         </Col>
//       </Row>

//     </Header>

//   );
// };

// export default Navbar;


import React, { useEffect, useState } from "react";
import { MenuOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button, Col, Layout, Row, Avatar, Dropdown, Menu } from "antd";
const BASE_URL = "http://localhost:3100"

const { Header } = Layout;

interface NavbarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
  disableHoverEffect: () => void;
  style?: React.CSSProperties;
}

interface Admin {
  name: string;
  profileImage?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  collapsed,
  toggleSidebar,
  disableHoverEffect,
  style,
}) => {
  const [admin, setAdmin] = useState<Admin | null>(null);

  // ✅ Load admin from localStorage
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch {
        setAdmin(null);
      }
    }
    console.log("BASE_URL:", BASE_URL);
console.log("PROFILE IMAGE:", admin?.profileImage);

  }, []);

  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: "My Profile",
          icon: <UserOutlined />,
          onClick: () => {
            window.location.href = "/admin/profile";
          },
        },
        {
          type: "divider",
        },
        
        {
          key: "2",
          label: <span style={{ color: "red" }}>Logout</span>,
          icon: <LogoutOutlined style={{ color: "red" }} />,
          onClick: () => {
            localStorage.clear();
            window.location.href = "/";
          },
        },
      ]}
    />
    
  );

  return (
    <Header className="bg-white border-b border-gray-300" style={style}>
      <Row align="middle" style={{ width: "100%" }}>
        {/* LEFT */}
        <Col xs={6} sm={6} md={6} xl={6} xxl={6}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => {
              toggleSidebar();
              disableHoverEffect();
            }}
          />
        </Col>

        {/* CENTER */}
        <Col xs={12} sm={12} md={12} xl={12} xxl={12} />

        {/* RIGHT */}
        <Col
          xs={6}
          sm={6}
          md={6}
          xl={6}
          xxl={6}
          className="flex justify-end pr-6"
        >
          <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
            <div className="flex items-center cursor-pointer">
              <Avatar
                size="large"
                src={
                  admin?.profileImage
                    ? `${BASE_URL}${admin.profileImage}`
                    : undefined
                }
                icon={!admin?.profileImage ? <UserOutlined /> : undefined}
                style={{ marginRight: 8 }}
              />

              <span className="text-gray-600 font-medium hidden sm:block">
                {admin?.name || "Admin"}
              </span>
            </div>
          </Dropdown>
        </Col>
      </Row>
    </Header>
  );
};

export default Navbar;
