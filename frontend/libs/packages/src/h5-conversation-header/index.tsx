import { useConversationContext } from '@xm/context';
import { NavBar, H5Select } from '@xm/components';
import { useModelPermission, TLanguage, TSetLang, useUserInfo } from '@xm/hooks';

import { ReactComponent as ShopIcon } from '@/common/assets/images/h5/shop.svg';
import { ReactComponent as LangIcon } from '@/common/assets/images/h5/lang.svg';

import styles from './index.module.less';
import { H5HeaderUser } from '../h5-header-user';

interface IH5ConversationHeaderProps {
    lang?: TLanguage;
    langChnage?: TSetLang;
    onModelsClick?: () => void;
    onUserClick?: () => void;
    onLangClick?: () => void;
}

export const H5ConversationHeader = (props: IH5ConversationHeaderProps) => {
    const { conversationState } = useConversationContext();
    const { langOptions, langPermission } = useModelPermission();
    const { modelInfo } = conversationState;
    const { lang, langChnage, onModelsClick, onUserClick, onLangClick } = props;

    const handleLangChange = (value: string) => {
        langChnage?.(value, false);
    };

    return (
        <div className={styles.h5ConversationHeader}>
            <NavBar
                leftIcon={<ShopIcon onClick={onModelsClick} />}
                leftContent={modelInfo?.name}
                rightContent={
                    <div className={styles.rightContent}>
                        <H5HeaderUser onClick={onUserClick} />
                        {langPermission && langOptions?.length > 0 && (
                            <H5Select
                                style={{ marginLeft: '24px' }}
                                value={lang}
                                options={langOptions}
                                onChange={handleLangChange}>
                                <LangIcon onClick={onLangClick} />
                            </H5Select>
                        )}
                    </div>
                }
            />
        </div>
    );
};
