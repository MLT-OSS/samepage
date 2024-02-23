import { Button, Col, Divider, Row, App } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

import React, { useEffect, useState } from 'react';

import style from './index.module.less';
import { AssistantsFrom } from '../components/assistants-form';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Conversation from '../components/conversation';
import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';

interface Props {}

export const Configure: React.FC<Props> = () => {
    const navigate = useNavigate();

    const { search } = useLocation();
    const [assistant, setAssistant] = useState<any>('');
    const [assistantName, setAssistantName] = useState<any>('');
    const [data, setData] = useState<any>({});

    const searchParams = new URLSearchParams(search);
    const id = searchParams.get('id');

    // form表单最新数据
    useEffect(() => {
        if (id) {
            setAssistant(id);
            runGetBot({ id }, 'assistant_chat');
        }
    }, [id]);

    // 详情接口
    const { run: runGetBot } = useRequest(services.assistants.getBot, {
        manual: true,
        onSuccess: (res) => {
            setAssistantName(res.name);
            setData(res);
        }
    });

    const modifyAssistant = (res: any) => {
        runGetBot({ id: res.id }, 'assistant_chat');
    };
    const toSetTitle = (title: string) => {
        setAssistantName(title);
    };

    return (
        <div className={style.playground}>
            <Row>
                <Col span={10}>
                    <div style={{ lineHeight: '48px' }}>
                        <Button type="text" className="no-hover-bg" onClick={() => navigate('/')}>
                            <ArrowLeftOutlined />
                            返回
                        </Button>
                    </div>
                    <Divider style={{ margin: '0' }} />
                    <AssistantsFrom
                        data={data}
                        id={assistant}
                        onSave={modifyAssistant}
                        toSetAssistantTitle={toSetTitle}
                    />
                </Col>

                <Col span={14} className="left-col-border">
                    <Conversation config={data} />
                </Col>
            </Row>
        </div>
    );
};
