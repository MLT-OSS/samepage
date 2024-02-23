/**
 * 机器人商店弹窗
 */
import { useEffect, useState } from 'react';
import { App, Input, Tabs, InputProps, Empty } from 'antd';
import { debounce, isEmpty } from 'lodash-es';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import styles from './index.module.less';

import { ReactComponent as LogoIcon } from '@/assets/images/logo.svg';
import { ReactComponent as SearchIcon } from '@/assets/images/search.svg';
import { ReactComponent as FixedIcon } from '@/assets/images/fixed.svg';
import { ReactComponent as UnFixedIcon } from '@/assets/images/unfixed.svg';
import { useConversationContext } from '@xm/context';
import { useFixed } from '@xm/hooks';
import { GetDictBotResponse } from '@/ytt-type/robot';

import type { IRobotShopProps } from '@/types';
import { SUPPORT_PLATFORM, UNSUPPORT_PLATFORM } from '@xm/permission';
import { isFutureSupported } from '@/utils';
import { MorePermissionGuide } from '../more-permission-guide';

type IBotItem = GetDictBotResponse['bot'][0];

interface ICategoryListData {
    key: string;
    name: string;
    children: any;
}

export const RobotShop = (props: IRobotShopProps) => {
    const navigator = useNavigate();
    const { message } = App.useApp();

    const { open, onClose, showFiexd = true, showFilter = true } = props;

    const { conversationState, dispatch } = useConversationContext();
    const { robotDict, modelInfo, sidebarListSet } = conversationState;
    const model = modelInfo?.key;
    const { category } = (robotDict || {}) as { category: ICategoryListData[] };

    const categoryList = robotDict?.category ?? [];

    const [childCategoryList, setChildCategoryList] = useState<ICategoryListData[]>([]);

    // robotList：当前一级分类下的全量robot
    const [robotList, setRobotList] = useState<IBotItem[]>([]);
    const [catagoryKey, setCatagoryKey] = useState<string>('');
    // 二级分类下的robot列表
    const [chldRobotList, setChldRobotList] = useState<IBotItem[]>([]);
    const [showRobotList, setShowRobotList] = useState<IBotItem[]>([]);

    const [searchValue, setSearchValue] = useState('');

    // 每次全局字典里的robotlist更新，更新弹窗内的列表信息
    const updateList = () => {
        const newList: IBotItem[] = [];
        const newchildList: IBotItem[] = [];
        const newshowList: IBotItem[] = [];

        robotList?.forEach((i: IBotItem) => {
            newList.push(robotDict?.botMap?.get(i.key) as IBotItem);
        });
        chldRobotList?.forEach((i) => {
            newchildList.push(robotDict?.botMap?.get(i.key) as IBotItem);
        });
        showRobotList?.forEach((i) => {
            newshowList.push(robotDict?.botMap?.get(i.key) as IBotItem);
        });

        newList?.sort((a: IBotItem, b: IBotItem) => a?.sort - b?.sort);
        newchildList?.sort((a: IBotItem, b: IBotItem) => a?.sort - b?.sort);
        setChldRobotList(newchildList);
        setShowRobotList(newshowList);
        setRobotList(newList);
    };

    const { handleFixed } = useFixed();

    // 弹窗打开关闭时所需逻辑
    useEffect(() => {
        initList();
    }, [open]);

    const initList = () => {
        setSearchValue('');
        // 拿分类的第一个key去构建二级分类的信息
        const { key } = category?.[0] ?? {};
        getChildCatagory(key as any);
    };

    // robotList每次改变的时候，都将所有的robotList赋值给二级分类的’all‘
    useEffect(() => {
        getChildRobotList('all');
    }, [robotList]);

    // robotList每次改变的时候，更新弹窗里的列表信息
    useEffect(() => {
        if (!isEmpty(robotDict) && !isEmpty(robotList)) {
            updateList();
        }
    }, [robotDict?.bot]);

    // 点击一级分类时对应的逻辑处理
    const onChange = (key: string) => {
        getChildCatagory(key);
        setSearchValue('');
    };

    // 点击一级分类时获取对应的二级分类，并手动添加一个all
    const getChildCatagory = (curKey: string) => {
        setCatagoryKey(curKey);
        let newChildren: any = [];
        categoryList?.forEach((item) => {
            const { key, children } = item;
            if (key === curKey && children) {
                newChildren = children;
            }
        });
        if (newChildren.length > 0) {
            newChildren = [
                {
                    key: 'all',
                    name: '全部'
                },
                ...newChildren
            ];
        }
        setChildCategoryList(newChildren);
        getCurRobotList(curKey, newChildren);
    };

    // 获取一级分类下的robot列表,newChildren存在则取二级分类的key所对应的robot
    const getCurRobotList = (curKey: string, newChildren: ICategoryListData[]) => {
        let newList: IBotItem[] = [];

        if (newChildren?.length > 0) {
            // 存在二级分类的情况，获取所有二级分类的robot集合
            const categorySet = new Set();
            newChildren?.forEach((i) => categorySet.add(i.key));
            newList = robotDict?.bot?.filter((i) => categorySet.has(i.categoryKey)) as IBotItem[];
        } else {
            // 不存在二级分类的情况
            newList = robotDict?.bot?.filter((i) => i.categoryKey === curKey) as IBotItem[];
        }

        newList?.sort((a: IBotItem, b: IBotItem) => a?.sort - b?.sort);
        // 同时设置二级分类的全部
        setRobotList(newList);
        setChldRobotList(newList);
        setShowRobotList(newList);
    };

    // 点击二级分类时对应的逻辑处理
    const onChildChange = (key: string) => {
        setSearchValue('');
        getChildRobotList(key);
    };

    // 获取二级分类下的robot列表
    const getChildRobotList = (curKey: string) => {
        let newList: IBotItem[] = [];
        if (curKey === 'all') {
            newList = robotList;
        } else {
            newList = robotList?.filter((i) => i?.categoryKey === curKey) as IBotItem[];
        }
        setChldRobotList(newList);
        setShowRobotList(newList);
    };

    // 目前数据很少，前端写搜索，精确搜索name和desc
    const searchFun = debounce((queryString: string) => {
        const trimVal = queryString.trim();

        const searchList = chldRobotList?.filter(
            (i) =>
                i?.name.toLowerCase().indexOf(trimVal.toLowerCase()) !== -1 ||
                i?.desc.toLowerCase().indexOf(trimVal.toLowerCase()) !== -1
        ) as IBotItem[];

        setShowRobotList(searchList);
    }, 200);

    const handleOnSearch: InputProps['onChange'] = (e) => {
        const { value } = e?.target || {};
        setSearchValue(value);
        searchFun(value);
    };

    // 打开对应的对话页面
    const handleOnItemClick = (item: IBotItem, disabled: boolean) => {
        if (disabled) {
            const content = `${UNSUPPORT_PLATFORM}正在开发中，请前往${SUPPORT_PLATFORM}进行体验～`;
            message.error({ key: content, content });
            return;
        }
        const { type, key } = item;
        // 点击的机器人为当前机器人直接关闭弹窗
        if (model !== key) {
            navigator(`/conversation/${type}/${key}`);
            dispatch({
                type: 'i_model_info',
                payload: {
                    modelInfo: item
                }
            });
        }
        onClose();
        initList();
    };

    // 固定机器人
    const handleOnFix = (key: string, fixed: string) => {
        handleFixed({
            fixed,
            key
        });
    };

    const searchEmpty = !!(searchValue && showRobotList?.length < 1);
    return (
        <div className={styles.robotShop}>
            <div className={styles.robotShopCon}>
                <div className={styles.categoryBar}>
                    <Tabs
                        defaultActiveKey="1"
                        onChange={onChange}
                        items={categoryList?.map((item) => {
                            const { key, name } = item;
                            return {
                                label: <span className={styles['robot-category-bar']}>{name}</span>,
                                key: key
                            };
                        })}
                    />
                </div>
                {showFilter && (
                    <>
                        <div className={styles.search}>
                            <Input
                                value={searchValue}
                                size="middle"
                                placeholder="搜索模型"
                                prefix={<SearchIcon className={styles['icon-size']} />}
                                onChange={handleOnSearch}
                            />
                        </div>
                        {childCategoryList?.length > 0 && (
                            <div className={styles['child-category-bar']}>
                                <Tabs
                                    defaultActiveKey="all"
                                    onChange={onChildChange}
                                    items={childCategoryList?.map((childItem) => {
                                        return {
                                            label: (
                                                <span className={styles['child-category-name']}>{childItem?.name}</span>
                                            ),
                                            key: childItem?.key
                                        };
                                    })}
                                />
                            </div>
                        )}
                    </>
                )}
                <div className={styles.robotList}>
                    {searchEmpty || showRobotList?.length <= 0 ? (
                        <div className={styles['empty-wapper']}>
                            <Empty
                                className={styles.empty}
                                image={<LogoIcon />}
                                imageStyle={{ height: 60 }}
                                description={`没有符合条件的大模型`}
                            />
                        </div>
                    ) : (
                        showRobotList?.map((robotItem) => {
                            if (!robotItem) {
                                return null;
                            }
                            const { iconUrl, key, name, desc, system } = robotItem as any;
                            const disabled = isFutureSupported(robotItem);
                            const fixed = sidebarListSet?.has(key);
                            return (
                                <div
                                    key={key}
                                    className={classNames(styles.itemOut, { [styles.disabled]: disabled })}
                                    onClick={() => handleOnItemClick(robotItem, disabled)}>
                                    <div className={styles['robot-item']}>
                                        <img className={styles['robot-icon']} src={iconUrl} />
                                        <div className={styles['robot-con']}>
                                            <h3
                                                className={`${styles['title']} ${
                                                    !showFiexd ? styles['h5-title'] : ''
                                                }`}>
                                                {name}
                                            </h3>
                                            <p
                                                className={`${styles['desc']} ${
                                                    !showFiexd ? styles['collapse-2'] : ''
                                                }`}>
                                                {desc}
                                            </p>
                                        </div>
                                        {/* 系统类型的模型没有固定和取消固定展示 */}
                                        {showFiexd && (
                                            <>
                                                {fixed && !system ? (
                                                    <FixedIcon
                                                        onClick={(e: any) => {
                                                            e.stopPropagation();
                                                            handleOnFix(key, 'false');
                                                        }}
                                                        className={styles['fix-icon']}
                                                    />
                                                ) : !system ? (
                                                    <UnFixedIcon
                                                        onClick={(e: any) => {
                                                            e.stopPropagation();
                                                            handleOnFix(key, 'true');
                                                        }}
                                                        className={styles['fix-icon']}
                                                    />
                                                ) : null}
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                <MorePermissionGuide hide={searchEmpty || !['assistant'].includes(catagoryKey)} />
            </div>
        </div>
    );
};
