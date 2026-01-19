import React, { useState, ReactNode, useEffect } from 'react';
import { Layout } from 'antd';
import Navbar from '../DesignLayout/Header';
import FooterEnd from '../DesignLayout/Footer';
import Sidebar from '../DesignLayout/Sidebar';
import { useLocation } from 'react-router-dom';

const { Content } = Layout;

interface MasterProps {
    children: ReactNode;
}

const Master: React.FC<MasterProps> = ({ children }) => {

    const [collapsed, setCollapsed] = useState(false);
    const [hover, setHover] = useState(false);
    // const [headerName, setHeaderName] = useState('');
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    

    const SecondStyle = !isSmallScreen && hover ? '80px' : '';

    const headerStyle = {
        marginLeft: `${SecondStyle}`,
    };

    const handleResize = () => {
        if (window.innerWidth <= 900) {
            setIsSmallScreen(true);
            setCollapsed(false);
        }
        else {
            setIsSmallScreen(false);
        }
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);



    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const handleMouseEnter = () => {
        if (hover) {
            setCollapsed(false);
        }
    };

    const handleMouseLeave = () => {
        if (hover) {
            setCollapsed(true);
        }
    };

    const disableHoverEffect = () => {
        setHover(!hover);
    };

    return (
        <>
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar
                    collapsed={collapsed}
                    onCollapse={toggleSidebar}
                    hoverEffectActive={hover}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    isSmallScreen={isSmallScreen}
                />
                <Layout style={{ ...headerStyle , backgroundColor: '#f8f9fa' }}>
                    <Navbar
                        collapsed={collapsed}
                        toggleSidebar={toggleSidebar}
                        disableHoverEffect={disableHoverEffect}
                        style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}
                    />
                   
                    <Content style={{ margin: '16px 16px', overflow: 'auto' }} >
                        {children}
                    </Content>
                    <FooterEnd style={{ position: 'sticky', bottom: 0, zIndex: 1, width: '100%' }} />
                </Layout>
            </Layout>
        </>
    );
};

export default Master;
