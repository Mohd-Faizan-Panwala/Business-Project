import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const FooterEnd: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {

    return (
        <>
            <Footer style={{ textAlign: 'center', ...style }} className='bg-[#ffffff] text-gray-500 border-t mt-8'>
                ©{new Date().getFullYear()} Baynana. All Rights Reserved.
            </Footer>
        </>
    );
};

export default FooterEnd;
