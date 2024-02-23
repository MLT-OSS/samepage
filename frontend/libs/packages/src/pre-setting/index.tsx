import { Form, Input, Button } from 'antd';
import styles from './index.module.less';
import { useEffect, useState } from 'react';
import {
    getSessionValue,
    setSessionValue,
    isExtension,
    eventEmitter,
    EventType,
    getApiDomain,
    getWebDefaultUrl
} from '@/utils';
import { useNavigate } from 'react-router-dom';
import { useConversationContext } from '@xm/context';
import { EVENT_CLOSE_EXTENSION } from '@/constants';

import type { FormProps } from 'antd';

/**
 * 
NX_API_DOMAIN=
NX_LOGIN_DOMAIN=
NX_WEB_DOMAIN=
NX_HOME_DOMAIN=
NX_DOC_CHAT_DOMAIN=
NX_CTM_DOMAIN=
NX_SCRIPTS_DOMAIN=
 */

export const PreSetting = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const {
        dispatch,
        conversationState: { preSettingShow }
    } = useConversationContext();
    const [isShowOtherSetting, setIsShowOtherSetting] = useState(false);
    const [hasData, setHasData] = useState(false);

    const onValuesChange: FormProps['onValuesChange'] = (changedValues, allValues) => {
        if (Object.keys(changedValues).includes('API_DOMAIN')) {
            let _url;
            try {
                _url = new URL(changedValues.API_DOMAIN);
                form.setFieldsValue({
                    WEB_DOMAIN: `${_url.origin}`
                });
            } catch (e) {
                form.setFieldsValue({
                    WEB_DOMAIN: ''
                });
                return;
            }
        }
    };

    const onHandleFinish: FormProps['onFinish'] = async (values) => {
        const { API_DOMAIN, WEB_DOMAIN } = values;
        if (API_DOMAIN && WEB_DOMAIN) {
            await setSessionValue({ key: 'API_DOMAIN', value: API_DOMAIN });
            await setSessionValue({ key: 'WEB_DOMAIN', value: WEB_DOMAIN });
            dispatch({ type: 'p_pre_setting_show', payload: { preSettingShow: false } });
            navigate('');
        }
    };

    const onHandleCancel = () => {
        dispatch({ type: 'p_pre_setting_show', payload: { preSettingShow: false } });
    };

    const onHandleClose = () => {
        eventEmitter.dispatch(EventType.CLOSE_EXTENSION, EVENT_CLOSE_EXTENSION, {
            type: EVENT_CLOSE_EXTENSION,
            data: {
                value: false
            }
        });
    };

    const getDefaultConfig = async () => {
        const API_DOMAIN = await getApiDomain();
        const WEB_DOMAIN = await getWebDefaultUrl();

        if (!(API_DOMAIN && WEB_DOMAIN)) {
            dispatch({ type: 'p_pre_setting_show', payload: { preSettingShow: true } });
        } else {
            setHasData(true);
            form.setFieldsValue({
                API_DOMAIN,
                WEB_DOMAIN
            });
        }
    };

    useEffect(() => {
        getDefaultConfig();
    }, [preSettingShow]);

    return (
        <div className={styles.preSetting} style={{ display: preSettingShow ? '' : 'none' }}>
            <div className={styles.setting}>
                <div className={styles.title}>地址设置</div>
                <Form form={form} onValuesChange={onValuesChange} onFinish={onHandleFinish}>
                    <Form.Item label="接口地址" name="API_DOMAIN">
                        <Input placeholder="请配置后端接口地址" />
                    </Form.Item>
                    <div className={styles.showOtherSetting} style={{ display: !isShowOtherSetting ? '' : 'none' }}>
                        <a onClick={() => setIsShowOtherSetting(true)}>点击查看全部配置</a>
                    </div>
                    <Form.Item hidden={!isShowOtherSetting} label="web端地址" name="WEB_DOMAIN">
                        <Input placeholder="请配置web端地址" />
                    </Form.Item>
                    <Form.Item>
                        <div className={styles.footer}>
                            {hasData && <Button onClick={onHandleCancel}>取消设置</Button>}
                            {!hasData && isExtension && <Button onClick={onHandleClose}>关闭应用</Button>}
                            <Button type="primary" htmlType="submit">
                                保存设置
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};
