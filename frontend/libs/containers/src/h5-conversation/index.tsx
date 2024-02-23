import { useOutletContext } from 'react-router-dom';
import { Conversation } from '../conversation';

import type { ILangConfig } from '@/types';

import styles from './index.module.less';

export const H5Conversation = () => {
    const { langConfig } = useOutletContext<{ langConfig: ILangConfig }>();
    return <Conversation showPrompt={false} langConfig={langConfig} />;
};
