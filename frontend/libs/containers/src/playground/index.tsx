import React from 'react';
import GptsTable from './components/gpts-table';
import { Layout, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
export const Playground: React.FC = () => {
    const navigate = useNavigate();

    const [selectedKeys, setSelectedKeys] = React.useState(['1']);
    const items = [
        {
            key: 1,
            label: '我的助手'
        }
    ];
    const toCreate = () => {
        navigate('/configure');
    };
    const onSelect = (e: any) => {
        setSelectedKeys([e.key]);
    };
    return (
        <Layout style={{ padding: 12, overflowY: 'hidden' }}>
            <Sider width={200}>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    style={{ height: '100%' }}
                    items={items}
                    onSelect={onSelect}
                />
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
                {selectedKeys.indexOf('1') > -1 && <GptsTable toCreate={toCreate} />}
            </Content>
        </Layout>
    );
};
