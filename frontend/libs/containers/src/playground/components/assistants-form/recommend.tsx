import React from 'react';
import { MinusCircleFilled } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';

const App: React.FC = () => {
    return (
        <>
            <Form.List name={['welcome', 'questions']}>
                {(fields, { add, remove }, { errors }) => (
                    <>
                        {fields.map((field, index) => (
                            <Form.Item
                                initialValue=""
                                label={index === 0 ? '推荐问题' : ''}
                                required={false}
                                key={field.key}>
                                <Form.Item
                                    {...field}
                                    validateTrigger={['onChange', 'onBlur']}
                                    rules={[
                                        {
                                            required: true,
                                            whitespace: true,
                                            message: '请输入推荐问题或者删除该项'
                                        }
                                    ]}
                                    noStyle>
                                    <Input placeholder="请输入问题" style={{ width: '100%' }} />
                                </Form.Item>
                                <MinusCircleFilled
                                    className="dynamic-delete-button"
                                    onClick={() => remove(field.name)}
                                />
                            </Form.Item>
                        ))}
                        {fields.length < 6 && (
                            <Form.Item>
                                <Button onClick={() => add()} className="upload-btn">
                                    添加推荐问题
                                </Button>
                            </Form.Item>
                        )}
                    </>
                )}
            </Form.List>
        </>
    );
};

export default App;
