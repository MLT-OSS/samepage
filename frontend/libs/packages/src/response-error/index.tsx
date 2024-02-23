import { useEffect, useRef } from 'react';
import { App } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { eventEmitter, EventType, getSessionValue, isExtension, ENV, getLoginUrl } from '@/utils';
import { EVENT_RESPONSE_ERROR_MESSAGE, MSG_RESPONSE_ERROR, STORAGE_OPEN_TIMES } from '@/constants';
import { useLogout, useUserSettingInterval } from '@xm/hooks';
import { useConversationContext } from '@xm/context';

import type { IResponseErrorEventData } from '@/types';

const { NX_PLATFORM } = ENV;

/* eslint-disable-next-line */
export interface ResponseErrorProps {}

export function ResponseError(props: ResponseErrorProps) {
    const { message } = App.useApp();
    const { dispatch, conversationState } = useConversationContext();
    const { userSettingPollTimerId } = conversationState || {};
    const { clean } = useLogout();
    const navigate = useNavigate();
    const location = useLocation();
    const { clearUserSettingInterval } = useUserSettingInterval();

    // FIXME: 暂时解决 420 的时候定时器不更新的问题
    const timerIdRef = useRef<NodeJS.Timer | null | undefined>(userSettingPollTimerId);
    useEffect(() => {
        timerIdRef.current = userSettingPollTimerId;
    }, [userSettingPollTimerId]);

    useEffect(() => {
        eventEmitter.subscribe(
            EventType.RESPONSE_ERROR,
            EVENT_RESPONSE_ERROR_MESSAGE,
            async (data: IResponseErrorEventData) => {
                console.log(data, 'eventEmitter.subscribe');
                const _times_ = await getSessionValue(STORAGE_OPEN_TIMES);
                const { code, showType, message: errorMsg } = data;
                if (showType === 'message') {
                    if (code === 401) {
                        // eslint-disable-next-line max-depth
                        _times_ &&
                            message.open({
                                key: `${MSG_RESPONSE_ERROR}_${code}`,
                                type: 'error',
                                content: errorMsg,
                                duration: 1
                            });

                        const _redirect = encodeURI(`${location.pathname}${location.search}`);

                        const _searchs = [
                            NX_PLATFORM ? `target=${NX_PLATFORM}` : '',
                            _redirect ? `redirect=${_redirect}` : ''
                        ].filter(Boolean);
                        const _searchStr = `${_searchs.length > 0 ? `?${_searchs.join('&')}` : ''}`;

                        if (isExtension) {
                            await clean();
                            navigate(`/user/login${_searchStr}`);
                        } else {
                            await clean(['storage']);
                            const _loginUrl = await getLoginUrl();
                            window.location.href = `${_loginUrl}${_searchStr}`;
                        }

                        return;
                    }

                    // 版本不兼容提示
                    if (code === 421) {
                        dispatch({
                            type: 'p_layout_version_info_popup_show',
                            payload: {
                                layoutVersionInfoPopupShow: 'force'
                            }
                        });
                        return;
                    }

                    message.open({
                        key: `${MSG_RESPONSE_ERROR}_${code}`,
                        type: 'error',
                        content: errorMsg
                    });
                }
            }
        );
    }, []);

    return <></>;
}

export default ResponseError;
