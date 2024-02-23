/**
 * 代码展示组件
 */
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import styles from './index.module.less';
import React from 'react';
import { ReactComponent as CopyIcon } from '@/assets/images/copy.svg';
import Icon from '@ant-design/icons';
import copy from 'copy-to-clipboard';
import { App } from 'antd';
import classNames from 'classnames';

interface CodeProps {
    inline?: boolean;
    className?: string;
    [k: string]: any;
}

export const Code: React.FC<CodeProps> = (props) => {
    const { inline, className, children, ...restProps } = props;
    const { message } = App.useApp();

    const match = /language-(\w+)/.exec(className || '');
    const language = match?.[1] || ' ';

    const code = String(children).replace(/\n$/, '');

    const onCopy = () => {
        copy(code);
        const msg = '复制成功';
        message.success({
            key: msg,
            content: msg
        });
    };

    if (inline) {
        return (
            <code {...props} className={classNames(className, styles.inlineCode)}>
                {children}
            </code>
        );
    }

    return (
        <div className={styles.code}>
            <span className={styles.header}>
                <span className={styles.language}>{language}</span>
                <span className={styles.copy} onClick={onCopy}>
                    <Icon component={CopyIcon} className={styles.icon} />
                    <span>复制</span>
                </span>
            </span>
            <div className={styles.body}>
                <SyntaxHighlighter
                    {...restProps}
                    // eslint-disable-next-line react/no-children-prop
                    children={code}
                    style={docco}
                    language={language}
                    PreTag="div"
                    customStyle={{
                        background: '#fff'
                    }}
                />
            </div>
        </div>
    );
};
