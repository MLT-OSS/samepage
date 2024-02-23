/**
 * 入口按钮
 */
import { useState, useEffect, useRef } from 'react';
import styles from './index.module.less';
import { STORAGE_ROBOT_DICTIONARY } from '@/constants';
import { useConversationContext } from '@xm/context';
import { Select, Switch, Tooltip } from 'antd';
import { ReactComponent as BookIcon } from '@/assets/images/entry/book.svg';
import { ReactComponent as SettingIcon } from '@/assets/images/setting.svg';
import { ReactComponent as Setting2Icon } from '@/assets/images/setting-2.svg';
import { ReactComponent as TranslateIcon } from '@/assets/images/entry/translate.svg';
import { ReactComponent as CheckboxIcon } from '@/assets/images/checkbox.svg';
import classNames from 'classnames';
import { translate, getSessionValue, setSessionValue } from '@/utils';
import { Translator } from '@xm/packages';
import { GetDictBotResponse } from '@/ytt-type/robot';
import Icon from '@ant-design/icons';
import Browser from 'webextension-polyfill';
import { useFloatMenuPermission, useSelectionSwitch } from '@xm/hooks';

const {
    getSetting,
    getRules,
    OPT_LANGS_FROM,
    OPT_LANGS_TO,
    STOKEY_RULE_SETTING,
    OPT_TRANSLATE_ALL,
    AUTO_TRANSLATE_PATH,
    AUTO_TRANSLATE_NONE,
    AUTO_TRANSLATE_DOMAIN,
    STOKEY_PATH_ARR
} = translate;
const isIframe = window.self !== window.top;

interface IEntryProps {
    dataMove: string;
    dataTop: string;
    onClick: () => void;
    disabledMove?: (disabled: boolean) => void;
}
let translatorObj: any = null;
let modelHover = false;
let tempShow = false;
let localHref = '';

const EntryBtn: React.FC<IEntryProps> = (props) => {
    const { dataMove, dataTop, onClick, disabledMove } = props;
    const { conversationState, dispatch } = useConversationContext();
    const userinfo = conversationState?.userinfo;
    const selectFlag = conversationState?.selectFlag;

    const [transOpen, setTransOpen] = useState<string>('false');
    const [showSetting, setShowSetting] = useState(false);
    const [showModel, setShowModel] = useState(false);
    const [fromLang, setFromLang] = useState<string>();
    const [toLang, setToLang] = useState<string>();
    const [autoSetting, setAutoSetting] = useState<string>(AUTO_TRANSLATE_NONE);
    const [currentDomain, setCurrentDomain] = useState<string>();
    const [showReadArticle, setShowReadArticle] = useState<boolean>(false); // hover 阅读全文是否可见
    const [readArticleModelInfo, setReadArticleModelInfo] = useState<any>(); // 存储允许阅读全文的模型信息
    const { immersiveTranslationPermission } = useFloatMenuPermission();

    const [selectionSwitch, setSelectionSwitch] = useSelectionSwitch();
    const settingModelHover = useRef<boolean>(false);
    const [showSettingModel, setShowSettingModel] = useState<boolean>(false);

    const onSettingModelMouseEnter = () => {
        settingModelHover.current = true;
    };
    const onSettingModelMouseLeave = () => {
        settingModelHover.current = false;
    };
    const onOpenSettingModel = () => {
        setShowSettingModel(!showSettingModel);
    };
    useEffect(() => {
        const onCloseSettingModel = () => {
            if (settingModelHover.current) {
                return;
            }
            setShowSettingModel(false);
        };
        window.addEventListener('click', onCloseSettingModel, false);
        return () => {
            window.removeEventListener('click', onCloseSettingModel, false);
        };
    }, []);

    const readArticle = () => {
        onClick();
        // 设置 modelInfo
        dispatch({
            type: 'i_model_info',
            payload: {
                modelInfo: readArticleModelInfo
            }
        });
        // 跳转
        dispatch({
            type: 'redirect_conv',
            payload: {
                redirectConvInfo: {
                    path: `/conversation/${readArticleModelInfo.type}/${readArticleModelInfo.key}`,
                    options: { readArticle: true }
                }
            }
        });
    };

    const handleTransToggle = () => {
        tempShow = false;
        setShowModel(tempShow);
        if (translatorObj) {
            try {
                const curr = transOpen === 'true' ? 'false' : 'true';
                setTransOpen(curr);
                translatorObj?.toggle();
            } catch (err) {
                console.log('[toggle trans]', err);
            }
        }
    };
    const handleFromChange = (value: string) => {
        if (translatorObj) {
            try {
                setFromLang(value);
                translatorObj.updateRule({ fromLang: value }, (data: any) => {
                    setSessionValue({ key: STOKEY_RULE_SETTING + userinfo?.userId, value: data });
                });
            } catch (err) {
                console.log('[update rule]', err);
            }
        }
    };
    const handleToChange = (value: string) => {
        if (translatorObj) {
            try {
                setToLang(value);
                translatorObj.updateRule({ toLang: value }, (data: any) => {
                    setSessionValue({ key: STOKEY_RULE_SETTING + userinfo?.userId, value: data });
                });
            } catch (err) {
                console.log('[update rule]', err);
            }
        }
    };
    const handleAutoSettingChange = async (value: string) => {
        const currentPath = isIframe ? document.referrer : document.location.href;
        const pathArr: any = (await getSessionValue(STOKEY_PATH_ARR + userinfo?.userId)) || [];
        const newArr: any = [...pathArr];
        if (value === AUTO_TRANSLATE_NONE) {
            const pindex = newArr.indexOf(currentPath);
            if (pindex > -1) newArr.splice(pindex, 1);
            const dindex = newArr.indexOf(currentDomain);
            if (dindex > -1) newArr.splice(dindex, 1);
        } else if (value === AUTO_TRANSLATE_PATH) {
            const dindex = newArr.indexOf(currentDomain);
            if (dindex > -1) newArr.splice(dindex, 1);
            if (!newArr.includes(currentPath)) newArr.push(currentPath);
        } else if (value === AUTO_TRANSLATE_DOMAIN) {
            const pindex = newArr.indexOf(currentPath);
            if (pindex > -1) newArr.splice(pindex, 1);
            if (!newArr.includes(currentDomain)) newArr.push(currentDomain);
        }
        setSessionValue({ key: STOKEY_PATH_ARR + userinfo?.userId, value: newArr });
        setAutoSetting(value);
    };
    /**
     * 入口函数
     */
    const init = async (path: string, domain: string) => {
        // 网页
        const setting: any = await getSetting();
        const rules: any = await getRules();
        let rule = rules[0];
        const data: any = await getSessionValue(STOKEY_RULE_SETTING + userinfo?.userId);
        const pathArr: any = (await getSessionValue(STOKEY_PATH_ARR + userinfo?.userId)) || [];
        if (data) {
            const { fromLang, toLang, translator } = data;
            rule = { ...rule, fromLang, toLang, translator };
        }
        if (pathArr.includes(path)) {
            setAutoSetting(AUTO_TRANSLATE_PATH);
        } else if (pathArr.includes(domain)) {
            setAutoSetting(AUTO_TRANSLATE_DOMAIN);
        } else {
            setAutoSetting(AUTO_TRANSLATE_NONE);
        }
        rule = { ...rule, transOpen: (pathArr.includes(domain) || pathArr.includes(path)).toString() };
        setTransOpen(rule.transOpen);
        setFromLang(rule.fromLang);
        setToLang(rule.toLang);
        translatorObj = new Translator(rule, setting);
        localHref = path;
    };
    const handleSetting = () => {
        tempShow = !showModel;
        setShowModel(tempShow);
    };
    const mouseenter = () => {
        modelHover = true;
    };
    const mouseleave = () => {
        modelHover = false;
    };
    const cancelModel = () => {
        if (!modelHover && tempShow) {
            tempShow = false;
            setShowModel(tempShow);
        }
    };
    // 单页面路由切换时更新翻译状态
    const changePath = async () => {
        setTimeout(() => {
            const currentPath = isIframe ? document.referrer : document.location.href;
            if (localHref && currentDomain && translatorObj && localHref !== currentPath) {
                localHref = currentPath;
                init(localHref, currentDomain);
            }
        }, 1000);
    };

    changePath();

    useEffect(() => {
        (async () => {
            // 获取用户信息 设置 阅读全文 可见状态
            if (userinfo?.userId) {
                const botDict: GetDictBotResponse = (await getSessionValue(STORAGE_ROBOT_DICTIONARY)) as any;
                const modelInfo = (botDict?.bot || []).find((i) => (i.feature || []).includes('read_article'));
                setShowReadArticle(!!modelInfo);
                setReadArticleModelInfo(modelInfo);
            }
            // 退出登录后清空翻译
            if (!userinfo?.userId && translatorObj && translatorObj.rule.transOpen === 'true') {
                translatorObj?.toggle();
                translatorObj = null;
            }
        })();
    }, [userinfo]);

    useEffect(() => {
        (async () => {
            if (immersiveTranslationPermission && userinfo?.userId) {
                const path = isIframe ? document.referrer : document.location.href;
                const domain = path.split('://')[1].split('?')[0].split('/')[0];
                setCurrentDomain(domain);
                await init(path, domain);
                Browser.storage.local.get().then((res) => {
                    console.log('all', res);
                });
            }
        })();
    }, [immersiveTranslationPermission, userinfo?.userId]);

    useEffect(() => {
        window.addEventListener('click', cancelModel);
        return () => {
            window.removeEventListener('click', cancelModel);
            modelHover = false;
            tempShow = false;
        };
    }, []);

    return (
        <div className={styles.entry} onClick={onClick} data-moving={dataMove} data-top={dataTop}>
            <div className={styles.btnBox}>
                <span className={styles.logo}>
                    <span className={classNames(styles.bg, styles.bg1)} />
                    <span className={classNames(styles.bg, styles.bg2)} />
                </span>
                <span className={styles.command}>⌘M</span>
            </div>
            {!!userinfo?.userId && (
                <div
                    className={classNames(styles.extraToolsBox, styles.extraToolsBox1, { [styles.show]: showModel })}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    onMouseEnter={(e) => {
                        disabledMove?.(true);
                    }}
                    onMouseLeave={(e) => {
                        disabledMove?.(false);
                    }}>
                    {immersiveTranslationPermission && (
                        <div
                            onMouseEnter={(e) => {
                                setShowSetting(true);
                            }}
                            onMouseLeave={(e) => {
                                setShowSetting(false);
                            }}
                            className={classNames('extra-tool', { hidden: !showSetting && !showModel })}
                            onClick={handleSetting}>
                            <Tooltip
                                placement="left"
                                title="对照式翻译设置"
                                getPopupContainer={(triggerNode: HTMLElement) =>
                                    triggerNode.parentElement || document.body
                                }>
                                <div className="circle-btn">
                                    <Icon component={Setting2Icon} className={styles.icon} />
                                </div>
                            </Tooltip>
                        </div>
                    )}
                    {immersiveTranslationPermission && (
                        <div
                            onMouseEnter={(e) => {
                                setShowSetting(true);
                            }}
                            onMouseLeave={(e) => {
                                setShowSetting(false);
                            }}
                            className="extra-tool">
                            <Tooltip
                                placement="left"
                                title={transOpen === 'true' ? '展示原文' : '对照式翻译'}
                                getPopupContainer={(triggerNode: HTMLElement) =>
                                    triggerNode.parentElement || document.body
                                }>
                                <div
                                    className={classNames('circle-btn', {
                                        'translate-btn': transOpen === 'true'
                                    })}
                                    onClick={handleTransToggle}>
                                    <TranslateIcon />
                                    <Icon
                                        component={CheckboxIcon}
                                        className={classNames('check-icon', {
                                            hidden: transOpen !== 'true'
                                        })}
                                    />
                                </div>
                            </Tooltip>
                        </div>
                    )}
                    {showReadArticle && (
                        <div className="extra-tool" onClick={readArticle}>
                            <Tooltip
                                placement="left"
                                title="阅读全文"
                                getPopupContainer={(triggerNode: HTMLElement) =>
                                    triggerNode.parentElement || document.body
                                }>
                                <div className="circle-btn">
                                    <BookIcon />
                                </div>
                            </Tooltip>
                        </div>
                    )}
                    {showModel && (
                        <div className="translate-settings-panel" onMouseEnter={mouseenter} onMouseLeave={mouseleave}>
                            <div className="inner-box">
                                <div className="title">对照翻译设置</div>
                                <div className="form-body">
                                    <div className="form-item">
                                        <div className="form-label">来源语言</div>
                                        <div className="form-value">
                                            <Select
                                                size="small"
                                                className="custom-select"
                                                value={fromLang}
                                                onChange={handleFromChange}
                                                options={OPT_LANGS_FROM.map(([lang, name]) => ({
                                                    value: lang,
                                                    label: name
                                                }))}
                                                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-item">
                                        <div className="form-label">目标语言</div>
                                        <div className="form-value">
                                            <Select
                                                size="small"
                                                className="custom-select"
                                                value={toLang}
                                                onChange={handleToChange}
                                                options={OPT_LANGS_TO.map(([lang, name]) => ({
                                                    value: lang,
                                                    label: name
                                                }))}
                                                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-item">
                                        <div className="form-label">翻译设置</div>
                                        <div className="form-value">
                                            <Select
                                                size="small"
                                                className="custom-select"
                                                value={autoSetting}
                                                onChange={handleAutoSettingChange}
                                                options={OPT_TRANSLATE_ALL.map(([setting, name]) => ({
                                                    value: setting,
                                                    label:
                                                        setting === AUTO_TRANSLATE_DOMAIN
                                                            ? `${name}${currentDomain}`
                                                            : name
                                                }))}
                                                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {!!userinfo?.userId && selectFlag && (
                <div
                    className={classNames(styles.extraToolsBox, styles.extraToolsBox2, {
                        [styles.show]: showSettingModel
                    })}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    onMouseEnter={(e) => {
                        disabledMove?.(true);
                    }}
                    onMouseLeave={(e) => {
                        disabledMove?.(false);
                    }}>
                    <div className="extra-tool" onClick={onOpenSettingModel}>
                        <Tooltip
                            placement="left"
                            title="设置"
                            getPopupContainer={(triggerNode: HTMLElement) =>
                                triggerNode.parentElement || document.body
                            }>
                            <div className="circle-btn">
                                <Icon component={SettingIcon} className={styles.icon} />
                            </div>
                        </Tooltip>
                    </div>
                    {showSettingModel && (
                        <div
                            className={styles.settingPanel}
                            onMouseEnter={onSettingModelMouseEnter}
                            onMouseLeave={onSettingModelMouseLeave}>
                            <div className={styles.innerBox}>
                                <span className={styles.label}>选中文本后的快捷指令</span>
                                <Switch
                                    checked={selectionSwitch}
                                    onChange={setSelectionSwitch}
                                    size="small"
                                    className={styles.switch}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
export default EntryBtn;
