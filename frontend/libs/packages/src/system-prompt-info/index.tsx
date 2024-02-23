/**
 * 提示词编辑/新增
 */
import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from './index.module.less';
import { ReactComponent as CopyIcon } from '@/assets/images/copy.svg';
import { ReactComponent as CloseIcon } from '@/assets/images/close.svg';

import { App, Button, Input, Modal } from 'antd';
import Icon from '@ant-design/icons';
import copy from 'copy-to-clipboard';
import { getPromptVars } from '@/utils';

const { TextArea } = Input;

interface Props {
    showDrawer: (info: any) => void;
    fillInInput: (text: string) => void;
}
export const SystemPromptInfo = forwardRef(({ showDrawer, fillInInput }: Props, ref: any) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [data, setData] = useState<any>({});
    const { message } = App.useApp();

    // 打开弹窗,传入信息
    useImperativeHandle(ref, () => {
        return {
            _showSystemModal(info: any) {
                setData(info || {});
                setIsVisible(true);
            }
        };
    });
    // 关闭弹窗
    const handleCancel = () => {
        setIsVisible(false);
    };
    // 跳转判断 1.还有变量 弹出使用抽屉 2.没有变量 映射到发送框
    const handleOk = () => {
        const variable: any = getPromptVars(data.content);
        const datas = { ...data, ...{ variableType: variable.length > 0 ? 1 : 2, variable } };
        setIsVisible(false);
        if (variable.length > 0) {
            showDrawer(datas);
        } else {
            fillInInput(data.content);
        }
    };
    // 复制提示词内容
    const onCopy = () => {
        copy(data.content);
        const msg = '复制成功';
        message.success({
            key: msg,
            content: msg
        });
    };
    return (
        <div>
            <Modal
                className={styles['modal-info-system']}
                centered
                width={400}
                title={<span className={styles.title}>{data?.name}</span>}
                open={isVisible}
                closeIcon={<CloseIcon />}
                onCancel={handleCancel}
                footer={[
                    <Button type="primary" key="link" onClick={handleOk}>
                        使用
                    </Button>
                ]}
                maskClosable={false}>
                <div className={styles['cue-word-modal']}>
                    <div>
                        <span className="p-style">提示词</span>
                        <span className="input-tooltip-icon" style={{ fontSize: 16, marginRight: '4px' }}>
                            <Icon component={CopyIcon} onClick={onCopy} />
                        </span>
                    </div>
                    <TextArea
                        className={styles['input-style']}
                        value={data?.content}
                        autoSize={{ minRows: 6, maxRows: 12 }}
                        readOnly
                    />
                </div>
            </Modal>
        </div>
    );
});
