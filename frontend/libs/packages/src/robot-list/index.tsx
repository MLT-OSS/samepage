/**
 * 机器人导航列表
 *
 * TODO:
 * 1. 【确认下】9f6813 加容错的地方逻辑应该都有优化点！因为权限变更的时候会报错 （robotlist里的提交已优化完）
 */
import { useEffect, useRef, useState, useMemo } from 'react';
import { ReactComponent as EllipsisOutlineIcon } from '@/assets/images/ellipsis-outline.svg';
import classNames from 'classnames';
import { Popover, Tooltip } from 'antd';
import { isEmpty, throttle } from 'lodash-es';
import styles from './index.module.less';
import { RobotShopDrawer } from '../robot-shop-drawer';
import { ReactComponent as AddIcon } from '@/assets/images/add-circle-fill.svg';
import { useNavigate } from 'react-router-dom';
import { useConversationContext } from '@xm/context';
import { GetDictBotResponse } from '@/ytt-type/robot';
import Icon from '@ant-design/icons';

type IBotItem = GetDictBotResponse['bot'][0];

export const RobotList = () => {
    const navigator = useNavigate();
    const { conversationState, dispatch } = useConversationContext();
    const { robotDict, sidebarList, modelInfo } = conversationState;
    const model = modelInfo?.key;

    const [robotList, setRobotList] = useState<IBotItem[]>([]);
    const [robotShowNum, setRobotShowNum] = useState<number>(0);
    const listRef = useRef<HTMLDivElement>(null);

    const [isShowRobotShop, setIsShowRobotShop] = useState<boolean>(false);
    const [isShowMoreBot, setIsShowMoreBot] = useState<boolean>(false);
    const [isShowMoreTip, setIsShowMoreTip] = useState<boolean>(false);

    const [showList, hidenList] = useMemo(() => {
        const showList = robotList?.slice(0, robotShowNum);
        const hidenList = robotList?.slice(robotShowNum);
        return [showList, hidenList];
    }, [robotShowNum, robotList]);

    const getRobotListFromKey = () => {
        const listData: IBotItem[] = [];
        sidebarList?.forEach((key: string) => {
            const botItem = robotDict?.botMap?.get(key);
            if (botItem) {
                listData.push(botItem as IBotItem);
            }
        });
        setRobotList(listData);
    };

    // 获取列表可渲染的长度clientHeight 距离底部最小120px
    const updateShowNum = throttle(() => {
        const current: any = listRef.current;
        const { clientHeight } = current;
        const showListNum = Math.floor((clientHeight - 120 - 48 - 48) / 48);
        setRobotShowNum(showListNum);
    }, 1000);

    useEffect(() => {
        // 创建监听器监听sidebar高度变化，改变时重新计算展示的数量
        const observerFun = new ResizeObserver((entries) => {
            for (const entry of entries) {
                updateShowNum();
            }
        });
        if (listRef.current) {
            observerFun.observe(listRef.current);
        }
        return () => {
            observerFun.disconnect();
        };
    }, []);

    useEffect(() => {
        if (isEmpty(robotDict)) {
            return;
        }
        getRobotListFromKey();
    }, [robotDict?.bot, sidebarList]);

    // 切换机器人列表，并更新context上的当前机器人信息
    const changeRobot = (item: IBotItem) => {
        const { type, key } = item;
        navigator(`/conversation/${type}/${key}`);
        dispatch({
            type: 'i_model_info',
            payload: {
                modelInfo: item
            }
        });
    };

    const hidenContent = () => {
        return (
            <div className={styles.robotHiddenCon}>
                <div className={styles.title}>更多大模型</div>
                <div className={styles.robotHiddenList}>
                    {hidenList?.map((item: IBotItem) => {
                        if (!item) {
                            return null;
                        }
                        const { name, iconUrl, key } = item;
                        const isCurrent = key === model;
                        return (
                            <div
                                key={key}
                                className={styles.hiddenItem}
                                onClick={() => {
                                    setIsShowMoreBot(false);
                                    if (isCurrent) {
                                        return;
                                    }
                                    changeRobot(item);
                                }}>
                                <img src={iconUrl} />
                                <span>{name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // 用来控制‘更多机器人按钮’既能hover悬停也能click点击的问题
    const handleClickChange = (open: boolean) => {
        setIsShowMoreTip(false);
        setIsShowMoreBot(open);
    };
    const handleHoverChange = (open: boolean) => {
        setIsShowMoreBot(false);
        setIsShowMoreTip(open);
    };

    return (
        <div ref={listRef} className={styles['robot-nav-list']}>
            {showList?.map((item: IBotItem) => {
                if (!item) {
                    return null;
                }
                const { key, iconUrl, name } = item;
                const isCurrent = key === model;
                return (
                    <Tooltip key={key} placement="left" title={name}>
                        <span
                            className={classNames(styles.robotItem, { [styles.robotItemActive]: isCurrent })}
                            onClick={() => {
                                if (isCurrent) {
                                    return;
                                }
                                changeRobot(item);
                            }}>
                            <img src={iconUrl} />
                        </span>
                    </Tooltip>
                );
            })}
            {hidenList.length > 0 && (
                <Popover
                    placement="leftBottom"
                    title={''}
                    content={hidenContent}
                    trigger="click"
                    zIndex={10002}
                    open={isShowMoreBot}
                    onOpenChange={handleClickChange}
                    overlayInnerStyle={{ padding: 0 }}>
                    <Tooltip placement="left" open={isShowMoreTip} onOpenChange={handleHoverChange} title="更多大模型">
                        <span className={styles.robotItem}>
                            <Icon component={EllipsisOutlineIcon} style={{ fontSize: '20px', color: '#7171ee' }} />
                        </span>
                    </Tooltip>
                </Popover>
            )}
            <Tooltip placement="left" title="全部大模型">
                <span onClick={() => setIsShowRobotShop(true)} className={styles.robotItem}>
                    <AddIcon />
                </span>
            </Tooltip>

            {/* 机器人商店 */}
            <RobotShopDrawer open={isShowRobotShop} onClose={() => setIsShowRobotShop(false)} />
        </div>
    );
};
