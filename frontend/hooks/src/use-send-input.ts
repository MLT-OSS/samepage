/**
 * 获取发送输入框相关的方法
 *
 * 1. 处理组合输入
 * 2. 处理回车&换行快捷键
 * 3. 发送之后清空消息
 */
import { FormInstance } from 'antd';
import { TextAreaRef } from 'antd/es/input/TextArea';
import { useCallback, useRef, useState } from 'react';

/* eslint-disable max-params */
export const useSendInput = (
    form: FormInstance,
    field: string,
    sendFn?: (text: string, files?: []) => any,
    clearFileInput?: () => any
) => {
    const inputRef = useRef<TextAreaRef>(null);
    const isComposition = useRef<boolean>(false);
    const [content, setContent] = useState<string>('');
    const [files, setFiles] = useState<[]>([]);

    const onInputChange = (e: any) => {
        if (!isComposition.current) {
            const question = e.target.value;
            setContent(question);
        }
    };

    const onCompositionEvent = (e: any) => {
        if (e.type === 'compositionend') {
            isComposition.current = false;
            onInputChange(e);
        } else {
            isComposition.current = true;
        }
    };

    const onInputClear = () => {
        setFieldValue('');
        if (clearFileInput) clearFileInput();
    };

    const onSend = () => {
        const trimContent = content?.trim();
        if (trimContent || files.length) {
            // 1. 发送消息
            const sendError = sendFn?.(trimContent, files);
            // 2. 清空输入框
            if (!sendError) {
                onInputClear();
            }
        }
    };

    const onKeyDown = (e: any, disabled?: boolean) => {
        // metaKey: Mac 指的是 ⌘, windows 指的是 window
        const isOptionKey = e.ctrlKey || e.metaKey || e.shiftKey;
        // 功能键 + enter 回车
        if (isOptionKey && e.which === 13) {
            const _textAreaRef_ = inputRef?.current?.resizableTextArea?.textArea;
            if (_textAreaRef_) {
                const { selectionStart = 0, selectionEnd = 0 } = _textAreaRef_;
                const enterContent = `${content.slice(0, selectionStart)}${`\n`}${content.slice(selectionEnd)}`;

                setFieldValue(enterContent);
                // 保持光标位置
                setTimeout(() => {
                    inputRef?.current?.resizableTextArea?.textArea.setSelectionRange(
                        selectionStart + 1,
                        selectionStart + 1
                    );
                }, 0);
            }
            e.preventDefault();
        }
        // 没有功能键 + enter 发送（并阻止textArea的默认事件）
        if (!isOptionKey && e.which === 13) {
            if (!disabled) {
                onSend();
            }
            e.preventDefault();
        }
    };

    const setFieldValue = useCallback(
        (text: string) => {
            if (form) form.setFieldValue(field, text);
            setContent(text);
        },
        [form, field, setContent]
    );

    return {
        ref: inputRef,
        content,
        files,
        setFieldValue,
        onInputChange,
        onCompositionEvent,
        onKeyDown,
        onInputClear,
        setContent,
        onSend,
        setFiles
    };
};
