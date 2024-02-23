/**
 * 提示词编辑/新增
 */
import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from './index.module.less';
import { ReactComponent as DetailIcon } from '@/assets/images/detail.svg';
import { Button, Drawer, Input, Select } from 'antd';
import Icon from '@ant-design/icons';
import { IconWapper } from '@xm/components';
import { ReactComponent as CloseIcon } from '@/assets/images/close.svg';
import { TLanguage, useModelPermission } from '@xm/hooks';
import { replaceByIdx } from '@/utils';

const PROMPT_VARS_PREFIX = '_XM_PROMPT_VAR_';

interface Props {
    openCueWordDetail: (info: any) => void;
    sendToConversation: (text: string) => void;
    showLang?: boolean;
    lang: TLanguage;
    setLang: (info: TLanguage) => void;
}
export const PromptUse = forwardRef(
    ({ openCueWordDetail, sendToConversation, lang, setLang, showLang = true }: Props, ref: any) => {
        const [open, setOpen] = useState<boolean>(false);

        const [data, setData] = useState<any>({}); // 当前提示词信息
        const [tempContent, setTempContent] = useState<string>(''); // 临时的 content, 给变量加前缀
        const [errors, setErrors] = useState<string[]>([]);
        const [variableValue, setVariableValue] = useState<any>({}); // 存储变量的值， key 是 prompt 前缀加索引的形式， eg: _XM_PROMPT_VAR_0

        const { langOptions } = useModelPermission();
        // 打开抽屉,传入信息
        useImperativeHandle(ref, () => {
            return {
                _showDrawer(info: any) {
                    setData(info);
                    handelVariable(info);
                    setOpen(true);
                    setErrors([]);
                }
            };
        });
        // 判断提示词是否有变量
        const handelVariable = (info: any) => {
            const { content, variable } = info;
            let newContent = content;
            const values: any = {};
            variable.forEach((item: string, idx: number) => {
                newContent = newContent.replace(`[${item}]`, `[${PROMPT_VARS_PREFIX}${idx}]`);
                values[`${PROMPT_VARS_PREFIX}${idx}`] = '';
            });
            setVariableValue(values);
            setTempContent(newContent);
        };
        // 关闭
        const onClose = () => {
            setOpen(false);
        };
        const handleError = (value: string, idx: number, field = '') => {
            let errorMsg = '';
            if (!value) {
                errorMsg = `请输入${field}`;
            } else if (!value.trim()) {
                errorMsg = `${field}不能为空字符`;
            }
            setErrors((oldErrors) => replaceByIdx<string>(oldErrors, idx, errorMsg));
            return errorMsg;
        };
        // 提示变量输入
        const onChange = (value: string, idx: number, field: string) => {
            // 1. 设置对应值
            setVariableValue({
                ...variableValue,
                [`${PROMPT_VARS_PREFIX}${idx}`]: value
            });
            // 2. 设置对应错误状态
            handleError(value, idx, field);
        };
        const onBlur = (idx: number, field: string) => {
            const value = variableValue[`${PROMPT_VARS_PREFIX}${idx}`];
            handleError(value, idx, field);
        };

        // 点击查看提示词详情
        const openDetail = () => {
            setOpen(false);
            openCueWordDetail(data);
        };
        // 获取发送内容
        const genSendText = () => {
            let value = tempContent;
            Object.keys(variableValue).forEach((item: any) => {
                value = value.replace('[' + item + ']', variableValue[item]);
            });
            return value;
        };
        const formValidate = () => {
            const { variable } = data;
            const newErrors = Object.keys(variableValue).map((k, idx) => {
                return handleError(variableValue[k], idx, variable[idx]);
            });
            return !newErrors.some(Boolean);
        };
        // 发送
        const sendConfirm = () => {
            // 校验表单合法性
            if (!formValidate()) {
                return;
            }
            // 发送
            const sendValue = genSendText();
            sendToConversation(sendValue);
            onClose();
        };
        return (
            <div>
                <Drawer
                    rootClassName={styles.drawerUse}
                    style={{ borderRadius: '20px 20px 0px 0px', background: '#FFF' }}
                    contentWrapperStyle={{ borderRadius: '20px 20px 0px 0px', background: '#FFF' }}
                    title={<span className={styles.title}>{data?.name}</span>}
                    placement="bottom"
                    onClose={onClose}
                    extra={
                        <IconWapper>
                            <Icon component={CloseIcon} onClick={onClose} />
                        </IconWapper>
                    }
                    headerStyle={{
                        color: 'rgba(0, 0, 0, 0.75)',
                        border: 0,
                        padding: '14px 16px'
                    }}
                    bodyStyle={{
                        overflowY: 'clip',
                        padding: '16px',
                        paddingTop: 0
                    }}
                    closable={false}
                    open={open}>
                    <div className={styles.options} style={{ marginBottom: 5 }}>
                        <div>
                            <a style={{ cursor: 'pointer' }} onClick={openDetail}>
                                <span className={styles['goto-detail']}>查看提示词详情</span>
                                <Icon className={styles['goto-detail-icon']} component={DetailIcon} />
                            </a>
                        </div>
                        {showLang && (
                            <div>
                                <Select
                                    size="small"
                                    style={{ width: '65px' }}
                                    options={langOptions}
                                    value={lang}
                                    onChange={setLang}
                                />
                            </div>
                        )}
                    </div>

                    <div style={{ maxHeight: 280, minHeight: 150, overflowY: 'auto' }}>
                        {data?.variable?.map((item: any, idx: any) => {
                            return (
                                <span key={idx}>
                                    <p className={styles.labelStyle}>{item}</p>
                                    <Input
                                        className={styles.inputStyle}
                                        width={16}
                                        placeholder={`请输入${item}`}
                                        status={errors[idx] ? 'error' : undefined}
                                        value={variableValue[`${PROMPT_VARS_PREFIX}${idx}`]}
                                        onChange={(e) => onChange(e.target.value, idx, item)}
                                        onBlur={() => onBlur(idx, item)}
                                    />
                                    <div className={styles.errorStyle}>{errors[idx] || ''}</div>
                                </span>
                            );
                        })}
                    </div>

                    <Button type="primary" key="link" className={styles.send} onClick={sendConfirm}>
                        发送
                    </Button>
                </Drawer>
            </div>
        );
    }
);
