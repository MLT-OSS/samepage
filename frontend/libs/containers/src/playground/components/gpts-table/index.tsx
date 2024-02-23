import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Modal, Table } from 'antd';
import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import style from './index.module.less';
import TableHeader from './table-header';

const { confirm } = Modal;

interface Props {
    toCreate: () => void;
}

const GptsTable = (props: Props) => {
    const navigate = useNavigate();
    const [list, setList] = useState<any>([]);
    const params = { type: 'assistant_chat' };
    const [pagination, setPagination] = useState<any>({ pageNo: 1, pageSize: 10, total: 0 });
    useEffect(() => {
        runList({ ...params, ...pagination });
    }, []);

    // 获取列表
    const { loading, run: runList } = useRequest(services.assistants.getList, {
        manual: true,
        onSuccess: (res) => {
            setPagination({ ...pagination, ...{ total: res.total } });
            setList(res.records);
        }
    });

    const toConfigure = (id: string) => {
        navigate('/configure?id=' + id);
    };

    const { loading: delLoading, run: runDelBot } = useRequest(services.assistants.delBot, {
        manual: true,
        onSuccess: (res) => {
            onRefresh();
        }
    });

    // 刷新
    const onRefresh = () => {
        runList(params);
    };

    const onPaginationChange = (page: any) => {
        setPagination(page);
        runList({ ...params, ...page });
    };

    const showDeleteConfirm = (id: string) => {
        confirm({
            title: '确认要删除?',
            icon: <ExclamationCircleFilled />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                runDelBot(id);
            }
        });
    };

    const columns: any = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, r: any) => (
                <div className={style['table-name']}>
                    <Avatar size={40} src={r.icon} />
                    <span style={{ paddingLeft: 12 }}>{text}</span>
                </div>
            )
        },
        {
            title: '描述',
            dataIndex: 'desc',
            key: 'desc'
        },
        {
            title: '操作',
            key: 'action',
            with: 100,
            align: 'center',
            tableLayout: 'fixed',
            render: (_: any, item: any) => (
                <div>
                    <Button className="test-btn" type="link" onClick={() => toConfigure(item.id)}>
                        测试
                    </Button>
                    <Button type="link" danger onClick={() => showDeleteConfirm(item.id)}>
                        删除
                    </Button>
                </div>
            )
        }
    ];

    return (
        <Card className={style['gpts-table']}>
            <TableHeader total={pagination.total} toCreate={props.toCreate} />
            <Table
                key="id"
                loading={loading}
                className="table-list"
                pagination={{
                    ...pagination,
                    ...{
                        showTotal: (total: any) => `共 ${total} 条`,
                        onChange: onPaginationChange,
                        showSizeChanger: true,
                        showQuickJumper: true
                    }
                }}
                columns={columns}
                dataSource={list}
            />
        </Card>
    );
};

export default GptsTable;
