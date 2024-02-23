/**
 * 会话相关 layout
 */
import { STORAGE_OPEN_TIMES } from '@/constants';
import { useConversationContext } from '@xm/context';
import { RobotList, RobotUnauthModal } from '@xm/packages';
import services from '@xm/services';
import { setSessionValue, getSessionValue } from '@/utils';
import { GetPromptsResponse } from '@/ytt-type/prompt';
import useRequest from '@ahooksjs/use-request';
import { isEmpty } from 'lodash-es';
import { useEffect } from 'react';
import styles from './index.module.less';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { GetDictBotResponse } from '@/ytt-type/robot';
import { Loading } from '@xm/components';
import { useBotInfo } from '@xm/hooks';

import type { ILangConfig } from '@/types';

interface IConvLayoutProps {
    showRebotList?: boolean;
    langConfig?: ILangConfig;
}

export const ConvLayout = (props: IConvLayoutProps) => {
    const { showRebotList = true, langConfig } = props;
    const navigator = useNavigate();
    const { model, type } = useParams<{ type: string; model: string }>();
    const { conversationState, dispatch } = useConversationContext();
    const { quickActionPrompt, robotUnauthShow } = conversationState;
    const { setBotDict, setSidebar } = useBotInfo();

    const { run: getPrompts } = useRequest(services.prompts.getPrompts, {
        manual: true,
        onSuccess: (res: GetPromptsResponse) => {
            const prompts: { [k: string]: string } = {};
            res?.records?.forEach((i) => {
                prompts[i.name as string] = i.content!;
            });
            dispatch({
                type: 'i_quick_action_prompt',
                payload: {
                    quickActionPrompt: prompts
                }
            });
        }
    });

    // 机器人相关字典，包含模型列表以及分类
    const { run: getRobotDict, data: robotDict } = useRequest(services.robot.getRobotDict, {
        manual: true
    });

    const { run: getSidebarList, data: sidebar } = useRequest(services.robot.getSidebarList, {
        manual: true,
        onSuccess: (res: string[]) => {
            setSidebar(res);
        }
    });

    const redirectToFirstModel = (dict: GetDictBotResponse, sidebar: string[]) => {
        // 如果 sidebar 为空，初始化的时候跳转到商店第一个模型
        let firstBotInfo = dict?.bot?.find((i) => i.key === sidebar?.[0]);
        if (!firstBotInfo) {
            firstBotInfo = dict?.bot?.[0];
        }
        const firstModel = firstBotInfo.key;
        const firstModelType = firstBotInfo?.type;
        if (firstModel && firstBotInfo && firstModelType) {
            navigator(`/conversation/${firstModelType}/${firstModel}`);
            dispatch({
                type: 'i_model_info',
                payload: {
                    modelInfo: firstBotInfo
                }
            });
        }
    };

    useEffect(() => {
        (async () => {
            // 获取 selection 快捷操作 prompt
            if (isEmpty(quickActionPrompt)) {
                getPrompts({
                    type: 'quick_action',
                    pageNo: 1,
                    pageSize: 10
                });
            }

            // 记录home页面打开次数
            const times = await getSessionValue(STORAGE_OPEN_TIMES);
            let newTimes = 1;
            if (times) {
                newTimes = Number(times) + 1;
            }
            await setSessionValue({ key: STORAGE_OPEN_TIMES, value: newTimes });

            // 获取机器人字典及侧边栏sidebarList
            const robotDict: GetDictBotResponse = await getRobotDict();
            if (robotDict?.bot?.length <= 0) {
                navigator(`/bot-setting`);
                return;
            }
            const sidebarList = await getSidebarList();
            setBotDict(robotDict);

            if (!type || !model) {
                redirectToFirstModel(robotDict, sidebarList);
            } else {
                const botInfo = robotDict?.bot?.find((i) => i.key === model);
                if (botInfo) {
                    navigator(`/conversation/${type}/${model}`);
                    dispatch({
                        type: 'i_model_info',
                        payload: {
                            modelInfo: botInfo
                        }
                    });
                } else {
                    navigator('/404');
                }
            }
        })();
    }, []);
    // 根据 字典 + sidebar 的相应情况进行跳转, 并设置模型信息
    useEffect(() => {
        if ((!type || !model) && robotDict && sidebar) {
            redirectToFirstModel(robotDict, sidebar);
        }
    }, [type, model]);
    return (
        <div className={styles.conversationLayout}>
            {!type || !model || !robotDict || !sidebar ? (
                <div className={styles.loading}>
                    <Loading />
                </div>
            ) : (
                <>
                    <div className={styles.body} style={!showRebotList ? { width: '100%' } : {}}>
                        <Outlet context={{ langConfig }} />
                    </div>

                    {showRebotList && <RobotList />}
                </>
            )}

            {!!robotUnauthShow && (
                <RobotUnauthModal
                    onConfirm={() => {
                        dispatch({
                            type: 'i_main_layout_key',
                            payload: {
                                mainLayoutKey: String(+new Date())
                            }
                        });
                        navigator('/');
                    }}
                />
            )}
        </div>
    );
};
