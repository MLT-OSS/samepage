import ReactMarkdown from 'react-markdown';
import styles from './index.module.less';
import { Code } from '../code';

export interface MarkdownProps {
    data: string;
}

export const Markdown: React.FC<MarkdownProps> = (props) => {
    const { data } = props;

    return (
        <div className={styles.markdown}>
            <ReactMarkdown
                components={{
                    code({ node, inline, className, children, ...restProps }) {
                        return (
                            <Code inline={inline} className={className} {...restProps}>
                                {children}
                            </Code>
                        );
                    }
                }}>
                {data}
            </ReactMarkdown>
        </div>
    );
};
