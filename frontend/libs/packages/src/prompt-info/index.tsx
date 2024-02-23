/**
 * 提示词编辑/新增
 */
import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import styles from './index.module.less';
import { ReactComponent as TooltipIcon } from '@/assets/images/tooltip.svg';
import { ReactComponent as CloseIcon } from '@/assets/images/close.svg';

import { App, Button, Input, Modal, Form } from 'antd';
import Icon from '@ant-design/icons';
import { CUE_WORD } from '@/types';
import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';
import { DeleteModal } from '@xm/components';
const { TextArea } = Input;

interface Props {
    refresh: (type: number) => void;
}
export const PromptInfo = forwardRef(({ refresh }: Props, ref: any) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isDelVisible, setIsDelVisible] = useState<boolean>(false);
    const [data, setData] = useState<any>({});
    const deleteModalRef = useRef(null);
    const { message } = App.useApp();

    // 打开弹窗,传入信息
    useImperativeHandle(ref, () => {
        return {
            _showModal(info: CUE_WORD.CueWordItem | string) {
                if (typeof info === 'object') {
                    setData(info?.id ? info : {});
                } else {
                    setData({ content: info });
                }

                setIsVisible(true);
            }
        };
    });
    // 关闭弹窗
    const handleCancel = () => {
        setIsVisible(false);
    };

    // 创建/修改提示词
    const handleOk = () => {
        const { id, name, content } = data;
        const params: any = { name, content };
        if (id) params.id = id;
        postPrompts(params);
    };
    // 修改/创建 提示词
    const { run: postPrompts, loading: saveLoading } = useRequest(services.prompts.postPrompts, {
        manual: true,
        onSuccess: (res) => {
            setIsVisible(false);
            message.success((data?.id ? '修改' : '创建') + '成功');
            refresh(data?.id ? 2 : 1);
        }
    });

    // 点击删除
    const onDelClick = () => {
        setIsDelVisible(true);
        setIsVisible(false);
    };
    // 取消删除
    const handleDelCancel = () => {
        setIsDelVisible(false);
        setIsVisible(true);
    };
    // 确认删除
    const handleDelConfirm = () => {
        if (data?.id) deletePrompts(data.id);
    };

    const closeDeleteLoading = () => {
        const { _closeLoading } = deleteModalRef?.current || {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            _closeLoading: () => {}
        };
        _closeLoading();
    };

    // 删除提示词
    const { run: deletePrompts } = useRequest(services.prompts.deletePrompts, {
        manual: true,
        onSuccess: (res) => {
            closeDeleteLoading();
            setIsDelVisible(false);
            message.success('删除成功');
            refresh(1);
        },
        onError: () => {
            closeDeleteLoading();
        }
    });
    // input输入,去除input-error
    const changeValue = (change: any) => {
        setData({ ...data, ...change });
    };
    // 获取弹窗表头
    const getTitle = () => {
        return <div style={{ textAlign: 'center' }}>{!data.id ? '新增' : '编辑'}提示词</div>;
    };
    // 获取操作按钮, 编辑状态有删除按钮
    const getFooter = () => {
        return (
            <div className="form-button">
                <div>
                    {data.id && (
                        <Button
                            className={styles.del}
                            key="del"
                            onClick={onDelClick}
                            type="text"
                            danger
                            style={{ float: 'left' }}>
                            删除
                        </Button>
                    )}
                </div>
                <div>
                    <Button className={styles.cancel} key="back" onClick={handleCancel}>
                        取消
                    </Button>
                    <Button
                        className={styles.save}
                        type="primary"
                        key="link"
                        htmlType="submit"
                        // onClick={handleOk}
                        loading={saveLoading}>
                        保存
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <>
            <>
                <Modal
                    wrapClassName={styles['modal-content']}
                    width={400}
                    title={getTitle()}
                    open={isVisible}
                    closeIcon={<CloseIcon />}
                    onCancel={handleCancel}
                    centered
                    destroyOnClose={true}
                    footer={<></>}
                    maskClosable={false}>
                    <div className={styles['cue-word-modal']}>
                        <span className="type">提示词类型：我的提示词</span>
                        <p className="p-style">名称</p>

                        <Form
                            initialValues={{
                                name: data?.name,
                                content: data?.content
                            }}
                            onFinish={handleOk}
                            name="prompt-info"
                            autoComplete="off">
                            <Form.Item
                                name="name"
                                validateTrigger={['onChange', 'onBlur']}
                                rules={[
                                    { required: true, message: '请输入提示词名称!' },
                                    { whitespace: true, message: '不能为全空格' },
                                    { type: 'string', min: 1, max: 40, message: '请输入1-40 个字的提示词名称' }
                                ]}>
                                <Input
                                    className="input-style"
                                    value={data?.name}
                                    onChange={(e) => changeValue({ name: e.target.value })}
                                    width={16}
                                    placeholder="提示词名称"
                                />
                            </Form.Item>
                            <div className="form-label">
                                <span className="label">提示词</span>
                                <span className="info">
                                    <Icon component={TooltipIcon} className="icon" />
                                    使用方括号 [ ] 来指定用户输入
                                </span>
                            </div>
                            <Form.Item
                                name="content"
                                validateTrigger={['onChange', 'onBlur']}
                                rules={[
                                    { required: true, message: '请输入提示词内容!' },
                                    { whitespace: true, message: '不能为全空格' }
                                ]}>
                                <TextArea
                                    className="input-style"
                                    placeholder="例如：撰写有关[TOPIC]的文章，请确保包含以下关键字：[KEYWORDS]"
                                    autoSize={{ minRows: 6, maxRows: 12 }}
                                    value={data?.content}
                                    onChange={(e) => changeValue({ content: e.target.value })}
                                />
                            </Form.Item>
                            <Form.Item>{getFooter()}</Form.Item>
                        </Form>
                    </div>
                </Modal>
                <DeleteModal
                    ref={deleteModalRef}
                    open={isDelVisible}
                    content={
                        <p>
                            您确定要删除【{data?.name}】的提示词吗？
                            <br />
                            此操作无法撤销。
                        </p>
                    }
                    onCancel={handleDelCancel}
                    onOk={handleDelConfirm}
                />
            </>
        </>
    );
});
