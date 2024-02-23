import { useEffect, useState, useRef } from 'react';
import styles from './index.module.less';
import { Tabs } from 'antd';
import cl from 'classnames';

import InfiniteScroll from 'react-infinite-scroll-component';
import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';
import type { CUE_WORD } from '@/types';
import { PROMPT_TYPES } from '@/constants';
import { useConversationContext } from '@xm/context';
import { getPromptVars, isH5, CTM_PROMPT_URL } from '@/utils';

import { Loading } from '@xm/components';
import { ReactComponent as AddIcon } from '@/assets/images/add-circle-outline.svg';
import { PromptEmpty } from '../prompt-empty';
import { PromptItem } from './components/prompt-item';
import Icon from '@ant-design/icons';

const PAGE_SIZE = 20;

export const PromptScrollTabs = (props: CUE_WORD.IPromptDrawerProps) => {
    const { open, onClose, editCueWord, showDrawer } = props;
    const {
        conversationState: { userinfo }
    } = useConversationContext();
    const { roleType, type: userType } = userinfo || {};

    const scrollDivRef = useRef<HTMLDivElement>(null);

    const [promptData, setPromptData] = useState<CUE_WORD.PromptRecordItem[]>([]);
    const [showMore, setShowMore] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [promptType, setPromptType] = useState<string>('');

    const [promptLoading, setPromptLoading] = useState<boolean>(true); // 避免getPrompt时展示兜底空页面
    const [promptCountLoading, setPromptCountLoading] = useState<boolean>(false); // 避免Tab组件defaultActiveKey不生效

    // 请求获取提示词数量,用于初始化tab默认展示
    const { run: getPromptsCount } = useRequest(services.prompts.getPromptsCount, {
        manual: true,
        onSuccess: (res) => {
            const { userCustom, enterprise } = res;
            const defaultKey = userCustom > 0 ? 'user_custom' : enterprise > 0 ? 'enterprise' : 'official';
            setPromptType(defaultKey);
            setPromptCountLoading(false);
            getDatas(1, defaultKey);
        },
        onError: () => {
            setPromptCountLoading(false);
        }
    });

    // 请求获取提示词
    const { run: getPrompts } = useRequest(services.prompts.getPrompts, {
        manual: true,
        onSuccess: (res) => {
            const { records } = res;
            if (records?.length < PAGE_SIZE) {
                setShowMore(false);
            }
            setPageNo(pageNo + 1);
            setPromptData([...promptData, ...records]);
            setPromptLoading(false);
        },
        onError: () => {
            setPromptLoading(false);
        }
    });

    const getDatas = async (pageNo: number, type?: string) => {
        setPromptLoading(true);
        getPrompts({
            pageNo: pageNo || 1,
            pageSize: PAGE_SIZE,
            type: type || promptType
        });
    };

    // 管理员-跳转页面创建“企业提示词”；普通用户-弹窗创建“我的提示词”
    const onAddPrompts = () => {
        if (promptType === 'user_custom') {
            editCueWord?.({});
        } else if (promptType === 'enterprise' && roleType === 'ENTERPRISE_ADMIN') {
            window.open(CTM_PROMPT_URL, '_blank');
        }
    };

    useEffect(() => {
        if (open) {
            getPromptsCount();
        } else {
            setTimeout(() => {
                // 初始化置空
                setPromptType('');
                setPromptData([]);
            }, 100);
        }
    }, [open]);

    const onChangeTab = (key: string) => {
        setPromptData([]);
        setPromptType(key);
        getDatas(1, key);
    };

    const onEditCueWord = (item: Partial<CUE_WORD.PromptRecordItem>) => {
        editCueWord?.(item);
        onClose?.();
    };

    // 点击打开我的提示词
    const showCueWordDrawer = (info: any) => {
        const variable: any = getPromptVars(info.content);
        const data = { ...info, ...{ variableType: variable.length > 0 ? 1 : 2, variable } };
        showDrawer?.(data);
        onClose?.();
    };
    const promptTypeMap = PROMPT_TYPES.filter((i) => !(i.key === 'enterprise' && userType === 'PERSONAL'));

    return (
        <div className={cl(styles.promptScrollTabs, { [styles.h5Prompt]: isH5 })}>
            <div className={styles['prompt-type-tab']}>
                <div>
                    {!promptCountLoading && promptType && (
                        <Tabs
                            defaultActiveKey={promptType}
                            onChange={onChangeTab}
                            items={promptTypeMap?.map((item: CUE_WORD.PromptType) => {
                                const { key, name } = item;
                                return {
                                    label: <span className={styles['prompt-type-bar']}>{name}</span>,
                                    key: key
                                };
                            })}
                        />
                    )}
                </div>
                {!isH5 && (
                    <span className={styles['add-icon']}>
                        <Icon component={AddIcon} onClick={() => onEditCueWord({})} />
                    </span>
                )}
            </div>
            <div id="__xm_prompt_drawer_scrollable_div__" ref={scrollDivRef} className={styles['scroll-wapper']}>
                {!(promptData?.length > 0) && !promptLoading ? (
                    <div className={styles['empty-wapper']}>
                        <PromptEmpty addCb={onClose} type={promptType} onAddPrompts={onAddPrompts} />
                    </div>
                ) : (
                    <InfiniteScroll
                        scrollableTarget={scrollDivRef?.current as any}
                        height={'100%'}
                        dataLength={promptData.length}
                        next={() => getDatas(pageNo, promptType)}
                        hasMore={showMore}
                        loader={
                            <div style={{ textAlign: 'center' }}>
                                <Loading />
                            </div>
                        }
                        endMessage={!promptLoading && <div className={styles.nothing}>没有更多了</div>}>
                        {promptData?.map((item: CUE_WORD.PromptRecordItem, index: number) => (
                            <div className={styles['item-wapper']} key={index}>
                                <PromptItem
                                    info={item}
                                    type={promptType}
                                    showDrawer={() => showCueWordDrawer(item)}
                                    editCueWord={() => onEditCueWord?.(item)}
                                />
                            </div>
                        ))}
                    </InfiniteScroll>
                )}
            </div>
        </div>
    );
};
