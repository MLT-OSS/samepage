// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useCallback, useEffect, useState } from 'react';
import Browser from 'webextension-polyfill';
import { RouterProvider } from 'react-router-dom';
import {
    MSG_OPEN_MAIN,
    MSG_RESPONSE_ERROR,
    EVENT_RESPONSE_ERROR_MESSAGE,
    MSG_LOGIN_SUCCESS,
    EVENT_CLOSE_EXTENSION,
    STORAGE_ROBOT_DICTIONARY,
    STORAGE_ROBOT_SIDEBAR_LIST
} from '@/constants';
import { eventEmitter, EventType, getSessionValue, isExtDisabledUrl } from '@/utils';
import { globalRouters } from '../router';

import styles from './app.module.less';
import EntryMoveWapper from '../components/entry-move-wrapper';
import EntryBtn from '../components/entry-btn';
import SelectionMenuWrapper from '../components/selection-menu-wrapper';
import { useConversationContext } from '@xm/context';
import { GetDictBotResponse } from '@/ytt-type/robot';

const isExtDiasbled = isExtDisabledUrl(window.location.href);

export function App() {
    const [mainVisiable, setMainVisiable] = useState<boolean>(false);
    const [disabledMove, setDisabledMove] = useState(false);
    const {
        conversationState: { userinfo },
        dispatch
    } = useConversationContext();

    const onHandleDisabledMove = (disabled: boolean) => {
        setDisabledMove(disabled);
    };

    const openMain = useCallback(() => {
        setMainVisiable(true);
    }, [setMainVisiable]);

    useEffect(() => {
        Browser.runtime.onMessage.addListener((message) => {
            const { type, data } = message;
            if (type === MSG_OPEN_MAIN) {
                if (mainVisiable) {
                    return;
                }

                setMainVisiable(true);
            }
            if (type === MSG_RESPONSE_ERROR) {
                eventEmitter.dispatch(EventType.RESPONSE_ERROR, EVENT_RESPONSE_ERROR_MESSAGE, {
                    ...data
                });
            }
            if (type === MSG_LOGIN_SUCCESS) {
                // 目前登录成功和完善信息会走到该分支，下面这个逻辑主要是给完善信息后刷新用的
                dispatch({
                    type: 'i_main_layout_key',
                    payload: {
                        mainLayoutKey: String(+new Date())
                    }
                });
                globalRouters.navigate(data?.redirect);
            }
        });
    }, [mainVisiable]);

    useEffect(() => {
        eventEmitter.subscribe(EventType.CLOSE_EXTENSION, EVENT_CLOSE_EXTENSION, (data) => {
            setMainVisiable(false);
        });
    }, []);

    useEffect(() => {
        (async () => {
            // 获取用户信息 设置 selection 状态
            if (userinfo?.userId) {
                const botDict: GetDictBotResponse = (await getSessionValue(STORAGE_ROBOT_DICTIONARY)) as any;
                const sidebar: string[] = (await getSessionValue(STORAGE_ROBOT_SIDEBAR_LIST)) as any;
                const firstBotInfo = (botDict?.bot || []).find((i) => i.key === sidebar?.[0]);
                if (firstBotInfo?.feature.includes('intent')) {
                    dispatch({ type: 's_flag', payload: { selectFlag: true } });
                }
            }
        })();
    }, [userinfo?.userId]);

    if (isExtDiasbled) {
        return null;
    }

    return (
        <div className={styles.container}>
            {/* 右下 悬浮气泡 */}
            {!mainVisiable && (
                <EntryMoveWapper disabled={disabledMove}>
                    <EntryBtn
                        onClick={openMain}
                        disabledMove={onHandleDisabledMove}
                        dataMove="none"
                        dataTop="position-bottom"
                    />
                </EntryMoveWapper>
            )}
            {/* 插件主体 */}
            <div className={styles.main} style={{ display: mainVisiable ? 'flex' : 'none' }}>
                <RouterProvider router={globalRouters} />
            </div>
            {/* 选中段落-快捷操作 */}
            <SelectionMenuWrapper openMain={openMain} />
        </div>
    );
}

export default App;
