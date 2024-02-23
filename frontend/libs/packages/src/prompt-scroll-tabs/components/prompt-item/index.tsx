/**
 * 提示词内容
 */
import cl from 'classnames';
import styles from './index.module.less';
import { ReactComponent as EditIcon } from '@/assets/images/edit.svg';
import { ReactComponent as SortIcon } from '@/assets/images/my-cue-word-sort.svg';
import Icon from '@ant-design/icons';
import type { CUE_WORD } from '@/types';
import { isH5 } from '@/utils';

interface PromptItemProps {
    type: string;
    info: CUE_WORD.PromptRecordItem;
    showDrawer: (params: any) => void;
    editCueWord: (params: any) => void;
}

export const PromptItem = ({ type, info, showDrawer, editCueWord }: PromptItemProps) => {
    return (
        <div className={cl(styles.piece, { [styles.h5Piece]: isH5 })}>
            <div
                className={styles['piece-info']}
                onClick={() => {
                    showDrawer(info);
                }}>
                <Icon component={SortIcon} className={styles.icon} />
                <span className={styles.title}>{info.name}</span>
            </div>

            {type === 'user_custom' && (
                <span className={styles.operate}>
                    <Icon
                        className={styles.icon}
                        component={EditIcon}
                        onClick={() => {
                            editCueWord(info);
                        }}
                    />
                </span>
            )}
        </div>
    );
};
