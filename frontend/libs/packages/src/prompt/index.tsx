/**
 * 提示词
 */
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from './index.module.less';
import { Button, Input, Pagination, Tabs, InputProps } from 'antd';
import { ReactComponent as CueWordIconAdd } from '@/assets/images/cue-word-add.svg';
import Icon, { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { PROMPT_TYPES } from '@/constants';
import { useConversationContext } from '@xm/context';
import { CUE_WORD } from '@/types';
import { PromptInfo } from '../prompt-info';
import { PromptEmpty } from '../prompt-empty';
import { SystemPromptInfo } from '../system-prompt-info';
import { PromptUse } from '../prompt-use';
import { isFunction, debounce } from 'lodash-es';
import { PromptCard } from '../prompt-card';
import services from '@xm/services';
import useRequest from '@ahooksjs/use-request';
import { ReactComponent as SearchIcon } from '@/assets/images/search.svg';
import { TLanguage } from '@xm/hooks';
import { Loading } from '@xm/components';
import { CTM_PROMPT_URL } from '@/utils';
interface Props {
    sendByCueWord: (text: string) => void;
    fillInInput: (text: string) => void;
    showLang?: boolean;
    lang: TLanguage;
    setLang: (info: any) => void;
}

export const Prompt = forwardRef((props: Props, ref: any) => {
    const {
        conversationState: { userinfo }
    } = useConversationContext();
    const { roleType, type: userType } = userinfo || {};
    const modalRef = useRef(null);
    const systemModalRef = useRef(null);
    const drawerRef = useRef(null);

    const [searchParams, setSearchParams] = useState<any>({});
    const [isShowDiv, setIsShowDiv] = useState<boolean>(true);

    const [prompts, setPrompts] = useState<any>([]);
    const initPagetation = {
        pageNo: 1,
        pageSize: 6,
        total: 0,
        type: 'user_custom' // 提示词类型, user_custom-用户自定义提示词,official-官方提示词,quick_action-快捷指令提示词,enterprise-企业提示词
    };
    const [pagetation, setPagetation] = useState<any>(initPagetation);
    const [defaultActiveKey, setDefaultActiveKey] = useState<string>('');
    const [promptLoading, setPromptLoading] = useState<boolean>(true);
    const [promptCountLoading, setPromptCountLoading] = useState<boolean>(true);

    useImperativeHandle(ref, () => {
        return {
            // 展示提示词模块
            _showDiv() {
                setIsShowDiv(true);
            },
            // 隐藏提示词模块
            _hideDiv() {
                setIsShowDiv(false);
            },
            // 打开提示词弹窗
            _showCueWordModal(info: any) {
                editCueWord(info);
            },
            // 提示词使用
            _showCueWordDrawer(info: any) {
                showDrawer(info);
            }
        };
    });

    useEffect(() => {
        setPromptCountLoading(true);
        getPromptsCount();
    }, []);

    // 1.创建/删除 2.修改 重新请求列表
    const refresh = (type: number) => {
        if (type === 1) {
            setPagetation(initPagetation);
            getPromptsInfo(initPagetation);
        } else {
            getPromptsInfo(pagetation);
        }
    };

    // 请求获取提示词数量,用于初始化tab默认展示
    const { run: getPromptsCount } = useRequest(services.prompts.getPromptsCount, {
        manual: true,
        onSuccess: (res) => {
            const { userCustom, enterprise } = res;
            const defaultKey = userCustom > 0 ? 'user_custom' : enterprise > 0 ? 'enterprise' : 'official';
            setDefaultActiveKey(defaultKey);
            setPromptLoading(true);
            setPagetation({ ...initPagetation, type: defaultKey });
            setPromptCountLoading(false);
            getPromptsInfo({ ...initPagetation, type: defaultKey });
        },
        onError: () => {
            setPromptCountLoading(false);
        }
    });

    // 请求获取提示词
    const { run: getPrompts } = useRequest(services.prompts.getPrompts, {
        manual: true,
        onSuccess: (res) => {
            const { total, records } = res;
            setPrompts(records);
            setPagetation({ ...pagetation, total });
            setPromptLoading(false);
        },
        onError: () => {
            setPromptLoading(false);
        }
    });

    const getPromptsInfo = (newPagetation: any = {}, newParams: any = {}) => {
        setPromptLoading(true);
        getPrompts({ ...newPagetation, ...newParams });
    };

    // 编辑提示词
    const editCueWord = (info: any) => {
        showModal(info);
    };
    // 查看系统提示词
    const viewCueWord = (info: any) => {
        showSystemModal(info);
    };
    // 打开自建提示词
    const showModal = (info: any) => {
        const { _showModal } = modalRef?.current || {
            _showModal: null
        };
        if (isFunction(_showModal)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            _showModal(info);
        }
    };
    // 打开系统提示词
    const showSystemModal = (info: any) => {
        const { _showSystemModal } = systemModalRef?.current || {
            _showSystemModal: null
        };
        if (isFunction(_showSystemModal)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            _showSystemModal(info);
        }
    };
    // 打开提示词使用
    const showDrawer = (info: any) => {
        // variableType === 2: 没有变量，将内容填充到输入框
        if (info.variableType === 2) {
            fillInInput(info.content);
            return;
        }
        const { _showDrawer } = drawerRef?.current || {
            _showDrawer: null
        };
        if (isFunction(_showDrawer)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            _showDrawer(info);
        }
    };

    // 翻页
    const onPageChange = (page: any) => {
        const newPagetation = { ...pagetation, pageNo: page };
        setPagetation(newPagetation);
        getPromptsInfo(newPagetation);
    };

    // 打开提示词详情 用户自建打开编辑框 系统的打开系统提示词查看框
    const openCueWordDetail = (info: any) => {
        if (info.type === 'user_custom') {
            editCueWord(info);
        } else {
            viewCueWord(info);
        }
    };

    // 筛选
    const onSearch = debounce((params: any) => {
        const newPagetation = { ...pagetation, pageNo: 1 };
        setPagetation(newPagetation);
        getPromptsInfo(newPagetation, { name: params.name?.trim() });
    }, 200);

    const handleOnSearch: InputProps['onChange'] = (e) => {
        const params = e.target.value ? { name: e.target.value } : {};
        setSearchParams(params);
        onSearch(params);
    };

    // 会话框-发起会话
    const sendToConversation = (text: string) => {
        props.sendByCueWord(text);
    };
    // 关键词调用,填入到会话输入文本框
    const fillInInput = (text: string) => {
        props.fillInInput(text);
    };

    const onChangeTab = (key: string) => {
        setSearchParams({ name: '' });
        setPrompts([]);
        setPagetation({ ...initPagetation, type: key });
        getPromptsInfo({ ...initPagetation, type: key });
    };

    // 管理员-跳转页面创建“企业提示词”；普通用户-弹窗创建“我的提示词”
    const onAddPrompts = () => {
        if (pagetation.type === 'user_custom') {
            showModal({});
        } else if (pagetation.type === 'enterprise' && roleType === 'ENTERPRISE_ADMIN') {
            window.open(CTM_PROMPT_URL, '_blank');
        }
    };
    const promptTypeMap = PROMPT_TYPES.filter((i) => !(i.key === 'enterprise' && userType === 'PERSONAL'));

    return (
        <div>
            <div className={styles['cue-word']} style={{ display: isShowDiv ? 'block' : 'none' }}>
                <div className="table-card">
                    <div className={styles['cue-word-tab']}>
                        {!promptCountLoading && (
                            <Tabs
                                defaultActiveKey={defaultActiveKey}
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
                    <div className="use">
                        <Input
                            value={searchParams.name}
                            placeholder="搜索"
                            prefix={<Icon component={SearchIcon} style={{ fontSize: '16px' }} />}
                            size="small"
                            onChange={handleOnSearch}
                            allowClear
                        />
                        {(pagetation?.type === 'user_custom' ||
                            (pagetation?.type === 'enterprise' && roleType === 'ENTERPRISE_ADMIN')) && (
                            <Button
                                className="cue-word-add-but"
                                icon={<CueWordIconAdd />}
                                size="small"
                                onClick={onAddPrompts}
                            />
                        )}
                    </div>
                    <div className={styles['cue-word-info']}>
                        {(promptLoading || promptCountLoading) && !searchParams.name ? (
                            <Loading />
                        ) : !(prompts?.length > 0) && !searchParams.name ? (
                            <PromptEmpty type={pagetation.type} onAddPrompts={onAddPrompts} />
                        ) : (
                            <div className="prompt-wrap">
                                <div className="table-list">
                                    {prompts?.map((item: CUE_WORD.PromptRecordItem, key: number) => (
                                        <PromptCard
                                            showDrawer={showDrawer}
                                            editCueWord={editCueWord}
                                            viewCueWord={viewCueWord}
                                            key={key}
                                            info={item}
                                        />
                                    ))}
                                </div>
                                <div className="pagetation">
                                    <div className="page-total">共有{pagetation?.total || 0}个提示词</div>
                                    <div className="page">
                                        <Pagination
                                            pageSize={6}
                                            total={pagetation?.total || 0}
                                            defaultCurrent={1}
                                            current={pagetation.pageNo}
                                            itemRender={(current, type, _) => {
                                                if (type === 'prev') return <LeftOutlined />;
                                                if (type === 'next') return <RightOutlined />;
                                                if (type === 'page' && current === pagetation.pageNo) {
                                                    return <span className="current-page">{current}</span>;
                                                }
                                                return null;
                                            }}
                                            onChange={(page: any) => {
                                                onPageChange(page);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <PromptInfo ref={modalRef} refresh={refresh} />
            <SystemPromptInfo ref={systemModalRef} showDrawer={showDrawer} fillInInput={fillInInput} />
            <PromptUse
                ref={drawerRef}
                openCueWordDetail={openCueWordDetail}
                sendToConversation={sendToConversation}
                showLang={props.showLang}
                lang={props.lang}
                setLang={props.setLang}
            />
        </div>
    );
});
