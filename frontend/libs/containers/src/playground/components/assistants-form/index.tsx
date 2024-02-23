import services from '@xm/services';
import { Button, Checkbox, Form, Input, message, Select, Upload } from 'antd';
import { map } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import useRequest from '@ahooksjs/use-request';
import style from './index.module.less';
import RecommendQuestion from './recommend';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;
interface FormProps {
    id?: string; // id
    data: any; // 编辑时的数据
    onSave: (data: any) => void; // 点击保存
    toSetAssistantTitle: (title: any) => void; // 设置assistant标题
}
export const AssistantsFrom = (props: FormProps) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { id, data } = props;
    const [isShowButton, setIsShowButton] = useState(false);
    const [fileList, setFileList] = useState<any>([]);
    const [imageBase64, setImageBase64] = useState<string>();

    // 编辑时回显
    useEffect(() => {
        if (data) {
            if (data.tools) {
                data.tools = data.tools.map((item: any) => item.type);
            }
            if (data.files) {
                const arr = map(data.files, (i: any) => {
                    return {
                        id: i.id,
                        name: i.filename,
                        status: 'done'
                    };
                });
                setFileList(arr);
                form.setFieldValue(
                    'fileIds',
                    arr.map((i: any) => i.id)
                );
            }
            setImageBase64(data.icon);
            form.setFieldsValue(data);
        }
    }, [data]);

    // 点击保存
    const handleSave = () => {
        // 刷新当前页面
        form.validateFields().then((values) => {
            let tools = [];
            tools = values.tools?.map((item: any) => {
                return {
                    type: item
                };
            });
            const val = { ...values, ...{ icon: imageBase64, tools } };
            if (id) val.id = id;
            id ? runUpBot(val, 'assistant_chat') : runAddBot(val, 'assistant_chat');
        });
    };
    // 上传
    const uploadProps = {
        multiple: true,
        onChange: (res: any) => {
            // // size超过10m的文件不上传
            // res.fileList = res.fileList.filter((i: any) => i.size / 1024 / 1024 < 10);
            // 最多上传10个文件,超过10个文件不上传,并且只显示最新上传的10个文件
            if (res.fileList.length > 10) {
                message.error({ key: 'lt10', content: '最多上传10个文件' });
                res.fileList = res.fileList.slice(0, 10);
            }
            setFileList(res.fileList);
            if (res.fileList.every((i: any) => i.status === 'done')) {
                const arr = res.fileList.map((i: any) => {
                    if (i.response?.data) return i.response.data;
                    return i;
                });
                form.setFieldValue(
                    'fileIds',
                    arr.map((i: any) => i.id)
                );
            }
        },
        fileList,
        action: '/api/file/assistant_chat/upload'
    };
    // 监听form变化
    const handelValueChange = () => {
        setIsShowButton(true);
    };

    const [dictModel, setDictModel] = useState<any>([]);
    useRequest(services.assistants.getDictModel, {
        onSuccess: (res) => {
            setDictModel(res);
        }
    });

    // 请求新建接口
    const { loading: addLoading, run: runAddBot } = useRequest(services.assistants.addBot, {
        manual: true,
        onSuccess: (res) => {
            message.success('保存成功');
            setIsShowButton(false);
            navigate('/configure?id=' + res.id);
        }
    });
    // 请求编辑接口
    const { loading: upLoading, run: runUpBot } = useRequest(services.assistants.upBot, {
        manual: true,
        onSuccess: (res) => {
            message.success('保存成功');
            props.onSave(res);
            setIsShowButton(false);
        }
    });

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const beforeUpload = (file: any) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
            return;
        }
        const isLt200k = file.size / 1024 < 200;

        if (!isLt200k) {
            message.error({ key: 'Image must smaller than 200kb!', content: '图片必须小于200kb!' });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result; // 文件的 Base64 字符串
            setImageBase64(base64 as string);
            // 在这里处理 base64 字符串，例如存储到 state 中或发送到服务器
        };
        reader.readAsDataURL(file);
        return false; // 阻止默认的上传行为
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const hiddenButtonRef = React.useRef<HTMLButtonElement>(null);

    const handleVisibleButtonClick = () => {
        if (hiddenButtonRef.current) {
            hiddenButtonRef.current.click();
        }
    };

    return (
        <>
            <Form
                className={style['assistants-form']}
                form={form}
                name="basic"
                layout="vertical"
                autoComplete="off"
                onValuesChange={handelValueChange}>
                <div className="assistants-form-body">
                    <Form.Item
                        label="图标"
                        name="icon"
                        className="icon-style"
                        rules={[{ required: true, message: '请上传一个模型图标' }]}
                        getValueFromEvent={normFile}>
                        <Upload
                            showUploadList={{ showPreviewIcon: false }}
                            fileList={
                                imageBase64
                                    ? [{ uid: '-1', name: 'image.png', status: 'done', thumbUrl: imageBase64 }]
                                    : []
                            }
                            listType="picture-circle"
                            beforeUpload={beforeUpload}
                            onRemove={() => {
                                setImageBase64('');
                            }}
                            accept="image/*">
                            {!imageBase64 && uploadButton}
                        </Upload>
                    </Form.Item>

                    <Form.Item label="名称" name="name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="描述" name="desc" rules={[{ required: true }]}>
                        <TextArea style={{ height: 60, resize: 'none' }} />
                    </Form.Item>

                    <Form.Item label="配置信息" name="instructions" rules={[{ required: true }]}>
                        <TextArea style={{ height: 110, resize: 'none' }} />
                    </Form.Item>

                    <Form.Item label="模型选择" name="model" rules={[{ required: true, message: '请选择模型' }]}>
                        <Select>
                            {map(dictModel, (item) => {
                                return (
                                    <Option key={`${item.modelName}`} value={item.modelName}>
                                        {item.name}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    {/* 推荐问题 */}
                    <RecommendQuestion />
                    <Form.Item label="模型能力调用" name="tools">
                        <Checkbox.Group>
                            <Checkbox value="web_search">联网搜索</Checkbox>
                            <Checkbox value="retrieval">文件检索</Checkbox>
                        </Checkbox.Group>
                    </Form.Item>

                    <Form.Item className="form-style-upload" label="知识库文件" labelAlign="left" name="fileIds">
                        <Upload {...uploadProps} accept=".pdf,.txt,.md,.html">
                            <Button ref={hiddenButtonRef} style={{ display: 'none' }} />
                        </Upload>
                    </Form.Item>

                    <div className="add-files">
                        <Button className="upload-btn" onClick={handleVisibleButtonClick}>
                            添加知识库文件
                        </Button>
                    </div>
                </div>

                <div className="footer-button">
                    {isShowButton && (
                        <Button
                            type="primary"
                            loading={addLoading || upLoading}
                            className="footer-button-save"
                            onClick={handleSave}>
                            保存
                        </Button>
                    )}
                </div>
            </Form>
        </>
    );
};
