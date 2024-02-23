/**
 * 提示词内容
 */
import styles from './index.module.less';
import { ReactComponent as EditIcon } from '@/assets/images/prompts-edit.svg';
import { ReactComponent as TooltipIcon } from '@/assets/images/tooltip-black.svg';
import { getPromptVars } from '@/utils';
import Icon from '@ant-design/icons';

interface Props {
    info: any;
    showDrawer: (params: any) => void;
    editCueWord: (params: any) => void;
    viewCueWord: (params: any) => void;
}
export const PromptCard = ({ info, showDrawer, editCueWord, viewCueWord }: Props) => {
    const openModal = () => {
        const variable: any = getPromptVars(info.content);
        const data = { ...info, ...{ variableType: variable.length > 0 ? 1 : 2, variable } };
        showDrawer(data);
    };
    const showTitle = info.name?.length > 13 ? info.name?.substring(0, 13) + '...' : info.name;
    return (
        <div className={styles['list-card']} onClick={openModal}>
            <div className={styles.item}>
                <div>
                    <span className={styles.title}>{showTitle}</span>
                    <br />
                    <span className={styles.content}>{info.content}</span>
                </div>
                <div className={styles['info-operate']}>
                    {info.type === 'user_custom' ? (
                        <Icon
                            className={styles.edit}
                            component={EditIcon}
                            onClick={(e) => {
                                e.stopPropagation();
                                editCueWord(info);
                            }}
                        />
                    ) : (
                        <Icon
                            className={styles.tooltip}
                            component={TooltipIcon}
                            onClick={(e) => {
                                e.stopPropagation();
                                viewCueWord(info);
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
